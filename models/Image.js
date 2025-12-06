const mongoose = require("mongoose")
const { Schema } = mongoose

const imageSchema = Schema(
    {
        blob: {
            type: String,
            required: true
        }
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Image', imageSchema)

