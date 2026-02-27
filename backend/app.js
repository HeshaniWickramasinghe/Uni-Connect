console.log("Hello! This is the backend of Uni-Connect.");

//mongo pass = chenulR123

const express = require('express');
const mongoose = require('mongoose');

const app = express();
// Middleware to parse JSON bodies
app.use("/", (req, res, next) => {
    res.send("It Is Working...");
});

mongoose.connect("mongodb+srv://chenul:chenulR123@uniconnect.wwb9cly.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err) => console.log((err)));