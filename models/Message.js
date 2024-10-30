// models/Message.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  data: String
});

const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  time: String,
  files: [fileSchema]
});

module.exports = mongoose.model('Message', messageSchema);