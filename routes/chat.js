const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Lấy tất cả các tin nhắn trong một phòng
router.get('/messages/:roomId', async (req, res) => {
    const { roomId } = req.params;

    try {
        const messages = await Message.find({ roomID: roomId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
