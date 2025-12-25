// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT CONFIG ĐỂ CHẠY MẠNG LAN
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import './Dashboard.css';

// Nhận prop setIsAuthenticated để xử lý đăng xuất
const Dashboard = ({ setIsAuthenticated }) => {
  
  // 2. CẤU HÌNH API
  const USER_API_URL = `${API_BASE_URL}/test`;

  // 3. STATE
  const [userInfo, setUserInfo] = useState({
    firstName: '', 
    lastName: '', 
    age: '', 
    gender: 'Nam',
    height: '', 
    weight: '', 
    heartRate: '', 
    bloodPressure: ''
  });

  const [bmi, setBmi] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  // 4. LOAD DỮ LIỆU USER TỪ BACKEND
  useEffect(() => {
    fetch(`${USER_API_URL}/${CURRENT_USER_ID}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setUserInfo(prev => ({
            ...prev,
            firstName: data.firstName,
            lastName: data.lastName,
            age: data.age,
            gender: data.gender,
            // Các chỉ số sức khỏe giữ nguyên giá trị cũ (nếu backend chưa có)
          }));
        }
      })
      .catch(err => console.error("Lỗi tải thông tin User:", err));
  }, []);

  // 5. TÍNH BMI TỰ ĐỘNG
  useEffect(() => {
    if (userInfo.weight && userInfo.height) {
      const bmiValue = userInfo.weight / (userInfo.height * userInfo.height);
      setBmi(bmiValue.toFixed(2));
    }
  }, [userInfo.weight, userInfo.height]);

  // --- CÁC HÀM XỬ LÝ FORM ---
  const handleEditClick = () => {
    setFormData(userInfo);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- LƯU THÔNG TIN (GỌI API PATCH) ---
  const handleSave = (e) => {
    e.preventDefault();

    const userPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: parseInt(formData.age),
        gender: formData.gender
    };

    fetch(`${USER_API_URL}/up/${CURRENT_USER_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
    })
    .then(res => {
        if (res.ok) {
            setUserInfo(formData);
            setShowModal(false);
            alert("Cập nhật thông tin thành công!");
        } else {
            alert("Lỗi khi lưu thông tin!");
        }
    })
    .catch(err => console.error("Lỗi save:", err));
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { text: "Thiếu cân", color: "#f1c40f" };
    if (bmi < 24.9) return { text: "Bình thường", color: "#27ae60" };
    if (bmi < 29.9) return { text: "Thừa cân", color: "#e67e22" };
    return { text: "Béo phì", color: "#c0392b" };
  };

  const bmiStatus = getBMIStatus(bmi);

  // --- HÀM XỬ LÝ ĐĂNG XUẤT (FIX LOGIC LOCALSTORAGE) ---
  const handleLogout = () => {
    // 1. Xóa trạng thái lưu trong bộ nhớ trình duyệt
    localStorage.removeItem("app_is_auth");
    
    // 2. Cập nhật state để React chuyển về màn hình Login
    if (typeof setIsAuthenticated === 'function') {
        setIsAuthenticated(false);
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>👋 Tổng Quan Sức Khỏe</h1>
        <div className="header-actions">
          {/* Nút Cập nhật */}
          <button className="btn-edit-profile" onClick={handleEditClick}>
            ⚙️ Cập nhật thông tin
          </button>
          
          {/* Nút Đăng xuất (Đã sửa logic) */}
          <button
            className="btn-logout"
            onClick={handleLogout} // Gọi hàm handleLogout thay vì viết inline
            style={{
                marginLeft: '10px',
                backgroundColor: '#c0392b',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
            }}
          >
            🔒 Logout
          </button>
        </div>
      </div>

      {/* THÔNG TIN CÁ NHÂN (Lấy từ Backend) */}
      <div className="user-profile-card">
        <div className="avatar-circle">
          {userInfo.lastName ? userInfo.lastName.charAt(0) : 'U'}
        </div>
        <div className="user-details">
          <h2>{userInfo.firstName} {userInfo.lastName}</h2>
          <p>Tuổi: <strong>{userInfo.age}</strong> | Giới tính: <strong>{userInfo.gender}</strong></p>
        </div>
      </div>

      {/* CHỈ SỐ CƠ THỂ */}
      <div className="metrics-grid">
        <div className="metric-card bmi-card" style={{borderColor: bmiStatus.color}}>
          <h3>Chỉ số BMI</h3>
          <div className="big-value" style={{color: bmiStatus.color}}>{bmi}</div>
          <span className="status-badge" style={{backgroundColor: bmiStatus.color}}>
            {bmiStatus.text}
          </span>
        </div>

        <div className="metric-card">
          <h3>📏 Chiều cao</h3>
          <p className="big-value">{userInfo.height || '--'} <span>m</span></p>
        </div>

        <div className="metric-card">
          <h3>⚖️ Cân nặng</h3>
          <p className="big-value">{userInfo.weight || '--'} <span>kg</span></p>
        </div>

        <div className="metric-card">
          <h3>❤️ Nhịp tim</h3>
          <p className="big-value">{userInfo.heartRate || '--'} <span>bpm</span></p>
        </div>

        <div className="metric-card">
          <h3>🩸 Huyết áp</h3>
          <p className="big-value">{userInfo.bloodPressure || '--'}</p>
        </div>
      </div>

      {/* MODAL SỬA THÔNG TIN */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cập Nhật Hồ Sơ</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <h4 className="form-section-title">Thông tin cá nhân</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Tên</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                    <label>Tuổi</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Giới tính</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                    </select>
                </div>
              </div>

              <h4 className="form-section-title">Chỉ số cơ thể (Lưu tại trình duyệt)</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Chiều cao (m)</label>
                  <input type="number" step="0.01" name="height" value={formData.height} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Cân nặng (kg)</label>
                  <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nhịp tim (bpm)</label>
                  <input type="number" name="heartRate" value={formData.heartRate} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Huyết áp</label>
                  <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleInputChange} />
                </div>
              </div>

              <button type="submit" className="btn-save-modal" style={{backgroundColor: '#34495e'}}>Lưu Thông Tin</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;