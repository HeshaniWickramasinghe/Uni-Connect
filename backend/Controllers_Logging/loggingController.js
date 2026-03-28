const User = require("../Model_Logging/loggingModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;
const pendingRegistrations = new Map();

const generateVerificationCode = () => crypto.randomInt(100000, 1000000).toString();

const isEmailServiceConfigured = () => {
	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
	return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
};

const getMailerTransport = () => {
	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
	const missingVars = [];

	if (!SMTP_HOST) missingVars.push("SMTP_HOST");
	if (!SMTP_PORT) missingVars.push("SMTP_PORT");
	if (!SMTP_USER) missingVars.push("SMTP_USER");
	if (!SMTP_PASS) missingVars.push("SMTP_PASS");

	if (missingVars.length > 0) {
		throw new Error(`Email service is not configured. Missing env values: ${missingVars.join(", ")}`);
	}

	const port = Number(SMTP_PORT);
	const secure = SMTP_SECURE === "true" || port === 465;

	return nodemailer.createTransport({
		host: SMTP_HOST,
		port,
		secure,
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS
		}
	});
};

const sendVerificationEmail = async (email, verificationCode) => {
	if (!isEmailServiceConfigured()) {
		return { delivered: false };
	}

	const transporter = getMailerTransport();
	const from = process.env.MAIL_FROM || process.env.SMTP_USER;

	await transporter.sendMail({
		from,
		to: email,
		subject: "Uni-Connect verification code",
		text: `Your verification code is ${verificationCode}. It expires in 10 minutes.`,
		html: `<p>Your verification code is <strong>${verificationCode}</strong>.</p><p>It expires in 10 minutes.</p>`
	});

	return { delivered: true };
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
			return res.status(400).json({ message: "Invalid email format" });
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

		let emailDelivery = { delivered: false };
		try {
			emailDelivery = await sendVerificationEmail(normalizedEmail, verificationCode);
		} catch (emailError) {
			pendingRegistrations.delete(normalizedEmail);
			return res.status(500).json({ message: emailError.message });
		}

		const responsePayload = {
			message: emailDelivery.delivered
				? "Verification code sent to your email. Please verify to complete registration."
				: "Email service is not configured. Use the verification code provided to complete registration.",
			email: normalizedEmail
		};

		if (!emailDelivery.delivered && process.env.NODE_ENV !== "production") {
			responsePayload.verificationCode = verificationCode;
		}

		res.status(201).json(responsePayload);
	} catch (error) {
		res.status(500).json({ message: error.message });
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
			isEmailVerified: true,
			emailVerificationCode: "",
			emailVerificationCodeExpiresAt: null
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

		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (email && email !== user.email) {
			if (!emailRegex.test(email)) {
				return res.status(400).json({ message: "Invalid email format" });
			}

			const existingEmail = await User.findOne({ email });
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
		if (email !== undefined) user.email = email;
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
