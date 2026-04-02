const Message = require("../Model/messageModel");

// Get messages for an item
const getMessages = async (req, res) => {
    try {
        const { itemId } = req.params;
        const messages = await Message.find({ itemId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a message
const createMessage = async (req, res) => {
    try {
        const { itemId, senderName, receiverName, text } = req.body;
        const newMessage = await Message.create({
            itemId,
            senderName,
            receiverName,
            text,
        });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getMessages,
    createMessage,
};
