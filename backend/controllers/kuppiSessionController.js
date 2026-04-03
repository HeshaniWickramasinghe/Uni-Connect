const multer = require('multer');
const path = require('path');
const KuppiSession = require('../models/KuppiSession');
const fs = require('fs');

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf";
    const isJpg = file.mimetype === "image/jpeg" || file.mimetype === "image/jpg";
    const isPng = file.mimetype === "image/png";

    if (file.fieldname === "coverImage") {
        if (isJpg || isPng) {
            cb(null, true);
        } else {
            cb(new Error("Cover image must be JPG or PNG"), false);
        }
    } else if (file.fieldname === "qualificationFile") {
        if (isPdf || isJpg || isPng) {
            cb(null, true);
        } else {
            cb(new Error("Qualification must be a PDF, JPG, or PNG file"), false);
        }
    } else if (file.fieldname === "shortNoteFile") {
        if (isPdf || isJpg || isPng) {
            cb(null, true);
        } else {
            cb(new Error("Short Notes must be a PDF, JPG, or PNG file"), false);
        }
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadMiddleware = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'qualificationFile', maxCount: 1 },
    { name: 'shortNoteFile', maxCount: 1 }
]);

const createSession = async (req, res) => {
    try {
        // Extract fields
        let {
            name,
            email,
            faculty,
            skills,
            moduleName,
            moduleCode,
            date,
            time,
            duration,
            price,
            meetingLink,
            bankName,
            accountNumber,
            accountHolderName,
            branchName,
            registrationPaymentStatus,
            registrationTransactionId,
            registrationPaymentMethod
        } = req.body;

        // Check for required files
        if (!req.files || !req.files.coverImage || !req.files.qualificationFile || !req.files.shortNoteFile) {
            return res.status(400).json({ message: "Cover Image (JPG/PNG), Qualification Proof (PDF/JPG/PNG), and Short Notes (PDF/JPG/PNG) files are required." });
        }

        const coverImage = req.files.coverImage[0].path;
        const qualificationFile = req.files.qualificationFile[0].path;
        const shortNoteFile = req.files.shortNoteFile[0].path;

        // Handle skills (multipart/form-data sends array as string or multiple fields)
        if (typeof skills === 'string') {
            try {
                // if it's stringified JSON ["Skill1", "Skill2"]
                skills = JSON.parse(skills);
            } catch (e) {
                // if it's comma separated "Skill1, Skill2"
                skills = skills.split(',').map(s => s.trim());
            }
        }

        const newSession = new KuppiSession({
            name,
            email,
            faculty,
            skills,
            moduleName,
            moduleCode,
            date,
            time,
            duration,
            price,
            meetingLink,
            coverImage,
            qualificationFile,
            shortNoteFile,
            bankName,
            accountNumber,
            accountHolderName,
            branchName,
            registrationPaymentStatus: ['success', 'pending', 'failed'].includes(registrationPaymentStatus) ? registrationPaymentStatus : 'unknown',
            registrationTransactionId: registrationTransactionId || '',
            registrationPaymentMethod: ['card', 'bank'].includes(registrationPaymentMethod) ? registrationPaymentMethod : ''
        });

        await newSession.save();

        res.status(201).json({ message: "Kuppi session registered successfully", session: newSession });
    } catch (error) {
        console.error("Error creating Kuppi Session:", error);

        // If validation fails or another error occurs, we should clean up uploaded files
        if (req.files) {
            if (req.files.coverImage) fs.unlinkSync(req.files.coverImage[0].path);
            if (req.files.qualificationFile) fs.unlinkSync(req.files.qualificationFile[0].path);
            if (req.files.shortNoteFile) fs.unlinkSync(req.files.shortNoteFile[0].path);
        }

        res.status(400).json({ message: error.message || "An error occurred while registering the session" });
    }
};

const getAllSessions = async (req, res) => {
    try {
        const sessions = await KuppiSession.find().sort({ createdAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ message: "Failed to fetch sessions" });
    }
};

const updateSessionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value provided" });
        }

        const updatedSession = await KuppiSession.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedSession) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.status(200).json({ message: `Session ${status} successfully!`, session: updatedSession });
    } catch (error) {
        console.error("Error updating session status:", error);
        res.status(500).json({ message: "Failed to update session status" });
    }
};

const getSessionsByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const sessions = await KuppiSession.find({ email }).sort({ createdAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error fetching sessions by email:", error);
        res.status(500).json({ message: "Failed to fetch sessions by email" });
    }
};

const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await KuppiSession.findByIdAndDelete(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Clean up uploaded files
        try {
            if (session.coverImage && fs.existsSync(session.coverImage)) {
                fs.unlinkSync(session.coverImage);
            }
            if (session.qualificationFile && fs.existsSync(session.qualificationFile)) {
                fs.unlinkSync(session.qualificationFile);
            }
            if (session.shortNoteFile && fs.existsSync(session.shortNoteFile)) {
                fs.unlinkSync(session.shortNoteFile);
            }
        } catch (fileErr) {
            console.warn("Warning: Could not delete some files:", fileErr.message);
        }

        res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ message: "Failed to delete session" });
    }
};

module.exports = {
    uploadMiddleware,
    createSession,
    getAllSessions,
    updateSessionStatus,
    getSessionsByEmail,
    deleteSession
};
