// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Nutrition from './pages/Nutrition';
import SleepTracker from './pages/SleepTracker';
import MedicalRecords from './pages/MedicalRecords';
import Calendar from './pages/Calendar';

import { MOCK_ACTIVITIES, MOCK_MEALS } from './services/mockData';
import './App.css';

function App() {
  // ⭐ STATE DÙNG CHUNG - Đây là "nguồn sự thật" duy nhất cho toàn ứng dụng
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [meals, setMeals] = useState(MOCK_MEALS);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />

        <div className="main-content">
          <Routes>
            {/* 1. Dashboard giờ đây nhận state để cập nhật Calo real-time */}
            <Route
              path="/"
              element={
                <Dashboard
                  activities={activities}
                  meals={meals}
                />
              }
            />

            {/* 2. Trang Hoạt động dùng chung state với Dashboard */}
            <Route
              path="/activities"
              element={
                <Activities
                  activities={activities}
                  setActivities={setActivities}
                />
              }
            />

            {/* 3. Trang Dinh dưỡng dùng chung state với Dashboard */}
            <Route
              path="/nutrition"
              element={
                <Nutrition
                  meals={meals}
                  setMeals={setMeals}
                />
              }
            />

            <Route
              path="/calendar"
              element={
                <Calendar
                  activities={activities}
                  meals={meals}
                />
              }
            />

            {/* Hiện tại các trang này đang dùng state nội bộ bên trong file */}
            <Route path="/sleep" element={<SleepTracker />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
