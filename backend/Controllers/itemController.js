const Item = require("../Model/itemModel");
const cloudinary = require('cloudinary').v2;

// Connected your exact credentials
cloudinary.config({
    cloud_name: 'dbllen24x',
    api_key: '298341491832269',
    api_secret: 'ELZw1rUUtiYlS1x1ZfFOHFb5VEk'
});

// Get all items
const getItems = async (req, res) => {
    try {
        const { category, type, search, startDate, endDate } = req.query;
        let query = {};
        if (category) query.category = category;
        if (type) query.type = type;

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }
        const items = await Item.find(query).sort({ date: -1 });
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

        let photoUrl = photo;
        // If a new photo is detected, upload to Cloudinary
        if (photo && photo.startsWith("data:image")) {
            const uploadRes = await cloudinary.uploader.upload(photo, {
                folder: "uniconnect_lost_found",// Organizes it in your cloud
            });
            photoUrl = uploadRes.secure_url;// Gets the permanent web URL
        }

        // Saves it to MongoDB database as a standard URL path
        const newItem = await Item.create({
            name,
            category,
            location,
            date,
            description,
            photo: photoUrl,
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
        let updateData = { ...req.body };

        if (updateData.photo && updateData.photo.startsWith("data:image")) {
            const uploadRes = await cloudinary.uploader.upload(updateData.photo, {
                folder: "uniconnect_lost_found",
            });
            updateData.photo = uploadRes.secure_url;
        }

        const item = await Item.findByIdAndUpdate(req.params.id, updateData, {
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
