const Item = require("../Model/itemModel");

// Get all items
const getItems = async (req, res) => {
    try {
        const { category, type, search } = req.query;
        let query = {};
        if (category) query.category = category;
        if (type) query.type = type;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }
        const items = await Item.find(query).sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single item
const getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new item
const createItem = async (req, res) => {
    try {
        const {
            name,
            category,
            location,
            date,
            description,
            photo,
            type,
            status,
            userName,
            color,
            brandSize,
        } = req.body;

        const newItem = await Item.create({
            name,
            category,
            location,
            date,
            description,
            photo,
            type,
            status: status || "ACTIVE",
            userName: userName || "Anonymous User",
            color,
            brandSize,
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an item
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an item
const updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getItems,
    getItem,
    createItem,
    deleteItem,
    updateItem,
};
