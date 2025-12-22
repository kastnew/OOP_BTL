// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORT COMPONENTS ---
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Nutrition from './pages/Nutrition';
import SleepTracker from './pages/SleepTracker';
import MedicalRecords from './pages/MedicalRecords';
import Calendar from './pages/Calendar';
import DailyReport from './pages/DailyReport'; // Mới thêm từ file 2
import MonthReport from './pages/MonthReport'; // Mới thêm từ file 2

// --- IMPORT AUTH PAGES ---
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import './App.css';

function App() {
  // ⭐ STATE AUTH (Quản lý trạng thái đăng nhập)
  // Mặc định là false (chưa đăng nhập)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      {/* ❗ TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP -> Chỉ hiện Login/Signup */}
      {!isAuthenticated ? (
        <Routes>
          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/signup"
            element={<SignupPage setIsAuthenticated={setIsAuthenticated} />}
          />
          {/* Bất kỳ link lạ nào cũng chuyển về Login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        // ✅ TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP -> Vào App chính
        <div className="app-container">
          {/* 1. Thanh Menu bên trái */}
          <Sidebar />

          {/* 2. Nội dung chính bên phải */}
          <div className="main-content">
            <Routes>
              {/* --- Trang Dashboard --- */}
              {/* Truyền setIsAuthenticated để làm nút Logout */}
              <Route 
                path="/" 
                element={<Dashboard setIsAuthenticated={setIsAuthenticated} />} 
              />

              {/* --- Các trang chức năng (Tự gọi API, không cần truyền props) --- */}
              <Route path="/activities" element={<Activities />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/sleep" element={<SleepTracker />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/calendar" element={<Calendar />} />
              
              {/* --- Các trang báo cáo --- */}
              <Route path="/report" element={<DailyReport />} />
              <Route path="/month-report" element={<MonthReport />} />

              {/* Link sai -> Quay về Dashboard */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;