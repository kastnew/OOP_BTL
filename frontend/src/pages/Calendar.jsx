// src/pages/Calendar.jsx
import React, { useState, useMemo } from 'react';
import './Calendar.css';

const Calendar = ({ activities = [], meals = [] }) => {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split('T')[0]
  );

  /* ======================
     B – TÍNH KCal TRONG NGÀY
  ====================== */
  const dayActivities = useMemo(
    () => activities.filter(a => a.date === selectedDate),
    [activities, selectedDate]
  );

  const dayMeals = useMemo(
    () => meals.filter(m => m.date === selectedDate),
    [meals, selectedDate]
  );

  const kcalOut = dayActivities.reduce((s, a) => s + Number(a.kcal || 0), 0);
  const kcalIn = dayMeals.reduce((s, m) => s + Number(m.calories || 0), 0);

  /* ======================
     C – ĐÁNH DẤU NGÀY
  ====================== */
  const hasActivity = d => activities.some(a => a.date === d);
  const hasMeal = d => meals.some(m => m.date === d);

  const getDayClass = d => {
    if (hasActivity(d) && hasMeal(d)) return 'both';
    if (hasActivity(d)) return 'activity';
    if (hasMeal(d)) return 'meal';
    return '';
  };

  /* ======================
     LỊCH THÁNG
  ====================== */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="page-container">
      {/* ===== HEADER ===== */}
      <div className="calendar-top">
        <h1>📅 Lịch Hoạt Động & Dinh Dưỡng</h1>

        <div className="calendar-nav">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>◀</button>
          <span>
            {currentMonth.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>▶</button>
        </div>
      </div>

      {/* ===== CARD LỊCH ===== */}
      <div className="calendar-card">
        <div className="calendar-grid">
          {['CN','T2','T3','T4','T5','T6','T7'].map(d => (
            <div key={d} className="calendar-header-cell">{d}</div>
          ))}

          {days.map((day, i) => {
            if (!day) return <div key={i} className="calendar-cell empty" />;

            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const selected = dateStr === selectedDate;

            return (
              <div
                key={i}
                className={`calendar-cell ${getDayClass(dateStr)} ${selected ? 'selected' : ''}`}
                onClick={() => setSelectedDate(dateStr)}
              >
                <span>{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== THỐNG KÊ ===== */}
      <div className="day-summary-card">
        <h3>📊 Ngày {selectedDate}</h3>

        <div className="summary-grid">
          <div className="summary-box in">
            <span>Nạp vào</span>
            <strong>+{kcalIn} kcal</strong>
          </div>

          <div className="summary-box balance">
            <span>Cân bằng</span>
            <strong>{kcalIn - kcalOut} kcal</strong>
          </div>

          <div className="summary-box out">
            <span>Tiêu hao</span>
            <strong>-{kcalOut} kcal</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
