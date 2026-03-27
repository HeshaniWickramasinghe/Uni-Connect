const express = require("express");
const router = express.Router();

const {
	createUser,
	loginUser,
	verifyEmail,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	updateProfilePicture
} = require("../Controllers_Logging/loggingController");

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.put("/:id/profile-picture", updateProfilePicture);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
