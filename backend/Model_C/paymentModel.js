const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true
    },
    cardName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    expiry: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
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