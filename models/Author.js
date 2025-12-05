const mongoose = require("mongoose")
const { Schema } = mongoose

const authorSchema = Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        dob: Date,
        password: {
            type: String,
            required: true
        },
        ip: String,
        account: String,
        hash: {
            type: String,
            required: true
        }
    },
    {
        id: false,
        timestamps : true,
        toJSON: { virtuals: true }
    }
)

authorSchema.virtual('__account', {
    ref: "Account",
    localField: "account",
    foreignField: "id",
    justOne: true
})

module.exports = mongoose.model('Author', authorSchema)

