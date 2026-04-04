const express = require("express");
const router = express.Router();
const {
    getOrCreateProfile,
    getProfileByUserId,
    updateProfile,
    incrementStat,
    getLeaderboard,
} = require("../Controllers/userProfileController");

router.get("/", getOrCreateProfile);
router.get("/leaderboard", getLeaderboard);
router.get("/:userId", getProfileByUserId);
router.put("/:userId", updateProfile);
router.put("/:userId/increment", incrementStat);

module.exports = router;
