const Rating = require("../Model/ratingModel");
const UserProfile = require("../Model/userProfileModel");

// Create a rating
const createRating = async (req, res) => {
    try {
        const { itemId, giverId, giverName, receiverId, receiverName, stars, labels, comment } = req.body;

        // Check if already rated
        const existing = await Rating.findOne({ itemId, giverId });
        if (existing) {
            return res.status(400).json({ message: "You have already rated this finder for this item" });
        }

        const rating = await Rating.create({
            itemId,
            giverId,
            giverName,
            receiverId,
            receiverName,
            stars,
            labels: labels || [],
            comment: comment?.trim() || "",
        });

        res.status(201).json(rating);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already rated this finder for this item" });
        }
        res.status(500).json({ message: error.message });
    }
};

// Get ratings received by a user
const getUserRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ receiverId: req.params.userId })
            .populate("itemId", "name category photo")
            .sort({ createdAt: -1 });

        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get average rating and label counts for a user
const getUserRatingSummary = async (req, res) => {
    try {
        const ratings = await Rating.find({ receiverId: req.params.userId });

        if (ratings.length === 0) {
            return res.status(200).json({
                averageStars: 0,
                totalRatings: 0,
                labelCounts: {},
                starDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            });
        }

        const totalStars = ratings.reduce((sum, r) => sum + r.stars, 0);
        const averageStars = (totalStars / ratings.length).toFixed(1);

        const labelCounts = {};
        ratings.forEach((r) => {
            r.labels.forEach((label) => {
                labelCounts[label] = (labelCounts[label] || 0) + 1;
            });
        });

        const starDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((r) => {
            starDistribution[r.stars] += 1;
        });

        res.status(200).json({
            averageStars: parseFloat(averageStars),
            totalRatings: ratings.length,
            labelCounts,
            starDistribution,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if a user has already rated for a specific item
const checkRating = async (req, res) => {
    try {
        const { itemId, giverId } = req.query;
        const existing = await Rating.findOne({ itemId, giverId });
        res.status(200).json({ hasRated: !!existing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRating,
    getUserRatings,
    getUserRatingSummary,
    checkRating,
};
