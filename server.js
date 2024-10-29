// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  maxHttpBufferSize: 5 * 1024 * 1024 // 5MB
});

app.use(express.static('public'));

let guestCount = 0;

io.on('connection', (socket) => {
  guestCount++;
  const guestName = `guest_${guestCount}`;
  socket.emit('assign name', guestName);

  console.log(`${guestName} connected`);

  socket.on('chat message', (msg) => {
    const now = moment();
    const isToday = now.isSame(moment(), 'day');
    const time = isToday ? `Today at ${now.format('h:mm A')}` : now.format('MMMM Do YYYY, h:mm A');
    io.emit('chat message', { user: guestName, text: msg.text, time: time, files: msg.files });
  });

  socket.on('disconnect', () => {
    console.log(`${guestName} disconnected`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});