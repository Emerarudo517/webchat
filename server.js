const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Thêm module path
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Hoặc chỉ định domain cụ thể như 'http://localhost:8847'
        methods: ['GET', 'POST']
    }
});

// Middleware cho API
app.use(express.json());

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Phục vụ các tệp tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Route để trả về index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Đăng ký các route ở đây
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// Sự kiện cho Socket.io
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, senderID, content }) => {
        const message = new Message({ roomID: roomId, senderID, content });
        await message.save();
        console.log(`Message saved: ${content}`); // Log khi lưu tin nhắn thành công
        io.to(roomId).emit('newMessage', message);
        console.log(`Message sent to room ${roomId}:`, message); // Log khi gửi sự kiện `newMessage`
    });    

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 8847;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
