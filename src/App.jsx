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
import { MOCK_ACTIVITIES, MOCK_MEALS } from './services/mockData';
import './App.css';

function App() {
  // ⭐ STATE DÙNG CHUNG
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [meals, setMeals] = useState(MOCK_MEALS);

  // ⭐ STATE AUTH
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      {/* ❗ Chưa login thì chỉ được vào /login */}
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
        // ✅ ĐÃ LOGIN → vào app chính
        <div className="app-container">
          <Sidebar />

          <div className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    activities={activities}
                    meals={meals}
                    setIsAuthenticated={setIsAuthenticated}
                  />
                }
              />

              <Route
                path="/activities"
                element={
                  <Activities
                    activities={activities}
                    setActivities={setActivities}
                  />
                }
              />

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

              <Route path="/sleep" element={<SleepTracker />} />
              <Route path="/medical-records" element={<MedicalRecords />} />

              {/* fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
