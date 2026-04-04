const express = require("express");
const router = express.Router();
const {
    giveReward,
    getUserRewards,
    getGivenRewards,
} = require("../Controllers/rewardController");

router.post("/", giveReward);
router.get("/received/:userId", getUserRewards);
router.get("/given/:userId", getGivenRewards);

module.exports = router;
