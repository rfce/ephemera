const { fileDownloader } = require("../middleware/Helper")
const Image = require("../models/Image")

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

    await Image.create({ blob: image })
    
    res.json({
        success: true,
        message: "Upload success",
        file
    })
}

const fetchImage = async (req, res) => {
    const ua = req.get('User-Agent')

    // Get the IP Address
    // We check 'x-forwarded-for' first because if you are on a cloud host, 
    // req.ip often returns the internal load balancer IP, not the real user.
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip

    console.log(`+++ Ping received from: ${ip}\n+++ Client device: ${ua}`)

    const image = await Image.findOne({})
    
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

const keepAlive = async (req, res) => {
    const ua = req.get('User-Agent')

    // Get the IP Address
    // We check 'x-forwarded-for' first because if you are on a cloud host, 
    // req.ip often returns the internal load balancer IP, not the real user.
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip

    console.log(`+ Ping received from: ${ip}\n+ Client device: ${ua}`)

    res.json({
        success: true,
        message: "Web Service active"
    })
}

module.exports = {
    uploadImage,
    keepAlive,
    fetchImage
}
