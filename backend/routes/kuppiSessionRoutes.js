const express = require('express');
const router = express.Router();
const { uploadMiddleware, createSession, getAllSessions, updateSessionStatus, getSessionsByEmail, deleteSession } = require('../Controllers/kuppiSessionController');

// POST route to register a new kuppi session
// Multer middleware handles 'multipart/form-data' parsing before controller logic
router.post('/', function (req, res, next) {
    uploadMiddleware(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, createSession);

// GET route to fetch all kuppi sessions for the admin dashboard
router.get('/', getAllSessions);

// PUT route to approve or reject a session
router.put('/:id/status', updateSessionStatus);

// DELETE route to remove a session
router.delete('/:id', deleteSession);

// GET route to fetch sessions for a specific host by email
router.get('/email/:email', getSessionsByEmail);

module.exports = router;
