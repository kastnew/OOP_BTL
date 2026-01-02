// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config"; // Import cấu hình API
import "./LoginPage.css";

function LoginPage({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Thêm state để hiển thị lỗi
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi cũ

    try {
      // 1. Tạo dữ liệu dạng form-urlencoded (Khớp với @RequestParam của Backend)
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      // 2. Gọi API
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối đến server");
      }

      // 3. Xử lý kết quả trả về (Backend trả về ID dạng số hoặc rỗng)
      const text = await response.text();
      
      // Nếu text rỗng hoặc không phải số -> Đăng nhập thất bại
      if (!text || text.trim() === "") {
        setError("Email hoặc mật khẩu không chính xác!");
        return;
      }

      const userId = parseInt(text);

      if (userId) {
        // ✅ Đăng nhập thành công
        localStorage.setItem("app_is_auth", "true");
        localStorage.setItem("app_user_id", userId); // Lưu ID người dùng
        
        setIsAuthenticated(true); // Cập nhật trạng thái Global
        navigate("/"); // Chuyển hướng về Dashboard
      } else {
        setError("Đăng nhập thất bại.");
      }

    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Đăng nhập</h2>

        {/* Hiển thị lỗi nếu có */}
        {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</p>}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu của bạn"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-btn" type="submit">
          Đăng nhập
        </button>

        <p className="login-footer">
          Chưa có tài khoản? <Link to="/signup"><span>Đăng ký ngay</span></Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;