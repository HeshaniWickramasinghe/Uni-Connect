const express = require("express");
const router = express.Router();
const handoverController = require("../Controllers/handoverController");

router.post("/initiate", handoverController.initiateHandover);
router.post("/confirm", handoverController.confirmHandover);
router.get("/", handoverController.getAllHandovers);
router.delete("/:id", handoverController.deleteHandover);

module.exports = router;
