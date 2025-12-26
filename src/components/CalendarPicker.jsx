// src/components/CalendarPicker.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import './CalendarPicker.css';

const CalendarPicker = ({ onDateSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dataMap, setDataMap] = useState({ activities: [], meals: [], sleeps: [] });

  // Load dữ liệu để hiển thị các chấm (dots) báo hiệu ngày có dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAct, resMeal, resSleep] = await Promise.all([
          fetch(`${API_BASE_URL}/DailyActivity/${CURRENT_USER_ID}`),
          fetch(`${API_BASE_URL}/Meal/${CURRENT_USER_ID}`),
          fetch(`${API_BASE_URL}/Sleep/${CURRENT_USER_ID}`)
        ]);
        setDataMap({ 
          activities: await resAct.json() || [], 
          meals: await resMeal.json() || [], 
          sleeps: await resSleep.json() || [] 
        });
      } catch (err) {
        console.error("Lỗi tải dữ liệu lịch:", err);
      }
    };
    fetchData();
  }, []);

  // Các hàm điều khiển lịch (Giữ nguyên logic của bạn)
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(year, month + offset, 1));
  };

  return (
    <div className="calendar-modal-overlay" onClick={onClose}>
      <div className="calendar-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-modal-header">
          <h3>📅 Chọn ngày nhập liệu</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="calendar-modal-controls">
          <button onClick={() => changeMonth(-1)}>◀</button>
          <span>Tháng {month + 1} - {year}</span>
          <button onClick={() => changeMonth(1)}>▶</button>
        </div>

        <div className="calendar-modal-grid">
          {['CN','T2','T3','T4','T5','T6','T7'].map(d => (
            <div key={d} className="modal-grid-head">{d}</div>
          ))}
          {daysArray.map((day, index) => {
            if (!day) return <div key={index} className="modal-cell empty"></div>;
            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            
            return (
              <div 
                key={index} 
                className={`modal-cell ${isToday ? 'is-today' : ''}`}
                onClick={() => {
                  onDateSelect(dateStr);
                  onClose();
                }}
              >
                <span className="day-number">{day}</span>
                <div className="modal-dots">
                  {dataMap.activities.some(a => a.date === dateStr) && <span className="m-dot dot-act"></span>}
                  {dataMap.meals.some(m => m.date === dateStr) && <span className="m-dot dot-meal"></span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;
