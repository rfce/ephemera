const mongoose = require("mongoose")
const { Schema } = mongoose

// text - emoji copied
// paste - has the user pasted content into an e-mail client
// fire - has the tracking started
// firefox - when was tracking started
// hash - unique hash for each visitor
const ghostSchema = Schema(
    {
        text: String,
        paste: {
            type: Boolean,
            default: false
        },
        fire: {
            type: Boolean,
            default: false
        },
        firefox: Date,
        unix: {
            type: [{
                ip: String,
                ua: String,
                timestamp: Date
            }],
            required: false
        },
        hash: {
            type: String,
            required: true
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Ghost', ghostSchema)

