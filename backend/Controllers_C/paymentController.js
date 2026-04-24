const Payment = require("../Model_C/paymentModel");
const KuppiSession = require("../models/KuppiSession");
const StudentRegistration = require("../models/StudentRegistration");

// Create Payment
const createPayment = async (req, res) => {
    try {
        const { cardName, cardNumber, expiry, cvv, amount, userEmail, userName, studentRegistrationNumber } = req.body;

        if (!userEmail || !studentRegistrationNumber) {
            return res.status(400).json({
                message: "User email and student registration number are required"
            });
        }

        // Mask card number
        const maskedCard = "**** **** **** " + cardNumber.slice(-4);

        const newPayment = new Payment({
            userEmail,
            userName: userName || "",
            studentRegistrationNumber,
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

const createBankTransferPayment = async (req, res) => {
    try {
        const {
            userEmail,
            userName,
            studentRegistrationNumber,
            proofFileName,
            proofFileType,
            proofFileData
        } = req.body;

        if (!userEmail || !studentRegistrationNumber || !proofFileName || !proofFileData) {
            return res.status(400).json({
                message: "User email, student registration number, and proof file are required"
            });
        }

        const newPayment = new Payment({
            userEmail,
            userName: userName || "",
            studentRegistrationNumber,
            method: "bank",
            proofFileName,
            proofFileType: proofFileType || "",
            proofFileData,
            status: "pending"
        });

        await newPayment.save();

        return res.status(201).json({
            message: "Bank transfer proof submitted successfully",
            data: newPayment
        });
    } catch (error) {
        return res.status(500).json({
            message: "Bank transfer submission failed",
            error: error.message
        });
    }
};

// Get All Payments (exclude large proof file data for performance)
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .select('-proofFileData')
            .sort({ date: -1 })
            .lean();

        // Add a flag so the frontend knows if a proof file exists
        const result = payments.map(p => ({
            ...p,
            hasProofFile: !!(p.proofFileName && p.proofFileName.length > 0)
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get proof file for a single payment
const getPaymentProof = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId).select('proofFileData proofFileName proofFileType');
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json({
            proofFileData: payment.proofFileData,
            proofFileName: payment.proofFileName,
            proofFileType: payment.proofFileType
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Payment Status (Approve/Reject)
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status, amount } = req.body;

        if (!paymentId || !status) {
            return res.status(400).json({
                message: "Payment ID and status are required"
            });
        }

        const validStatuses = ["approved", "rejected", "pending", "success"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be one of: approved, rejected, pending, success"
            });
        }

        const existingPayment = await Payment.findById(paymentId);
        if (!existingPayment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        const normalizedStatus = String(status).trim().toLowerCase();
        const isBankPayment = String(existingPayment.method || "").trim().toLowerCase() === "bank";
        const requiresAmount = isBankPayment && (normalizedStatus === "approved" || normalizedStatus === "rejected");

        let normalizedAmount;
        if (amount !== undefined && amount !== null && amount !== "") {
            const parsedAmount = Number(amount);
            if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
                return res.status(400).json({
                    message: "Amount must be a valid number greater than 0"
                });
            }
            normalizedAmount = parsedAmount;
        }

        if (requiresAmount && normalizedAmount === undefined) {
            return res.status(400).json({
                message: "Amount is required before approving or rejecting a bank transfer payment"
            });
        }

        const updatePayload = { status };
        if (normalizedAmount !== undefined) {
            updatePayload.amount = normalizedAmount;
        }

        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            updatePayload,
            { new: true, runValidators: true }
        );

        // Keep Ghost Lec request payment state in sync using transaction code.
        let sessionPaymentStatus = 'unknown';
        if (normalizedStatus === 'approved' || normalizedStatus === 'success') {
            sessionPaymentStatus = 'success';
        } else if (normalizedStatus === 'pending') {
            sessionPaymentStatus = 'pending';
        } else if (normalizedStatus === 'rejected' || normalizedStatus === 'failed' || normalizedStatus === 'fail') {
            sessionPaymentStatus = 'failed';
        }

        if (updatedPayment.transactionId) {
            await KuppiSession.updateMany(
                { registrationTransactionId: updatedPayment.transactionId },
                {
                    registrationPaymentStatus: sessionPaymentStatus,
                    registrationTransactionId: updatedPayment.transactionId,
                    registrationPaymentMethod: updatedPayment.method === 'bank' ? 'bank' : 'card'
                }
            );

            await StudentRegistration.updateMany(
                { paymentTransactionId: updatedPayment.transactionId },
                {
                    paymentStatus: sessionPaymentStatus,
                    paymentTransactionId: updatedPayment.transactionId,
                    paymentMethod: updatedPayment.method === 'bank' ? 'bank' : 'card'
                }
            );
        }

        res.status(200).json({
            message: "Payment status updated successfully",
            data: updatedPayment
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update payment status",
            error: error.message
        });
    }
};

const deletePayment = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const deletedPayment = await Payment.findByIdAndDelete(paymentId);
        if (!deletedPayment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            message: "Payment deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete payment",
            error: error.message
        });
    }
};

module.exports = {
    createPayment,
    createBankTransferPayment,
    getPayments,
<<<<<<< Updated upstream
    getPaymentProof,
    updatePaymentStatus
=======
    updatePaymentStatus,
    deletePayment
>>>>>>> Stashed changes
};