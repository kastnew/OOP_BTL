// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ✅ THÊM
import { 
  USERS, 
  HEALTH_INDICATORS, 
  MOCK_MEALS, 
  MOCK_ACTIVITIES 
} from '../services/mockData';
import './Dashboard.css';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: '', lastName: '', age: '', gender: '',
    height: '', weight: '', heartRate: '', bloodPressure: ''
  });

  const [calories, setCalories] = useState({ consumed: 0, burned: 0 });
  const [bmi, setBmi] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const user = USERS.find(u => u.userId === 1);
    const health = HEALTH_INDICATORS.find(h => h.userId === 1);

    const totalConsumed = MOCK_MEALS.reduce((sum, item) => sum + Number(item.calories), 0);
    const totalBurned = MOCK_ACTIVITIES.reduce(
      (sum, item) => sum + Number(item.kcal || item.caloriesBurned || 0), 0
    );

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

  useEffect(() => {
    if (userInfo.weight && userInfo.height) {
      const bmiValue = userInfo.weight / (userInfo.height * userInfo.height);
      setBmi(bmiValue.toFixed(2));
    }
  }, [userInfo.weight, userInfo.height]);

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
        <button className="btn-edit-profile" onClick={() => setShowModal(true)}>
          ⚙️ Cập nhật thông tin
        </button>
      </div>

      {/* --- PHẦN CALO --- */}
      <h3 className="section-title">📊 Cân Bằng Năng Lượng Hôm Nay</h3>
      <div className="calorie-summary">
        <div className="calo-box in">
          <span>Nạp vào</span>
          <strong>+{calories.consumed} kcal</strong>
        </div>

        <div className="calo-box balance">
          <span>Còn lại</span>
          <strong>{calories.consumed - calories.burned} kcal</strong>
        </div>

        <div className="calo-box out">
          <span>Tiêu hao</span>
          <strong>-{calories.burned} kcal</strong>
        </div>
      </div>

      {/* ✅ NÚT ĐI SANG CALENDAR (CHỈ THÊM PHẦN NÀY) */}
      <div className="calendar-link-wrapper">
        <Link to="/calendar" className="btn-calendar">
          📅 Xem lịch chi tiết
        </Link>
      </div>

      {/* Modal giữ nguyên */}
    </div>
  );
};

export default Dashboard;

