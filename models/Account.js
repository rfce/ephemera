const mongoose = require("mongoose")
const { Schema } = mongoose

const accountSchema = Schema(
    {
        author: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        account_number: {
            type: String,
            required: true
        },
        account_type: {
            type: String,
            enum: ["trading", "custodial", "donor_advised"]
        },
        status: {
            type: String,
            enum: ["INACTIVE", "ONBOARDING", "SUBMITTED", "SUBMISSION_FAILED", "ACTION_REQUIRED", "ACCOUNT_UPDATED", "APPROVAL_PENDING", "APPROVED", "REJECTED", "ACTIVE", "ACCOUNT_CLOSED"],
            default: "INACTIVE"
        },
        currency: String
    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model('Account', accountSchema)

