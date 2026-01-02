// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Nutrition from './pages/Nutrition';
import SleepTracker from './pages/SleepTracker';
import MedicalRecords from './pages/MedicalRecords';
import DailyReport from './pages/DailyReport';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MonthReport from "./pages/MonthReport"; 

import './App.css';

function App() {
  // ⭐ STATE AUTH 
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Kiểm tra cờ auth VÀ phải có user_id (vì backend mới cần ID để gọi API)
    const isAuth = localStorage.getItem("app_is_auth") === "true";
    const hasUserId = localStorage.getItem("app_user_id");
    
    return isAuth && hasUserId;
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
          {/* Signup không cần setIsAuthenticated nữa vì đăng ký xong sẽ redirect về Login */}
          <Route
            path="/signup"
            element={<SignupPage />}
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
              
              <Route path="/daily-report" element={<DailyReport />} />

              <Route path="/sleep" element={<SleepTracker />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              
              {/* Trang Báo cáo tháng */}
              <Route path="/month-report" element={<MonthReport />} />

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