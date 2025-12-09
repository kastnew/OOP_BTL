import React, { useState, useEffect } from 'react';
import { MOCK_SLEEP } from '../services/mockData';
import './SleepTracker.css';

const SleepTracker = () => {
  const [sleepData, setSleepData] = useState([]);

  useEffect(() => {
    setSleepData(MOCK_SLEEP);
  }, []);

  return (
    <div className="sleep-container">
      <h1>Theo Dõi Giấc Ngủ 🌙</h1>
      
      <div className="sleep-list">
        {sleepData.map((item) => (
          <div key={item.id} className="sleep-card">
            <div className="sleep-icon">😴</div>
            <div className="sleep-info">
              <h3>{item.type}</h3>
              <p>Từ: <strong>{item.sleepTime}</strong></p>
              <p>Đến: <strong>{item.wakeTime}</strong></p>
            </div>
            <div className={`sleep-quality ${item.quality === 'Tốt' ? 'good' : 'average'}`}>
              {item.quality}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SleepTracker;