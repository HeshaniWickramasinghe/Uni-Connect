console.log("Hello! This is the backend of Uni-Connect.");

const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();
// Middleware to parse JSON bodies
app.use("/", (req, res, next) => {
    res.send("It Is Working...");
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port", process.env.PORT);
    });
})
.catch((err) => console.log((err)));