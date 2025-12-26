// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Nutrition from './pages/Nutrition';
import SleepTracker from './pages/SleepTracker';
import MedicalRecords from './pages/MedicalRecords';
import Calendar from './pages/Calendar';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MonthReport from "./pages/MonthReport"; 
// Lưu ý: Không cần import DailyReport ở đây nữa vì nó đã được nhúng vào Calendar

import './App.css';

function App() {
  // ⭐ STATE AUTH (Giữ nguyên logic của nhóm bạn)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Kiểm tra ngay khi khởi động app
    return localStorage.getItem("app_is_auth") === "true";
  });
 
 
   return (
    <BrowserRouter>
      {/* ❗ CHƯA LOGIN: Chỉ được vào trang Login/Signup */}
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
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        // ✅ ĐÃ LOGIN: Vào ứng dụng chính
        <div className="app-container">
          <Sidebar />

          <div className="main-content">
            <Routes>
              {/* Trang chủ - Dashboard */}
              <Route
                path="/"
                element={<Dashboard setIsAuthenticated={setIsAuthenticated} />}
              />

              {/* Các trang chức năng (Tự quản lý dữ liệu qua API) */}
              <Route path="/activities" element={<Activities />} />
              <Route path="/nutrition" element={<Nutrition />} />
              
              {/* TRUNG TÂM NHẬT KÝ: Chứa cả Lịch và Báo cáo ngày bên trong */}
              <Route path="/calendar" element={<Calendar />} />

              <Route path="/sleep" element={<SleepTracker />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              
              {/* Trang Báo cáo tháng */}
              <Route path="/month-report" element={<MonthReport />} />

              {/* ❌ ĐÃ XÓA: Route "/report" đứng riêng lẻ theo yêu cầu của bạn */}

              {/* Fallback: Chuyển hướng về Dashboard nếu gõ sai URL */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
