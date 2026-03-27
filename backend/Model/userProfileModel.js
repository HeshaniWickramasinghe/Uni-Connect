const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
    {
        tempUserId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        studentId: {
            type: String,
            trim: true,
            maxlength: [20, "Student ID cannot exceed 20 characters"],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            maxlength: [300, "Bio cannot exceed 300 characters"],
            default: "",
        },
        avatar: {
            type: String,
            default: "",
        },
        itemsReported: {
            type: Number,
            default: 0,
        },
        itemsReturned: {
            type: Number,
            default: 0,
        },
        rewardsEarned: {
            type: Number,
            default: 0,
        },
        totalRewardPoints: {
            type: Number,
            default: 0,
        },
        badges: [
            {
                badgeId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Badge",
                },
                earnedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
