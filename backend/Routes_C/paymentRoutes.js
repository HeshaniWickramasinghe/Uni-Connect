const express = require("express");
const router = express.Router();

const {
    createPayment,
    getPayments
} = require("../Controllers_C/paymentController");

// Routes
router.post("/", createPayment);     // Create payment
router.get("/", getPayments);        // Get all payments

module.exports = router;