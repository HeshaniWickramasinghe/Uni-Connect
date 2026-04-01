const mongoose = require("mongoose");

const generateTransactionId = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    return `TXN-${datePart}-${randomPart}`;
};

const paymentSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        default: generateTransactionId,
        unique: true,
        sparse: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    userName: {
        type: String,
        trim: true
    },
    studentRegistrationNumber: {
        type: String,
        required: true,
        trim: true
    },
    method: {
        type: String,
        required: true
    },
    cardName: {
        type: String,
        default: ""
    },
    cardNumber: {
        type: String,
        default: ""
    },
    expiry: {
        type: String,
        default: ""
    },
    cvv: {
        type: String,
        default: ""
    },
    amount: {
        type: Number,
        default: null
    },
    proofFileName: {
        type: String,
        default: ""
    },
    proofFileType: {
        type: String,
        default: ""
    },
    proofFileData: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "success"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("PaymentModel", paymentSchema);