const Payment = require("../Model_C/paymentModel");

// Create Payment
const createPayment = async (req, res) => {
    try {
        const { cardName, cardNumber, expiry, cvv, amount } = req.body;

        // Mask card number
        const maskedCard = "**** **** **** " + cardNumber.slice(-4);

        const newPayment = new Payment({
            method: "card",
            cardName,
            cardNumber: maskedCard,
            expiry,
            cvv,
            amount,
            status: "success"
        });

        await newPayment.save();

        res.status(201).json({
            message: "Payment Successful",
            data: newPayment
        });

    } catch (error) {
        res.status(500).json({
            message: "Payment Failed",
            error: error.message
        });
    }
};

// Get All Payments (optional for demo)
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ date: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPayment,
    getPayments
};