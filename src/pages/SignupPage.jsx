// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config"; // Import cấu hình API
import "./SignupPage.css";

function SignupPage() {
  // Bỏ state name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // Hook để chuyển trang

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Validate phía Client (Đã bỏ check name)
    if (!email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    try {
      // 2. Chuẩn bị dữ liệu gửi đi
      // Backend dùng @RequestParam nên phải dùng URLSearchParams
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);
      
      // 3. Gọi API Đăng ký
      const response = await fetch(`${API_BASE_URL}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (response.ok) {
        // Đăng ký thành công
        alert("Tài khoản đã được tạo thành công! Vui lòng đăng nhập.");
        navigate("/login"); // Chuyển hướng về trang đăng nhập
      } else {
        // Xử lý lỗi từ backend (ví dụ email trùng)
        setError("Đăng ký thất bại. Email có thể đã tồn tại.");
      }

    } catch (err) {
      console.error(err);
      setError("Lỗi mạng. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Đăng ký</h2>

        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</p>}

        {/* Đã xóa phần input Name tại đây */}

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

        <div className="input-group">
          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-btn" type="submit">
          Tạo tài khoản
        </button>

        <p className="login-footer">
          Đã có tài khoản? <Link to="/login"><span>Đăng nhập</span></Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;