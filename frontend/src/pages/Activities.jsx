// src/pages/Activities.jsx
import React, { useState, useEffect } from 'react';
import { MOCK_ACTIVITIES } from '../services/mockData';
import './Activities.css';

const Activities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Giả lập gọi API lấy danh sách hoạt động
    setActivities(MOCK_ACTIVITIES);
  }, []);

  return (
    <div className="page-container">
      <h1>Nhật Ký Hoạt Động 🏃‍♂️</h1>
      
      <div className="activity-list">
        {activities.map((item) => (
          <div key={item.id} className="activity-card">
            <div className="act-info">
              <h3>{item.name}</h3>
              <p>🕒 {item.startTime} - {item.endTime}</p>
            </div>
            <div className="act-kcal">
              🔥 {item.kcal} kcal
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;