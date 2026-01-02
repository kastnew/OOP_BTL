// src/utils/config.js

// --- CÁCH SỬ DỤNG ---
// 1. Nếu chạy một mình trên máy: Dùng dòng localhost (bỏ comment)
// 2. Nếu muốn chia sẻ mạng LAN: Dùng dòng chứa IP máy bạn (bỏ comment)

// 1. URL gốc của Backend
export const API_BASE_URL = "http://localhost:8080";

// 2. Hàm lấy ID người dùng hiện tại từ bộ nhớ trình duyệt
// Nếu chưa đăng nhập thì trả về null
export const getCurrentUserId = () => {
    return localStorage.getItem("app_user_id");
};