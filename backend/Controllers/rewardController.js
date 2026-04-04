const Reward = require("../Model/rewardModel");
const UserProfile = require("../Model/userProfileModel");
const Badge = require("../Model/badgeModel");

// Give a reward
const giveReward = async (req, res) => {
    try {
        const { itemId, giverId, giverName, receiverId, receiverName, points, message } = req.body;

        const reward = await Reward.create({
            itemId,
            giverId,
            giverName,
            receiverId,
            receiverName,
            points,
            message: message?.trim() || "",
        });

        // Update receiver's profile
        const newBadges = [];
        const receiverProfile = await UserProfile.findOne({ tempUserId: receiverId });
        if (receiverProfile) {
            receiverProfile.rewardsEarned += 1;
            receiverProfile.totalRewardPoints += points;

            // Check for reward-based badges
            const rewardBadges = await Badge.find({ isActive: true, triggerField: "rewardsEarned" });
            const earnedBadgeIds = receiverProfile.badges.map((b) => b.badgeId.toString());

            for (const badge of rewardBadges) {
                if (!earnedBadgeIds.includes(badge._id.toString()) && receiverProfile.rewardsEarned >= badge.triggerValue) {
                    receiverProfile.badges.push({ badgeId: badge._id, earnedAt: new Date() });
                    newBadges.push(badge);
                }
            }

            await receiverProfile.save();
        }

        res.status(201).json({ reward, newBadges });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: error.message });
    }
};

// Get rewards for a user
const getUserRewards = async (req, res) => {
    try {
        const rewards = await Reward.find({ receiverId: req.params.userId })
            .populate("itemId", "name category photo")
            .sort({ createdAt: -1 });

        res.status(200).json(rewards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get rewards given by a user
const getGivenRewards = async (req, res) => {
    try {
        const rewards = await Reward.find({ giverId: req.params.userId })
            .populate("itemId", "name category photo")
            .sort({ createdAt: -1 });

        res.status(200).json(rewards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    giveReward,
    getUserRewards,
    getGivenRewards,
};
