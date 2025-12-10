const { fileDownloader } = require("../middleware/Helper")
const Image = require("../models/Image")
const Message = require("../models/Message")

const uploadImage = async (req, res) => {
    const { image } = req.body

    if (!image) {
        return res.json({
            success: false,
            message: "Please send an encoded image"
        })
    }

    const file = await fileDownloader("spoon", image)

    if (file === false) {
        return res.json({
            success: false,
            message: "Invalid encoded image"
        })
    }

    const created = await Image.create({ blob: image })

    const id = created._id

    const message = await Message.findOne({ active: true })

    // No active message box, create one
    if (message === null) {
        await Message.create({ image: [id], active: true })

        return res.json({
            success: true,
            message: "Upload success",
            file
        })
    }

    const count = message.image.length

    // Just update the message box with image
    if (count < 7) {
        await Message.findOneAndUpdate({ active: true }, {
            $push: { image: id }
        })

        return res.json({
            success: true,
            message: "Upload success",
            file
        })
    }

    // Message full with seven images, create a new active message
    await Message.findOneAndUpdate({ active: true }, {
        active: false
    })

    await Message.create({ image: [id], active: true })

    res.json({
        success: true,
        message: "Upload success",
        file
    })
}

const fetchImage = async (req, res) => {
    const id = req.params.id

    const ua = req.get('User-Agent')

    // Get the IP Address
    // We check 'x-forwarded-for' first because if you are on a cloud host, 
    // req.ip often returns the internal load balancer IP, not the real user.
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip

    if (ua.includes("Windows NT 10.0; Win64; x64") === false && ua.includes("Chrome/142.0.0.0") === false) {
        console.log(`+++ Ping received from: ${ip}\n+++ Client device: ${ua}`)
    }

    let skip = id
    let hasdash = false

    // Just the first image would've "-note"
    if (id.includes("-")) {
        const [zero, one] = id.split("-")

        skip = zero
        hasdash = true
    }

    const image = await Image.findOne({}).skip(skip - 1)

    if (image === null) {
        const emptyBuffer = Buffer.alloc(0)

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': emptyBuffer.length
        })

        return res.end(emptyBuffer)
    }

    // Save the timestamp to message
    if (hasdash) {
        const update = {
            $push: {
                unix: {
                    ip,
                    ua,
                    timestamp: new Date().toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata"
                    })
                }
            },
            seen: true
        }

        await Message.findOneAndUpdate({ active: true }, update)
    }

    // We must strip this prefix to get the raw data
    const matches = image.blob.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

    if (!matches || matches.length !== 3) {
        return res.status(500).send('Invalid Base64 string')
    }

    const imageType = matches[1] // e.g., "image/png"
    const rawBase64 = matches[2] // The actual data characters

    // Convert the cleaned Base64 string into a binary Buffer
    const imgBuffer = Buffer.from(rawBase64, 'base64')

    // Tell the browser this is an image, not text
    res.writeHead(200, {
        'Content-Type': imageType,
        'Content-Length': imgBuffer.length
    })

    // Send the binary data
    res.end(imgBuffer)
}

const activeMessage = async (req, res) => {
    const message = await Message.findOne({ active: true })

    if (message && message.unix) {
        message.unix = message.unix.reverse()
    }

    res.json({
        success: true,
        message
    })
}

const keepAlive = async (req, res) => {
    const ua = req.get('User-Agent')

    // Get the IP Address
    // We check 'x-forwarded-for' first because if you are on a cloud host, 
    // req.ip often returns the internal load balancer IP, not the real user.
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip

    console.log(`+ Ping received from: ${ip}\n+ Client device: ${ua}`)

    // Keep mongodb in sync so it doesn't get inactive
    const image = await Image.findOne({})

    res.json({
        success: true,
        message: "Web Service and database active"
    })
}

module.exports = {
    uploadImage,
    keepAlive,
    fetchImage,
    activeMessage
}
