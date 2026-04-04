const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true,
        },
        giverId: {
            type: String,
            required: [true, "Giver ID is required"],
        },
        giverName: {
            type: String,
            required: [true, "Giver name is required"],
        },
        receiverId: {
            type: String,
            required: [true, "Receiver ID is required"],
        },
        receiverName: {
            type: String,
            required: [true, "Receiver name is required"],
        },
        points: {
            type: Number,
            required: [true, "Points are required"],
            min: [1, "Points must be at least 1"],
            max: [100, "Points cannot exceed 100"],
        },
        message: {
            type: String,
            maxlength: [200, "Message cannot exceed 200 characters"],
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);
