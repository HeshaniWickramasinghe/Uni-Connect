const Handover = require("../Model/handoverModel");
const Item = require("../Model/itemModel");
const User = require("../Model_Logging/loggingModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

const sendVerificationEmail = async (email, verificationCode, itemName, phoneNumber) => {
    const transporter = getMailerTransport();
    
    // Simulate SMS sending
    console.log(`[SMS Simulation] Sending code LNF-${verificationCode} to ${phoneNumber}`);

    await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Uni-Connect: Handover Verification Code",
        text: `Your verification code for the handover of "${itemName}" is LNF-${verificationCode}. This code has also been sent to your mobile number ${phoneNumber}.`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2>Handover Verification</h2>
                <p>A handover has been initiated for the item: <strong>${itemName}</strong>.</p>
                <p>Your digital receipt token is:</p>
                <div style="background: #f4f4f4; padding: 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    ${verificationCode}
                </div>
                <p>This code has also been sent to your registered mobile number: <strong>${phoneNumber}</strong>.</p>
                <p>Please provide this code to the finder to confirm that you have received the item.</p>
            </div>
        `
    });
};

exports.initiateHandover = async (req, res) => {
    try {
        const { itemId, finderName, registrationNo, faculty, contactNumber, universityIdPhoto, email } = req.body;

        if (!itemId || !finderName || !registrationNo || !faculty || !contactNumber || !universityIdPhoto || !email) {
            return res.status(400).json({ message: "All fields are required. Please ensure all fields are filled and a photo is uploaded." });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Validate IT number (registration number) exists in system
        const user = await User.findOne({ studentRegistrationNumber: registrationNo });
        if (!user) {
            return res.status(404).json({ message: "Invalid Registration Number. This user is not registered in our system." });
        }

        // Use the name from the registered account as the official receiver name
        const officialReceiverName = user.name || req.body.receiverName || "Verified Student";

        // Generate a 4-digit code
        const verificationCode = crypto.randomInt(1000, 9999).toString();

        const handover = new Handover({
            itemId,
            finderName,
            receiverName: officialReceiverName,
            email,
            registrationNo,
            faculty,
            contactNumber,
            universityIdPhoto,
            verificationCode,
            status: "PENDING"
        });

        await handover.save();
        await sendVerificationEmail(email, verificationCode, item.name, contactNumber);

        res.status(201).json({
            message: "Handover initiated. Verification code sent to receiver's email.",
            handoverId: handover._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.confirmHandover = async (req, res) => {
    try {
        const { handoverId, code } = req.body;

        const handover = await Handover.findById(handoverId);
        if (!handover) {
            return res.status(404).json({ message: "Handover record not found" });
        }

        // Strip "LNF-" if present
        const cleanCode = code.replace("LNF-", "").trim();

        if (handover.verificationCode !== cleanCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        handover.status = "COMPLETED";
        await handover.save();

        // Update item status to RESOLVED
        await Item.findByIdAndUpdate(handover.itemId, { status: "RESOLVED" });

        res.status(200).json({ message: "Handover confirmed successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllHandovers = async (req, res) => {
    try {
        const handovers = await Handover.find().populate('itemId').sort({ createdAt: -1 });
        res.status(200).json(handovers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
