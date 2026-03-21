const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        photo: {
            type: String, // Can store base64 or URL
        },
        type: {
            type: String,
            enum: ["Lost", "Found"],
            required: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "CLAIMING", "RESOLVED"],
            default: "ACTIVE",
        },
        userName: {
            type: String, // Mock user name since no auth system
            required: true,
            default: "Anonymous User",
        },
        color: {
            type: String,
        },
        brandSize: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
