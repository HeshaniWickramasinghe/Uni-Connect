const StudentRegistration = require('../models/StudentRegistration');
const KuppiSession = require('../models/KuppiSession');

const registerStudent = async (req, res) => {
    try {
        const { studentName, studentEmail, studentId, contactNumber, sessionId } = req.body;

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
            sessionId
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

module.exports = {
    registerStudent,
    getRegistrationsBySession,
    getRegistrationsByStudentEmail
};
