const StudentRegistration = require('../models/StudentRegistration');
const KuppiSession = require('../models/KuppiSession');
const Payment = require('../Model_C/paymentModel');

const registerStudent = async (req, res) => {
    try {
        const {
            studentName,
            studentEmail,
            studentId,
            contactNumber,
            sessionId,
            paymentStatus,
            paymentTransactionId,
            paymentMethod
        } = req.body;

        // Verify the session is valid and exists
        const session = await KuppiSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Requested session not found" });
        }

        if (session.status !== 'Approved') {
            return res.status(400).json({ message: "Registration is only open for approved sessions" });
        }

        // Student registration record
        const registration = new StudentRegistration({
            studentName,
            studentEmail,
            studentId,
            contactNumber,
            sessionId,
            paymentStatus: ['success', 'pending', 'failed'].includes(paymentStatus) ? paymentStatus : 'unknown',
            paymentTransactionId: paymentTransactionId || '',
            paymentMethod: ['card', 'bank'].includes(paymentMethod) ? paymentMethod : ''
        });

        await registration.save();
        res.status(201).json({ message: "Successfully registered for the session!", registration });
    } catch (error) {
        console.error("Error registering student:", error);
        res.status(400).json({ message: error.message || "Enrollment failed. Please try again." });
    }
};

const getRegistrationsBySession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const registrations = await StudentRegistration.find({ sessionId }).sort({ createdAt: -1 });
        res.status(200).json(registrations);
    } catch (error) {
        console.error("Error fetching registrations:", error);
        res.status(500).json({ message: "Failed to fetch student registrations" });
    }
};

const getRegistrationsByStudentEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const registrations = await StudentRegistration.find({ studentEmail: email })
            .populate('sessionId')
            .sort({ createdAt: -1 });
        res.status(200).json(registrations);
    } catch (error) {
        console.error("Error fetching student registrations:", error);
        res.status(500).json({ message: "Failed to fetch registrations" });
    }
};

const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await StudentRegistration.find({})
            .populate('sessionId', 'moduleName moduleCode kuppiSessionFormId name')
            .sort({ createdAt: -1 });
        res.status(200).json(registrations);
    } catch (error) {
        console.error('Error fetching all registrations:', error);
        res.status(500).json({ message: 'Failed to fetch all registrations' });
    }
};

const updateRegistrationPaymentStatus = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const { status } = req.body;

        if (!['success', 'pending', 'failed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        const registration = await StudentRegistration.findById(registrationId);
        if (!registration) {
            return res.status(404).json({ message: 'Student registration not found' });
        }

        registration.paymentStatus = status;
        await registration.save();

        if (registration.paymentTransactionId) {
            const paymentStatus = status === 'success' ? 'success' : status === 'failed' ? 'rejected' : 'pending';
            await Payment.findOneAndUpdate(
                { transactionId: registration.paymentTransactionId },
                { status: paymentStatus },
                { new: true }
            );
        }

        res.status(200).json({
            message: 'Registration payment status updated successfully',
            registration
        });
    } catch (error) {
        console.error('Error updating registration payment status:', error);
        res.status(500).json({ message: 'Failed to update registration payment status' });
    }
};

module.exports = {
    registerStudent,
    getRegistrationsBySession,
    getRegistrationsByStudentEmail,
    getAllRegistrations,
    updateRegistrationPaymentStatus
};
