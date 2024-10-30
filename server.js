const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment');
const mongoose = require('mongoose');
const fs = require('fs');
const Message = require('./models/Message');

// Khởi tạo Express và server HTTP
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  maxHttpBufferSize: 5 * 1024 * 1024 // 5MB
});

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static('public'));

// API lấy các tin nhắn từ cơ sở dữ liệu
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ _id: 1 }).exec();
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Đọc số lượng khách từ file
let guestCount = 0;
try {
  const data = fs.readFileSync('guestCount.json', 'utf8');
  const json = JSON.parse(data);
  guestCount = json.count;
} catch (err) {
  console.error('Error reading guest count:', err);
}

// Xử lý kết nối Socket.IO
io.on('connection', (socket) => {
  guestCount++;
  const guestName = `guest_${guestCount}`;
  socket.emit('assign name', guestName);

  console.log(`${guestName} connected`);

  // Xử lý sự kiện nhận tin nhắn
  socket.on('chat message', async (msg) => {
    const now = moment();
    const isToday = now.isSame(moment(), 'day');
    const time = isToday ? `Today at ${now.format('h:mm A')}` : now.format('MMMM Do YYYY, h:mm A');
    
    const message = new Message({
      user: guestName,
      text: msg.text,
      time: time,
      files: msg.files
    });

    await message.save();

    io.emit('chat message', { user: guestName, text: msg.text, time: time, files: msg.files });
  });

  // Xử lý sự kiện ngắt kết nối
  socket.on('disconnect', () => {
    console.log(`${guestName} disconnected`);
  });

  // Lưu số lượng khách vào file
  fs.writeFileSync('guestCount.json', JSON.stringify({ count: guestCount }), 'utf8');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});