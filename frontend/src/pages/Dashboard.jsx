// src/pages/Dashboard.jsx
import React from 'react';
import './Dashboard.css'; // Kết nối file trang trí

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Sức Khỏe Của Tôi</h1>
      
      <div className="card-list">
        {/* Tạm thời điền số cứng để xem giao diện lên hình chưa */}
        <div className="card">
            <h3>Nhịp tim</h3>
            <p>75 bpm</p>
        </div>
        <div className="card">
            <h3>Cân nặng</h3>
            <p>68 kg</p>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;