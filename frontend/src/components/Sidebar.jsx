// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Dùng Link để chuyển trang không load lại web
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>HealthApp 🩺</h2>
      </div>
      <nav className="menu">
        <Link to="/" className="menu-item">🏠 Tổng quan & Cá nhân</Link>
        <Link to="/activities" className="menu-item">🏃 Hoạt động</Link>
        <Link to="/nutrition" className="menu-item">🥗 Dinh dưỡng</Link>
        <Link to="/sleep" className="menu-item">🌙 Giấc ngủ</Link>
        <Link to="/medical-records" className="menu-item">🏥 Bệnh án điện tử</Link> 
      </nav>
    </div>
  );
};

export default Sidebar;