const UserProfile = require("../Model/userProfileModel");
const Badge = require("../Model/badgeModel");

// Get or create user profile
const getOrCreateProfile = async (req, res) => {
    try {
        const { tempUserId, name } = req.query;

        if (!tempUserId) {
            return res.status(400).json({ message: "tempUserId is required" });
        }

        let profile = await UserProfile.findOne({ tempUserId }).populate("badges.badgeId");

        if (!profile) {
            profile = await UserProfile.create({
                tempUserId,
                name: name || `User_${tempUserId.slice(0, 6)}`,
            });
            profile = await UserProfile.findById(profile._id).populate("badges.badgeId");
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get profile by tempUserId
const getProfileByUserId = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ tempUserId: req.params.userId }).populate("badges.badgeId");

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const { name, studentId, email, phone, bio, avatar } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (studentId !== undefined) updateData.studentId = studentId.trim();
        if (email !== undefined) updateData.email = email.trim();
        if (phone !== undefined) updateData.phone = phone.trim();
        if (bio !== undefined) updateData.bio = bio.trim();
        if (avatar !== undefined) updateData.avatar = avatar;

        const profile = await UserProfile.findOneAndUpdate(
            { tempUserId: req.params.userId },
            updateData,
            { new: true, runValidators: true }
        ).populate("badges.badgeId");

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: error.message });
    }
};

// Increment user stats and check for new badges
const incrementStat = async (req, res) => {
    try {
        const { field } = req.body;
        const validFields = ["itemsReported", "itemsReturned", "rewardsEarned"];

        if (!validFields.includes(field)) {
            return res.status(400).json({ message: `Invalid field. Must be one of: ${validFields.join(", ")}` });
        }

        const profile = await UserProfile.findOneAndUpdate(
            { tempUserId: req.params.userId },
            { $inc: { [field]: 1 } },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Check for new badges
        const activeBadges = await Badge.find({ isActive: true, triggerField: field });
        const earnedBadgeIds = profile.badges.map((b) => b.badgeId.toString());
        const newBadges = [];

        for (const badge of activeBadges) {
            if (!earnedBadgeIds.includes(badge._id.toString()) && profile[field] >= badge.triggerValue) {
                newBadges.push({ badgeId: badge._id, earnedAt: new Date() });
            }
        }

        if (newBadges.length > 0) {
            profile.badges.push(...newBadges);
            await profile.save();
        }

        const updatedProfile = await UserProfile.findById(profile._id).populate("badges.badgeId");

        res.status(200).json({
            profile: updatedProfile,
            newBadges: newBadges.length > 0 ? newBadges.map((b) => b.badgeId) : [],
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
    try {
        const profiles = await UserProfile.find({ itemsReturned: { $gt: 0 } })
            .populate("badges.badgeId")
            .sort({ itemsReturned: -1, totalRewardPoints: -1 })
            .limit(20);

        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOrCreateProfile,
    getProfileByUserId,
    updateProfile,
    incrementStat,
    getLeaderboard,
};
