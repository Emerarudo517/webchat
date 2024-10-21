const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// Middleware cho API
app.use(express.json());

// Đăng ký API tại đây...

// Socket.io event
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
    });

    socket.on('sendMessage', async ({ roomId, senderID, content }) => {
        const message = new Message({ roomID: roomId, senderID, content });
        await message.save();
        io.to(roomId).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
