// public/scripts.js

// Kết nối
const socket = io();
let userName = '';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Nhận id khách từ server
socket.on('assign name', (name) => {
  userName = name;
});

// Lấy các phần tử DOM
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const imageInput = document.getElementById('imageInput');
const fileInput = document.getElementById('fileInput');
const sendImageButton = document.getElementById('sendImage');
const sendFileButton = document.getElementById('sendFile');

// Lấy các tin nhắn cũ
document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/messages');
  const oldMessages = await response.json();
  oldMessages.forEach(addMessageToUI);
});

// Gửi tin nhắn
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', { text: input.value });
    input.value = '';
  }
});

// Gửi ảnh/video
sendImageButton.addEventListener('click', () => {
  imageInput.click();
});

// Gửi file
sendFileButton.addEventListener('click', () => {
  fileInput.click();
});

// Chọn file ảnh/video
imageInput.addEventListener('change', () => {
  const files = Array.from(imageInput.files);
  if (files.length > 0) {
    if (files.some(file => file.size > MAX_FILE_SIZE)) {
      alert('Vui lòng gửi file dưới 5MB.');
      return;
    }
    const fileData = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.push({ name: file.name, type: file.type, data: e.target.result });
        if (fileData.length === files.length) {
          socket.emit('chat message', { text: input.value, files: fileData });
          input.value = '';
        }
      };
      reader.readAsDataURL(file);
    });
  }
});

// Chọn file
fileInput.addEventListener('change', () => {
  const files = Array.from(fileInput.files);
  if (files.length > 0) {
    if (files.some(file => file.size > MAX_FILE_SIZE)) {
      alert('Vui lòng gửi file dưới 5MB.');
      return;
    }
    const fileData = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.push({ name: file.name, type: file.type, data: e.target.result });
        if (fileData.length === files.length) {
          socket.emit('chat message', { text: input.value, files: fileData });
          input.value = '';
        }
      };
      reader.readAsDataURL(file);
    });
  }
});

// Nhận tin nhắn và hiển thị
socket.on('chat message', (msg) => {
  addMessageToUI(msg);
});

// Thêm tin nhắn vào giao diện
function addMessageToUI(msg) {
  const item = document.createElement('li');
  item.innerHTML = `<strong>${msg.user}</strong> <em>${msg.time}</em><br>${msg.text}`;
  if (msg.files) {
    msg.files.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const media = document.createElement(file.type.startsWith('image/') ? 'img' : 'video');
        media.src = file.data;
        media.controls = true;
        media.className = 'media';
        item.appendChild(media);
      } else {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        link.textContent = `Download ${file.name}`;
        item.appendChild(link);
      }
    });
  }
  messages.insertBefore(item, messages.firstChild);
}