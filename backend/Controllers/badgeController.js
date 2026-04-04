const Badge = require("../Model/badgeModel");
const UserProfile = require("../Model/userProfileModel");

// Get all badges
const getAllBadges = async (req, res) => {
    try {
        const badges = await Badge.find().sort({ createdAt: -1 });
        res.status(200).json(badges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get active badges only
const getActiveBadges = async (req, res) => {
    try {
        const badges = await Badge.find({ isActive: true }).sort({ triggerField: 1, triggerValue: 1 });
        res.status(200).json(badges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single badge
const getBadgeById = async (req, res) => {
    try {
        const badge = await Badge.findById(req.params.id);
        if (!badge) {
            return res.status(404).json({ message: "Badge not found" });
        }
        res.status(200).json(badge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create badge (admin)
const createBadge = async (req, res) => {
    try {
        const { name, emoji, color, description, triggerField, triggerValue, isActive } = req.body;

        const existingBadge = await Badge.findOne({ name: name.trim() });
        if (existingBadge) {
            return res.status(400).json({ message: "A badge with this name already exists" });
        }

        const badge = await Badge.create({
            name: name.trim(),
            emoji,
            color,
            description: description.trim(),
            triggerField,
            triggerValue,
            isActive: isActive !== undefined ? isActive : true,
        });

        res.status(201).json(badge);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: error.message });
    }
};

// Update badge (admin)
const updateBadge = async (req, res) => {
    try {
        const { name, emoji, color, description, triggerField, triggerValue, isActive } = req.body;

        if (name) {
            const existingBadge = await Badge.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
            if (existingBadge) {
                return res.status(400).json({ message: "A badge with this name already exists" });
            }
        }

        const badge = await Badge.findByIdAndUpdate(
            req.params.id,
            { name: name?.trim(), emoji, color, description: description?.trim(), triggerField, triggerValue, isActive },
            { new: true, runValidators: true }
        );

        if (!badge) {
            return res.status(404).json({ message: "Badge not found" });
        }

        res.status(200).json(badge);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: error.message });
    }
};

// Delete badge (admin)
const deleteBadge = async (req, res) => {
    try {
        const badge = await Badge.findByIdAndDelete(req.params.id);
        if (!badge) {
            return res.status(404).json({ message: "Badge not found" });
        }

        // Remove this badge from all user profiles
        await UserProfile.updateMany(
            { "badges.badgeId": req.params.id },
            { $pull: { badges: { badgeId: req.params.id } } }
        );

        res.status(200).json({ message: "Badge deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllBadges,
    getActiveBadges,
    getBadgeById,
    createBadge,
    updateBadge,
    deleteBadge,
};
