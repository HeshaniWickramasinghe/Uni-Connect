const express = require("express");
const router = express.Router();
const faqController = require("../Controllers/faqController");

// User route for chatbot
router.get("/answer", faqController.getAnswer);
router.get("/recommendations", faqController.getRecommendations);

// Admin routes for management
router.post("/", faqController.createFAQ);
router.get("/", faqController.getAllFAQs);
router.put("/:id", faqController.updateFAQ);
router.delete("/:id", faqController.deleteFAQ);

module.exports = router;
