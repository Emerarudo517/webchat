// models/Message.js
const mongoose = require('mongoose');

// Định nghĩa schema cho file đính kèm
const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  data: String
});

// Định nghĩa schema cho tin nhắn
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  time: String,
  files: [fileSchema]
});

// Xuất mô hình Message
module.exports = mongoose.model('Message', messageSchema);