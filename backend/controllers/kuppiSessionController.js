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
    if (file.fieldname === "qualificationFile") {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            cb(new Error("Qualification must be a JPG file"), false);
        }
    } else if (file.fieldname === "shortNoteFile") {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Short Note must be a PDF file"), false);
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
    { name: 'qualificationFile', maxCount: 1 },
    { name: 'shortNoteFile', maxCount: 1 }
]);

const createSession = async (req, res) => {
    try {
        // Extract fields
        let { name, email, faculty, skills, moduleName, moduleCode, date, time, duration, price, meetingLink, bankName, accountNumber, accountHolderName, branchName } = req.body;

        // Check for required files
        if (!req.files || !req.files.qualificationFile || !req.files.shortNoteFile) {
            return res.status(400).json({ message: "Both Qualification (JPG) and Short Note (PDF) files are required." });
        }

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
            qualificationFile,
            shortNoteFile,
            bankName,
            accountNumber,
            accountHolderName,
            branchName
        });

        await newSession.save();

        res.status(201).json({ message: "Kuppi session registered successfully", session: newSession });
    } catch (error) {
        console.error("Error creating Kuppi Session:", error);

        // If validation fails or another error occurs, we should clean up uploaded files
        if (req.files) {
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

module.exports = {
    uploadMiddleware,
    createSession,
    getAllSessions,
    updateSessionStatus,
    getSessionsByEmail
};
