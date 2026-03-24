const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const itemRoutes = require("./Routes/itemRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const Message = require("./Model/messageModel");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/items", itemRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
    res.send("Success");
});

// Socket.io Implementation
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", async (data) => {
        try {
            const { itemId, senderName, receiverName, text } = data;
            const newMessage = await Message.create({
                itemId,
                senderName,
                receiverName,
                text,
            });
            io.to(data.itemId).emit("receive_message", newMessage);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .then(() => {
        server.listen(PORT, () => {
            console.log("Server is running on port", PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });