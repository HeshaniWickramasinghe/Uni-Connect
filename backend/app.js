const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
require("dotenv").config();

// Import Routes
const itemRoutes = require("./Routes/itemRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const loggingRoutes = require("./Routes_Logging/loggingRoutes");
const paymentRoutes = require("./Routes_C/paymentRoutes");
const kuppiSessionRoutes = require("./Routes/kuppiSessionRoutes");
const studentRegistrationRoutes = require("./Routes/studentRegistrationRoutes");
const badgeRoutes = require("./Routes/badgeRoutes");
const userProfileRoutes = require("./Routes/userProfileRoutes");
const rewardRoutes = require("./Routes/rewardRoutes");
const ratingRoutes = require("./Routes/ratingRoutes");
const handoverRoutes = require("./Routes/handoverRoutes");
const Message = require("./Model/messageModel");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use Routes
app.use("/api/items", itemRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", loggingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/kuppi-sessions", kuppiSessionRoutes);
app.use("/api/student-registrations", studentRegistrationRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/profiles", userProfileRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/handovers", handoverRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("API is working...");
});

// Socket.io Implementation
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join_room", (data) => {
        // data can be itemId for public or a combined ID for private
        // Recommended format for private: itemId-user1-user2 (sorted users)
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", async (data) => {
        try {
            const { itemId, senderName, receiverName, text, room } = data;
            const newMessage = await Message.create({
                itemId,
                senderName,
                receiverName,
                text,
            });
            
            // If room is provided, emit only to that room, otherwise use default itemId room
            const targetRoom = room || itemId;
            io.to(targetRoom).emit("receive_message", newMessage);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        server.listen(PORT, () => {
            console.log("Server is running on port", PORT);
        });
    })
    .catch((err) => console.log(err));