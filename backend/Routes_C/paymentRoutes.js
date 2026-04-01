const express = require("express");
const router = express.Router();

const {
    createPayment,
    createBankTransferPayment,
    getPayments,
    updatePaymentStatus
} = require("../Controllers_C/paymentController");

router.post("/", createPayment);
router.post("/bank-transfer", createBankTransferPayment);
router.get("/", getPayments);
router.put("/:paymentId", updatePaymentStatus);

module.exports = router;