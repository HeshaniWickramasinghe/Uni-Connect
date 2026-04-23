const express = require("express");
const router = express.Router();

const {
    createPayment,
    createBankTransferPayment,
    getPayments,
    getPaymentProof,
    updatePaymentStatus
} = require("../Controllers_C/paymentController");

router.post("/", createPayment);
router.post("/bank-transfer", createBankTransferPayment);
router.get("/", getPayments);
router.get("/:paymentId/proof", getPaymentProof);
router.put("/:paymentId", updatePaymentStatus);

module.exports = router;