console.log("Hello! This is the backend of Uni-Connect.");

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Import Routes
const loggingRoutes = require("./Routes_Logging/loggingRoutes");


// ✅ Route Middleware
app.use("/api/users", loggingRoutes);


// ✅ Test Route (optional)
app.get("/", (req, res) => {
    res.send("API is working...");
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT, () => {
        console.log("Server is running on port", process.env.PORT);
    });
})
.catch((err) => console.log(err));