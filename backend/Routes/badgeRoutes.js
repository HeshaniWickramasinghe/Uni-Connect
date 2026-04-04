const express = require("express");
const router = express.Router();
const {
    getAllBadges,
    getActiveBadges,
    getBadgeById,
    createBadge,
    updateBadge,
    deleteBadge,
} = require("../Controllers/badgeController");

router.get("/", getAllBadges);
router.get("/active", getActiveBadges);
router.get("/:id", getBadgeById);
router.post("/", createBadge);
router.put("/:id", updateBadge);
router.delete("/:id", deleteBadge);

module.exports = router;
