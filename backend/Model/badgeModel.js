const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Badge name is required"],
            trim: true,
            maxlength: [50, "Badge name cannot exceed 50 characters"],
        },
        emoji: {
            type: String,
            required: [true, "Badge emoji is required"],
        },
        color: {
            type: String,
            required: [true, "Badge color is required"],
            default: "#4C6EF5",
        },
        description: {
            type: String,
            required: [true, "Badge description is required"],
            maxlength: [200, "Description cannot exceed 200 characters"],
        },
        triggerField: {
            type: String,
            required: [true, "Trigger field is required"],
            enum: ["itemsReturned", "itemsReported", "rewardsEarned"],
        },
        triggerValue: {
            type: Number,
            required: [true, "Trigger value is required"],
            min: [1, "Trigger value must be at least 1"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Badge", badgeSchema);
