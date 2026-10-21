const mongoose = require("mongoose")
const { Schema } = mongoose

// visited: date of visit to e-mail recipient - for recent sort
// boxes: does the recipient have a draft or sent e-mails - for previous e-mails box hide
const recipientSchema = Schema(
    {
        author: {
            type: Schema.ObjectId,
            ref: "Author",
            required: true
        },
        fname: String,
        address: {
            type: String,
            required: true
        },
        visited: Date,
        boxes: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Recipient', recipientSchema)
