const mongoose = require("mongoose")
const { Schema } = mongoose

const authorSchema = Schema(
    {
        fname: String,
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        verified: {
            type: Boolean,
            default: false
        },
        verification: {
            otp: String,
            attempts: {
                type: Number,
                default: 0
            },
            resends: {
                type: Number,
                default: 0
            },
            timestamp: Date,
            expires: Date
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Author', authorSchema)
