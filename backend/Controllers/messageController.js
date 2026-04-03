const Message = require("../Model/messageModel");
const Item = require("../Model/itemModel");

// Get messages for a private chat between two users for an item
const getMessages = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { user1, user2 } = req.query;

        let query = { itemId };

        // If specific users are provided, only return their private conversation
        if (user1 && user2) {
            query.$or = [
                { senderName: user1, receiverName: user2 },
                { senderName: user2, receiverName: user1 }
            ];
        }

        const messages = await Message.find(query).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a list of all users who have messaged the owner about an item
const getItemConversations = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { ownerName } = req.query;

        // Find all unique "other" users who have chatted with the owner regarding this item
        const messages = await Message.find({
            itemId,
            $or: [{ senderName: ownerName }, { receiverName: ownerName }]
        });

        const chatPartners = new Set();
        messages.forEach(msg => {
            if (msg.senderName !== ownerName) chatPartners.add(msg.senderName);
            if (msg.receiverName !== ownerName) chatPartners.add(msg.receiverName);
        });

        res.status(200).json(Array.from(chatPartners));
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
    getItemConversations,
    createMessage,
};
