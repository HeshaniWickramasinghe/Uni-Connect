const express = require('express');
const router = express.Router();
const { registerStudent, getRegistrationsBySession, getRegistrationsByStudentEmail } = require('../controllers/studentRegistrationController');

// POST route for student enrollment in a Kuppi session
router.post('/', registerStudent);

// GET route for fetching students registered to a specific session
router.get('/session/:sessionId', getRegistrationsBySession);

// GET route for fetching all registrations of a student by email
router.get('/student/:email', getRegistrationsByStudentEmail);

module.exports = router;
