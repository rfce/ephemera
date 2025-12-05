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

const info = async (req, res) => {
    
    res.json({
        success: true,
        message: "Upload success"
    })
}

module.exports = {
    uploadImage,
    info
}
