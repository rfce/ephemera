const mongoose = require("mongoose")
const { Schema } = mongoose

const messageSchema = Schema(
    {
        image: {
            type: [Schema.ObjectId],
            required: true
        },
        seen: {
            type: Boolean,
            default: false
        },
        unix: {
            type: [{
                ip: String,
                ua: String,
                timestamp: Date
            }],
            required: false
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Message', messageSchema)

