const mongoose = require("mongoose")
const { Schema } = mongoose


const trackSchema = Schema(
    {
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
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Track', trackSchema)

