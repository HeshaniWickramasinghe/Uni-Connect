const express  = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const kuppiSessionRoutes = require("./routes/kuppiSessionRoutes");
const studentRegistrationRoutes = require("./routes/studentRegistrationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files for uploaded documents
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount Routes
app.use("/api/kuppi-sessions", kuppiSessionRoutes);
app.use("/api/student-registrations", studentRegistrationRoutes);

app.get("/", (req, res) => {
    res.send("Success");
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port", process.env.PORT);
    });
})
.catch((err) => {
    console.log(err);
});
