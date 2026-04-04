const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
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
        stars: {
            type: Number,
            required: [true, "Star rating is required"],
            min: [1, "Rating must be at least 1 star"],
            max: [5, "Rating cannot exceed 5 stars"],
        },
        labels: {
            type: [String],
            enum: [
                "Delivered with care",
                "Easy to retrieve",
                "Trustworthy",
                "Quick response",
                "Friendly",
                "Well packaged",
            ],
            default: [],
        },
        comment: {
            type: String,
            maxlength: [300, "Comment cannot exceed 300 characters"],
            default: "",
        },
    },
    { timestamps: true }
);

// Prevent duplicate ratings for the same item by the same giver
ratingSchema.index({ itemId: 1, giverId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
