// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>HealthApp 🩺</h2>
      </div>

      <nav className="menu">
        <NavLink to="/" end className="menu-item">
          🏠 Tổng quan
        </NavLink>

        <NavLink to="/activities" className="menu-item">
          🏃 Hoạt động
        </NavLink>

        <NavLink to="/nutrition" className="menu-item">
          🥗 Dinh dưỡng
        </NavLink>

        <NavLink to="/calendar" className="menu-item">
          📅 Lịch
        </NavLink>

        <NavLink to="/sleep" className="menu-item">
          🌙 Giấc ngủ
        </NavLink>

        <NavLink to="/medical-records" className="menu-item">
          🏥 Bệnh án điện tử
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
