// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Nutrition from './pages/Nutrition';
import SleepTracker from './pages/SleepTracker';
import MedicalRecords from './pages/MedicalRecords';
import Calendar from './pages/Calendar'; // ✅ THÊM

import './App.css'; // giữ nguyên

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Thanh Menu bên trái */}
        <Sidebar />

        {/* Nội dung chính */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/calendar" element={<Calendar />} /> {/* ✅ THÊM */}
            <Route path="/sleep" element={<SleepTracker />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
