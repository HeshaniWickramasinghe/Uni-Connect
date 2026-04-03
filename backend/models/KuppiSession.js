const mongoose = require('mongoose');

const kuppiSessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters'],
        match: [/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    faculty: {
        type: String,
        required: [true, 'Faculty/Department is required']
    },
    skills: {
        type: [String],
        required: [true, 'Skills/Modules are required'],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'At least one skill/module is required'
        }
    },
    moduleName: {
        type: String,
        required: [true, 'Module Name is required'],
        minlength: [3, 'Module Name must be at least 3 characters']
    },
    moduleCode: {
        type: String,
        required: [true, 'Module Code is required'],
        match: [/^[A-Z]{2,4}\d{3,4}$/i, 'Module Code must match format like IT3020']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        validate: {
            validator: function(v) {
                // Ensure date is not in the past
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return v >= today;
            },
            message: 'Date cannot be in the past'
        }
    },
    time: {
        type: String,
        required: [true, 'Time is required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [30, 'Duration must be at least 30 minutes'],
        max: [240, 'Duration cannot exceed 240 minutes']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    meetingLink: {
        type: String,
        required: [true, 'Meeting Link is required'],
        match: [/^https?:\/\//, 'Meeting Link must be a valid URL starting with http/https']
    },
    qualificationFile: {
        type: String, // File path to JPG
        required: [true, 'Qualification file (JPG) is required']
    },
    shortNoteFile: {
        type: String, // File path to PDF
        required: [true, 'Short Note file (PDF) is required']
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    bankName: {
        type: String,
        required: [true, 'Bank Name is required']
    },
    accountNumber: {
        type: String,
        required: [true, 'Account Number is required']
    },
    accountHolderName: {
        type: String,
        required: [true, 'Account Holder Name is required']
    },
    branchName: {
        type: String,
        required: [true, 'Branch Name is required']
    }
}, { timestamps: true });

module.exports = mongoose.model('KuppiSession', kuppiSessionSchema);
