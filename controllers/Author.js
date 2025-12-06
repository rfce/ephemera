const { fileDownloader } = require("../middleware/Helper")

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
    
    res.json({
        success: true,
        message: "Upload success",
        file
    })
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
    keepAlive
}
