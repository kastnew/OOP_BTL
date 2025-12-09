// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Profile from './pages/Profile';
import './App.css'; // Kết nối file CSS bạn đã sửa
import Nutrition from './pages/Nutrition';
import SleepTracker from './pages/SleepTracker';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* 1. Thanh Menu bên trái */}
        <Sidebar />
        
        {/* 2. Nội dung chính bên phải */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/sleep" element={<SleepTracker />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;