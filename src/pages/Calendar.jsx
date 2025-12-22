// src/pages/Calendar.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT FILE CẤU HÌNH CHUNG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import './Calendar.css';

const Calendar = () => {
  // 2. CẤU HÌNH API (Sửa để dùng biến chung)
  // const CURRENT_USER_ID = 1; // <-- Đã import ở trên
  // const API_BASE = "http://localhost:8080"; // <-- Thay bằng API_BASE_URL

  // 3. STATE
  const [currentMonth, setCurrentMonth] = useState(new Date());
   
  // selectedDate: Ngày người dùng click chọn
  const [selectedDate, setSelectedDate] = useState(() => {
    return localStorage.getItem('APP_SELECTED_DATE') || new Date().toISOString().split('T')[0];
  });

  // Dữ liệu chỉ dùng để hiện dấu chấm (dots) trên lịch
  const [dataMap, setDataMap] = useState({ activities: [], meals: [], sleeps: [] });

  // --- HELPER ĐỂ TẠO DANH SÁCH NĂM ---
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i); 
  const months = Array.from({ length: 12 }, (_, i) => i); 

  // 4. LOAD DỮ LIỆU (Dùng API_BASE_URL)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAct, resMeal, resSleep] = await Promise.all([
          fetch(`${API_BASE_URL}/DailyActivity/${CURRENT_USER_ID}`),
          fetch(`${API_BASE_URL}/Meal/${CURRENT_USER_ID}`),
          fetch(`${API_BASE_URL}/Sleep/${CURRENT_USER_ID}`)
        ]);
        
        const acts = await resAct.json();
        const meals = await resMeal.json();
        const sleeps = await resSleep.json();

        setDataMap({ 
          activities: acts || [], 
          meals: meals || [], 
          sleeps: sleeps || [] 
        });
      } catch (err) {
        console.error("Lỗi tải dữ liệu lịch:", err);
      }
    };
    fetchData();
  }, []);

  // 5. XỬ LÝ CHỌN NGÀY
  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    localStorage.setItem('APP_SELECTED_DATE', dateStr);
  };

  // --- 6. CÁC HÀM ĐIỀU KHIỂN LỊCH ---
  const changeMonthOffset = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const handleMonthSelect = (e) => {
    const newMonth = parseInt(e.target.value);
    setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth, 1));
  };

  const handleYearSelect = (e) => {
    const newYear = parseInt(e.target.value);
    setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1));
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    const todayStr = today.toISOString().split('T')[0];
    handleDateClick(todayStr);
  };

  // 7. TÍNH TOÁN HIỂN THỊ LƯỚI
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [
    ...Array(firstDay).fill(null), 
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  // Kiểm tra ngày có dữ liệu để hiện chấm
  const checkData = (dStr) => {
    return {
      hasAct: dataMap.activities.some(a => a.date === dStr),
      hasMeal: dataMap.meals.some(m => m.date === dStr),
      hasSleep: dataMap.sleeps.some(s => s.sleepDate === dStr)
    };
  };

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="calendar-top">
        <div className="header-left">
             <h1>📅 Lịch Sử</h1>
             <button className="btn-today" onClick={jumpToToday}>Hôm nay</button>
        </div>

        <div className="calendar-controls">
          <button className="nav-btn" onClick={() => changeMonthOffset(-1)}>◀</button>
          
          <select value={month} onChange={handleMonthSelect} className="cal-select">
            {months.map(m => (
              <option key={m} value={m}>Tháng {m + 1}</option>
            ))}
          </select>

          <select value={year} onChange={handleYearSelect} className="cal-select">
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button className="nav-btn" onClick={() => changeMonthOffset(1)}>▶</button>
        </div>
      </div>

      {/* LƯỚI LỊCH */}
      <div className="calendar-card">
        <div className="calendar-grid-header">
          {['CN','T2','T3','T4','T5','T6','T7'].map(d => (
            <div key={d} className="cal-head-cell">{d}</div>
          ))}
        </div>
        
        <div className="calendar-grid-body">
          {daysArray.map((day, index) => {
            if (!day) return <div key={index} className="cal-cell empty"></div>;

            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const { hasAct, hasMeal, hasSleep } = checkData(dateStr);

            return (
              <div 
                key={index} 
                className={`cal-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => handleDateClick(dateStr)}
              >
                <span className="day-num">{day}</span>
                <div className="dots-row">
                  {hasAct && <span className="dot dot-act"></span>}
                  {hasMeal && <span className="dot dot-meal"></span>}
                  {hasSleep && <span className="dot dot-sleep"></span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* ĐÃ XÓA PHẦN SUMMARY CARD Ở DƯỚI */}
    </div>
  );
};

export default Calendar;