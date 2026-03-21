const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const itemRoutes = require("./Routes/itemRoutes");
const messageRoutes = require("./Routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" })); // for base64 images

app.use("/api/items", itemRoutes);
app.use("/api/messages", messageRoutes);

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