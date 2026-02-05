const { fives, threeies, escapeRegex } = require("../middleware/Helper")
const Message = require("../models/Message")
const Recipient = require("../models/Recipient")
const Track = require("../models/Track")

const createRecipient = async (req, res) => {
    const { recipient } = req.body

    if (typeof recipient !== 'string' || recipient.trim() === '') {
        return res.json({
            success: false,
            message: "Recipient e-mail address is required"
        })
    }

    const author = req.user

    console.log({ author })

    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const isvalid = pattern.test(recipient)

    if (isvalid === false) {
        return res.json({
            success: false,
            message: "Please send a valid e-mail address"
        })
    }

    const __recipient = await Recipient.findOneAndUpdate(
        { author: author._id, address: recipient.trim() },
        { $setOnInsert: { author: author._id, address: recipient.trim() } },
        {
            new: true,
            upsert: true
        }
    )

    const track = await Track.create({ seen: false })

    const eas = fives.at(Math.floor(Math.random() * fives.length)) + "-" + threeies.at(Math.floor(Math.random() * threeies.length))

    await Message.create({
        author: author._id,
        recipient: __recipient._id,
        eas,
        tid: track._id
    })

    res.json({
        success: true,
        message: "Added recepient",
        eas
    })
}

const fetchRecipients = async (req, res) => {
    const { recipient } = req.body

    if (typeof recipient !== 'string' || recipient.trim() === '') {
        return res.json({
            success: false,
            message: "Recipient is required"
        })
    }

    const author = req.user

    const escaped = escapeRegex(recipient)

    const recipients = await Recipient.find({
        author: author._id,
        address: { $regex: `${escaped}`, $options: "i" }
    })

    res.json({
        success: true,
        message: "List of existing recepient e-mail addresses",
        recipients
    })
}


module.exports = {
    createRecipient,
    fetchRecipients
}
