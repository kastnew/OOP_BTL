// src/utils/config.js

// --- CÁCH SỬ DỤNG ---
// 1. Nếu chạy một mình trên máy: Dùng dòng localhost (bỏ comment)
// 2. Nếu muốn chia sẻ mạng LAN: Dùng dòng chứa IP máy bạn (bỏ comment)

export const API_BASE_URL = "http://localhost:8080"; // <--- Dùng cái này khi code một mình
//export const API_BASE_URL = "http://172.21.51.133:8080"; // <--- Dùng cái này khi chia sẻ (Thay số 15 bằng IP máy bạn)

// Hàm lấy ID người dùng hiện tại từ bộ nhớ trình duyệt
// Nếu chưa đăng nhập thì trả về null
export const getCurrentUserId = () => {
    return localStorage.getItem("app_user_id");
};