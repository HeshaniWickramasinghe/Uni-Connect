const mongoose = require('mongoose');

const studentRegistrationSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: [true, 'Student Name is required'],
        minlength: [3, 'Name must be at least 3 characters']
    },
    studentEmail: {
        type: String,
        required: [true, 'Student Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    studentId: {
        type: String,
        required: [true, 'Student ID or Index Number is required']
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact Number is required'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number']
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KuppiSession',
        required: [true, 'Session ID is required']
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentRegistration', studentRegistrationSchema);
