const express = require("express");
const router = express.Router();
const {
    createRating,
    getUserRatings,
    getUserRatingSummary,
    checkRating,
} = require("../Controllers/ratingController");

router.post("/", createRating);
router.get("/check", checkRating);
router.get("/user/:userId", getUserRatings);
router.get("/summary/:userId", getUserRatingSummary);

module.exports = router;
