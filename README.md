# webchat
Môn: Ngôn ngữ kịch bản

**Thiết kế API cơ bản:**
  **Đăng ký người dùng:**
    POST /api/auth/register: Nhận username, password, email, tạo người dùng mới.
    POST /api/auth/login: Nhận username và password, trả về JWT token.
  **Gửi và nhận tin nhắn:**
    POST /api/chat/message: Gửi tin nhắn mới vào phòng chat.
    GET /api/chat/messages/:roomId: Lấy danh sách tin nhắn của phòng chat.
