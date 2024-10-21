const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    senderID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roomID: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', MessageSchema);
