// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  USERS, 
  HEALTH_INDICATORS, 
  MOCK_MEALS, 
  MOCK_ACTIVITIES 
} from '../services/mockData';
import './Dashboard.css';

const Dashboard = () => {
  // 1. State lưu thông tin người dùng & chỉ số (Gộp chung để dễ sửa)
  const [userInfo, setUserInfo] = useState({
    firstName: '', lastName: '', age: '', gender: '',
    height: '', weight: '', heartRate: '', bloodPressure: ''
  });

  // 2. State lưu tổng Calo (Tính toán từ dữ liệu hoạt động/ăn uống)
  const [calories, setCalories] = useState({ consumed: 0, burned: 0 });

  // 3. State tính BMI (Tự động)
  const [bmi, setBmi] = useState(0);

  // 4. State Modal sửa thông tin
  const [showModal, setShowModal] = useState(false);
  
  // Dùng state riêng cho form để khi nhập không bị nhảy số liên tục ở giao diện chính
  const [formData, setFormData] = useState({}); 

  // --- LOAD DỮ LIỆU BAN ĐẦU ---
  useEffect(() => {
    // Lấy User ID 1 làm mẫu
    const user = USERS.find(u => u.userId === 1);
    const health = HEALTH_INDICATORS.find(h => h.userId === 1);

    // Tính tổng Calo từ các trang khác
    const totalConsumed = MOCK_MEALS.reduce((sum, item) => sum + Number(item.calories), 0);
    const totalBurned = MOCK_ACTIVITIES.reduce((sum, item) => sum + Number(item.kcal || item.caloriesBurned || 0), 0);

    setCalories({ consumed: totalConsumed, burned: totalBurned });

    if (user && health) {
      setUserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        gender: user.gender,
        height: health.height,
        weight: health.weight,
        heartRate: health.heartRate,
        bloodPressure: health.bloodPressure
      });
    }
  }, []);

  // --- TỰ ĐỘNG TÍNH BMI KHI CÂN NẶNG/CHIỀU CAO THAY ĐỔI ---
  useEffect(() => {
    if (userInfo.weight && userInfo.height) {
      // Công thức: Cân nặng (kg) / (Chiều cao (m) * Chiều cao (m))
      const bmiValue = userInfo.weight / (userInfo.height * userInfo.height);
      setBmi(bmiValue.toFixed(2)); // Làm tròn 2 số thập phân
    }
  }, [userInfo.weight, userInfo.height]);

  // --- CÁC HÀM XỬ LÝ ---
  
  const handleEditClick = () => {
    setFormData(userInfo); // Copy dữ liệu hiện tại vào form
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUserInfo(formData); // Cập nhật giao diện chính
    setShowModal(false);
    alert("Cập nhật thông tin thành công!");
  };

  // Hàm đánh giá BMI
  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { text: "Thiếu cân", color: "#f1c40f" };
    if (bmi < 24.9) return { text: "Bình thường", color: "#27ae60" };
    if (bmi < 29.9) return { text: "Thừa cân", color: "#e67e22" };
    return { text: "Béo phì", color: "#c0392b" };
  };

  const bmiStatus = getBMIStatus(bmi);

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>👋 Tổng Quan Sức Khỏe</h1>
        <button className="btn-edit-profile" onClick={handleEditClick}>
          ⚙️ Cập nhật thông tin
        </button>
      </div>

      {/* --- PHẦN 1: THÔNG TIN CÁ NHÂN --- */}
      <div className="user-profile-card">
        <div className="avatar-circle">
          {userInfo.lastName ? userInfo.lastName.charAt(0) : 'U'}
        </div>
        <div className="user-details">
          <h2>{userInfo.firstName} {userInfo.lastName}</h2>
          <p>Tuổi: <strong>{userInfo.age}</strong> | Giới tính: <strong>{userInfo.gender}</strong></p>
        </div>
      </div>

      {/* --- PHẦN 2: CHỈ SỐ CƠ THỂ & BMI --- */}
      <div className="metrics-grid">
        {/* Thẻ BMI (Quan trọng nhất) */}
        <div className="metric-card bmi-card" style={{borderColor: bmiStatus.color}}>
          <h3>Chỉ số BMI</h3>
          <div className="big-value" style={{color: bmiStatus.color}}>{bmi}</div>
          <span className="status-badge" style={{backgroundColor: bmiStatus.color}}>
            {bmiStatus.text}
          </span>
        </div>

        <div className="metric-card">
          <h3>📏 Chiều cao</h3>
          <p className="big-value">{userInfo.height} <span>m</span></p>
        </div>

        <div className="metric-card">
          <h3>⚖️ Cân nặng</h3>
          <p className="big-value">{userInfo.weight} <span>kg</span></p>
        </div>

        <div className="metric-card">
          <h3>❤️ Nhịp tim</h3>
          <p className="big-value">{userInfo.heartRate} <span>bpm</span></p>
        </div>

        <div className="metric-card">
          <h3>🩸 Huyết áp</h3>
          <p className="big-value">{userInfo.bloodPressure}</p>
        </div>
      </div>

      {/* --- PHẦN 3: TỔNG KẾT CALO (Từ Dinh Dưỡng & Hoạt Động) --- */}
      <h3 className="section-title">📊 Cân Bằng Năng Lượng Hôm Nay</h3>
      <div className="calorie-summary">
        <div className="calo-box in">
          <span>Nạp vào (Ăn uống)</span>
          <strong>+{calories.consumed} kcal</strong>
        </div>
        
        <div className="calo-box balance">
          <span>Còn lại</span>
          {/* Calo còn lại = (Giả sử BMR khoảng 2000) + Vận động - Ăn uống */}
          {/* Ở đây tính đơn giản: Nạp - Tiêu hao */}
          <strong>{calories.consumed - calories.burned} kcal</strong>
          <small>(Nạp - Tiêu hao)</small>
        </div>

        <div className="calo-box out">
          <span>Tiêu hao (Vận động)</span>
          <strong>-{calories.burned} kcal</strong>
        </div>
      </div>

      {/* --- MODAL CHỈNH SỬA THÔNG TIN --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cập Nhật Hồ Sơ</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              {/* Nhóm 1: Thông tin cơ bản */}
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

              {/* Nhóm 2: Chỉ số cơ thể */}
              <h4 className="form-section-title">Chỉ số cơ thể</h4>
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