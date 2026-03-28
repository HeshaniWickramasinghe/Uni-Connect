const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    studentRegistrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationCode: {
        type: String,
        default: ""
    },
    emailVerificationCodeExpiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User1", userSchema);