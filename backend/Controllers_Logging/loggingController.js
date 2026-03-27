const User = require("../Model_Logging/loggingModel");
const bcrypt = require("bcryptjs");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

exports.createUser = async (req, res) => {
	try {
		const { name, email, password, phoneNumber, studentRegistrationNumber } = req.body;

		if (!name || !email || !password || !phoneNumber || !studentRegistrationNumber) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (!emailRegex.test(email)) {
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

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		const existingRegNo = await User.findOne({ studentRegistrationNumber });
		if (existingRegNo) {
			return res.status(400).json({ message: "Student registration number already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			phoneNumber,
			studentRegistrationNumber
		});

		const safeUser = user.toObject();
		delete safeUser.password;

		res.status(201).json({ message: "User created successfully", user: safeUser });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		res.status(200).json({
			message: "Login successful",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phoneNumber: user.phoneNumber,
				studentRegistrationNumber: user.studentRegistrationNumber
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
