console.log("Hello! This is the backend of Uni-Connect.");

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Import Routes
const loggingRoutes = require("./Routes_Logging/loggingRoutes");
const paymentRoutes = require("./Routes_C/paymentRoutes");

// Use Routes
app.use("/api/users", loggingRoutes);
app.use("/api/payments", paymentRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("API is working...");
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT, () => {
        console.log("Server is running on port", process.env.PORT);
    });
})
.catch((err) => console.log(err));