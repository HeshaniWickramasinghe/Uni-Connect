const User = require("../Model_Logging/loggingModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const emailRegex = /^[^\s@]+@(my\.sliit\.lk|sliit\.lk)$/i;
const phoneRegex = /^\d{10}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;
const pendingRegistrations = new Map();

const generateVerificationCode = () => crypto.randomInt(100000, 1000000).toString();

const toBool = (value) => String(value).toLowerCase() === "true";

const getMailerTransport = () => {
	return nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		secure: toBool(process.env.SMTP_SECURE) || Number(process.env.SMTP_PORT) === 465,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS
		}
	});
};

const sendVerificationEmail = async (email, verificationCode) => {
	if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
		throw new Error(
			"Email service is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS in backend/.env"
		);
	}

	const transporter = getMailerTransport();
	await transporter.sendMail({
		from: process.env.MAIL_FROM || process.env.SMTP_USER,
		to: email,
		subject: "Uni-Connect verification code",
		text: `Your Uni-Connect verification code is ${verificationCode}. It expires in 10 minutes. If you did not request this, ignore this email.`,
		html: `<p>Your Uni-Connect verification code is <strong>${verificationCode}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not request this, ignore this email.</p>`
	});
};

const getPendingRegistration = (email) => {
	const pending = pendingRegistrations.get(email);
	if (!pending) {
		return null;
	}

	if (Date.now() > pending.expiresAt) {
		pendingRegistrations.delete(email);
		return null;
	}

	return pending;
};

exports.createUser = async (req, res) => {
	try {
		const { name, email, password, phoneNumber, studentRegistrationNumber } = req.body;
		const normalizedEmail = (email || "").trim().toLowerCase();

		if (!name || !email || !password || !phoneNumber || !studentRegistrationNumber) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (!emailRegex.test(normalizedEmail)) {
			return res.status(400).json({ message: "Please use your SLIIT email (@my.sliit.lk or @sliit.lk)" });
		}

		if (!phoneRegex.test(phoneNumber)) {
			return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
		}

		if (!passwordRegex.test(password)) {
			return res.status(400).json({
				message: "Password must be at least 8 characters and include one uppercase letter and one special character"
			});
		}

		const existingEmail = await User.findOne({ email: normalizedEmail });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		const existingRegNo = await User.findOne({ studentRegistrationNumber });
		if (existingRegNo) {
			return res.status(400).json({ message: "Student registration number already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationCode = generateVerificationCode();
		const expiresAt = Date.now() + VERIFICATION_CODE_TTL_MS;

		pendingRegistrations.set(normalizedEmail, {
			name,
			email: normalizedEmail,
			password: hashedPassword,
			phoneNumber,
			studentRegistrationNumber,
			verificationCode,
			expiresAt
		});

		try {
			await sendVerificationEmail(normalizedEmail, verificationCode);
		} catch (emailError) {
			pendingRegistrations.delete(normalizedEmail);
			return res.status(500).json({ message: emailError.message });
		}

		res.status(201).json({
			message: "Verification code sent to your email. Please verify to complete registration.",
			email: normalizedEmail
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.resendVerificationCode = async (req, res) => {
	try {
		const normalizedEmail = (req.body?.email || "").trim().toLowerCase();

		if (!normalizedEmail) {
			return res.status(400).json({ message: "Email is required" });
		}

		if (!emailRegex.test(normalizedEmail)) {
			return res.status(400).json({ message: "Please use your SLIIT email (@my.sliit.lk or @sliit.lk)" });
		}

		const pending = getPendingRegistration(normalizedEmail);
		if (!pending) {
			return res.status(400).json({ message: "No pending registration found or code expired" });
		}

		const verificationCode = generateVerificationCode();
		pending.verificationCode = verificationCode;
		pending.expiresAt = Date.now() + VERIFICATION_CODE_TTL_MS;
		pendingRegistrations.set(normalizedEmail, pending);

		await sendVerificationEmail(normalizedEmail, verificationCode);

		return res.status(200).json({ message: "A new verification code was sent to your email." });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const normalizedEmail = (email || "").trim().toLowerCase();

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const user = await User.findOne({ email: normalizedEmail });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		if (!user.isEmailVerified) {
			return res.status(403).json({ message: "Please verify your email before logging in." });
		}

		res.status(200).json({
			message: "Login successful",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phoneNumber: user.phoneNumber,
				studentRegistrationNumber: user.studentRegistrationNumber,
				profileImage: user.profileImage || ""
			}
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.verifyEmail = async (req, res) => {
	try {
		const { email, code } = req.body;
		const normalizedEmail = (email || "").trim().toLowerCase();
		const normalizedCode = (code || "").trim();

		if (!normalizedEmail || !normalizedCode) {
			return res.status(400).json({ message: "Email and verification code are required" });
		}

		const pending = getPendingRegistration(normalizedEmail);
		if (!pending) {
			return res.status(400).json({ message: "No pending registration found or code expired" });
		}

		if (pending.verificationCode !== normalizedCode) {
			return res.status(400).json({ message: "Invalid verification code" });
		}

		const existingEmail = await User.findOne({ email: normalizedEmail });
		if (existingEmail) {
			pendingRegistrations.delete(normalizedEmail);
			return res.status(400).json({ message: "Email already exists" });
		}

		const existingRegNo = await User.findOne({
			studentRegistrationNumber: pending.studentRegistrationNumber
		});
		if (existingRegNo) {
			pendingRegistrations.delete(normalizedEmail);
			return res.status(400).json({ message: "Student registration number already exists" });
		}

		await User.create({
			name: pending.name,
			email: pending.email,
			password: pending.password,
			phoneNumber: pending.phoneNumber,
			studentRegistrationNumber: pending.studentRegistrationNumber,
			isEmailVerified: true
		});

		pendingRegistrations.delete(normalizedEmail);

		return res.status(200).json({ message: "Email verified successfully" });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

exports.updateProfilePicture = async (req, res) => {
	try {
		const { id } = req.params;
		const { profileImage } = req.body;

		if (!profileImage || typeof profileImage !== "string") {
			return res.status(400).json({ message: "profileImage is required" });
		}

		if (!profileImage.startsWith("data:image/")) {
			return res.status(400).json({ message: "Invalid image format" });
		}

		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.profileImage = profileImage;
		await user.save();

		return res.status(200).json({
			message: "Profile picture updated successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phoneNumber: user.phoneNumber,
				studentRegistrationNumber: user.studentRegistrationNumber,
				profileImage: user.profileImage || ""
			}
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getAllUsers = async (_req, res) => {
	try {
		const users = await User.find().select("-password");
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const { name, email, password, phoneNumber, studentRegistrationNumber } = req.body;
		const normalizedEmail = (email || "").trim().toLowerCase();

		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (email && normalizedEmail !== user.email) {
			if (!emailRegex.test(normalizedEmail)) {
				return res.status(400).json({ message: "Please use your SLIIT email (@my.sliit.lk or @sliit.lk)" });
			}

			const existingEmail = await User.findOne({ email: normalizedEmail });
			if (existingEmail) {
				return res.status(400).json({ message: "Email already exists" });
			}
		}

		if (phoneNumber !== undefined && !phoneRegex.test(phoneNumber)) {
			return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
		}

		if (
			studentRegistrationNumber &&
			studentRegistrationNumber !== user.studentRegistrationNumber
		) {
			const existingRegNo = await User.findOne({ studentRegistrationNumber });
			if (existingRegNo) {
				return res.status(400).json({ message: "Student registration number already exists" });
			}
		}

		if (name !== undefined) user.name = name;
		if (email !== undefined) user.email = normalizedEmail;
		if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
		if (studentRegistrationNumber !== undefined) {
			user.studentRegistrationNumber = studentRegistrationNumber;
		}
		if (password !== undefined) {
			if (!passwordRegex.test(password)) {
				return res.status(400).json({
					message: "Password must be at least 8 characters and include one uppercase letter and one special character"
				});
			}

			user.password = await bcrypt.hash(password, 10);
		}

		const updatedUser = await user.save();
		const safeUser = updatedUser.toObject();
		delete safeUser.password;

		res.status(200).json({ message: "User updated successfully", user: safeUser });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
