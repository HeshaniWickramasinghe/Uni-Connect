const express = require('express');
const router = express.Router();
const { registerStudent, getRegistrationsBySession, getRegistrationsByStudentEmail, getAllRegistrations, updateRegistrationPaymentStatus, deleteRegistration } = require('../Controllers/studentRegistrationController');

// POST route for student enrollment in a Kuppi session
router.post('/', registerStudent);

// GET route for fetching students registered to a specific session
router.get('/session/:sessionId', getRegistrationsBySession);

// GET route for fetching all registrations of a student by email
router.get('/student/:email', getRegistrationsByStudentEmail);

// GET route for fetching all registrations (Admin)
router.get('/', getAllRegistrations);

// PUT route for host/admin payment approval for an enrollment
router.put('/:registrationId/payment-status', updateRegistrationPaymentStatus);

// DELETE route for admin to remove an enrollment
router.delete('/:registrationId', deleteRegistration);

module.exports = router;
