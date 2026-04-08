const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const handoverSchema = new Schema(
    {
        itemId: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        finderName: {
            type: String,
            required: true
        },
        receiverName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        registrationNo: {
            type: String,
            required: true
        },
        faculty: {
            type: String,
            required: true
        },
        contactNumber: {
            type: String,
            required: true
        },
        universityIdPhoto: {
            type: String, // Base64 image
            required: true
        },
        verificationCode: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "CANCELLED"],
            default: "PENDING"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Handover", handoverSchema);
