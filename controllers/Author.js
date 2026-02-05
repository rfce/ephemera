const { fileDownloader } = require("../middleware/Helper")
const Image = require("../models/Image")
const Message = require("../models/Message")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Author = require('../models/Author')

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

    const message = await Message.findOne({ active: true })

    let skip = id
    let hasdash = false

    // Just the first image would've "-note"
    if (id.includes("-")) {
        const [zero, one] = id.split("-")

        skip = zero
        hasdash = true
    }

    const image = await Image.findOne({
        _id: message.image[skip - 1]
    })

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
                    timestamp: new Date()
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

const loginUser = async (req, res) => {
    const { username, password } = req.body

    if (typeof username !== 'string' || username.trim() === '') {
        return res.json({
            success: false,
            message: "Username is required"
        })
    }

    const user = await Author.findOne({ username })

    if (user === null) {
        return res.json({
            success: false,
            message: "The username you entered doesn't belong to an account. Please check your username and try again. "
        })
    }

    const hashed = user.password

    const match = await bcrypt.compare(password, hashed)

    // Incorrect password
    if (match === false) {
        return res.json({
            success: false,
            message: "Sorry, your password was incorrect. Please double-check your password."
        })
    }

    const token = jwt.sign({
        _id: user._id,
        username: user.username,
        fname: user.fname
    }, process.env.JWT_ACCESS_TOKEN)
    
    res.json({
        success: true,
        message: "Logged in as " + username,
        token
    })
}

const registerUser = async (req, res) => {
    const { fname, username, password } = req.body

    if (typeof fname !== 'string' || fname.trim() === '') {
        return res.json({
            success: false,
            message: "Name is required"
        })
    }
    
    // Validate username format
    if (username) {
        if (username.length < 4 || username.length > 20) {
            return res.json({
                success: false,
                message: "Username must be 4-20 characters long"
            })
        }

        if (username.startsWith("-") || username.endsWith("-")) {
            return res.json({
                success: false,
                message: "Username can't start or end with hyphen"
            })
        }

        const match = username.match(/[~`\\!@#$%^'&*\(\)_+=\|{}\[\]":;<>,\.\?]/g)

        if (match !== null) {
            return res.json({
                success: false,
                message: "Username can contain alphabets, numbers and hyphen"
            })
        }
    } else {
        return res.json({
            success: false,
            message: "Username is required"
        })
    }

    // Validate password
    // Password must include capital, small alphabets, numbers and a symbol
    if (password) {
        //  Password should have atleast eight characters
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password should have atleast eight characters"
            })
        }

        const small = password.match(/[a-z]+/g)
        const capital = password.match(/[A-Z]+/g)
        const number = password.match(/[0-9]+/g)
        const symbol = password.match(/[-+~`@#$%^&*()_={}\[\]\/:;"'<>,?\.]+/g)
        
        if (small === null || capital === null || symbol === null || number === null) {
            return res.json({
                success: false,
                message: "Password must include capital, small alphabets, numbers and a symbol"
            })
        }
    } else {
        return res.json({
            success: false,
            message: "Password is required"
        })
    }

    const hashed = await bcrypt.hash(password, 10)

    // Check for duplicate username
    const duplicate = await Author.findOne({ username })

    if (duplicate) {
        return res.json({
            success: false,
            message: "This username isn't available. Please try another."
        })
    }

    // Save new user to database
    await Author.create({
        fname, username, password: hashed
    })

    const token = jwt.sign({ username }, process.env.JWT_ACCESS_TOKEN)

    res.json({
        success: true,
        message: "User registered successfully",
        token
    })
}

module.exports = {
    uploadImage,
    keepAlive,
    fetchImage,
    activeMessage,
    loginUser,
    registerUser
}
