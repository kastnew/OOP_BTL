// src/pages/Calendar.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';

const Calendar = ({ activities = [], meals = [] }) => {
  const navigate = useNavigate();

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const [todayStr, setTodayStr] = useState(getTodayStr());

  useEffect(() => {
    const timer = setInterval(() => {
      setTodayStr(getTodayStr());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const todayDate = new Date(todayStr);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(todayStr);

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

  const hasActivity = d => activities.some(a => a.date === d);
  const hasMeal = d => meals.some(m => m.date === d);

  const getDayClass = d => {
    if (hasActivity(d) && hasMeal(d)) return 'both';
    if (hasActivity(d)) return 'activity';
    if (hasMeal(d)) return 'meal';
    return '';
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="page-container">
      <h1>📅 Lịch Hoạt Động & Dinh Dưỡng</h1>

      <div className="calendar-nav">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>◀</button>
        <span>{currentMonth.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>▶</button>
      </div>

      <div className="calendar-card">
        <div className="calendar-grid">
          {['CN','T2','T3','T4','T5','T6','T7'].map(d => (
            <div key={d} className="calendar-header-cell">{d}</div>
          ))}

          {days.map((day, i) => {
            if (!day) return <div key={i} className="calendar-cell empty" />;

            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

            return (
              <div
                key={i}
                className={`calendar-cell ${getDayClass(dateStr)} ${dateStr === selectedDate ? 'selected' : ''}`}
                onClick={() => setSelectedDate(dateStr)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="day-summary-card">
        <h3>📊 Ngày {selectedDate}</h3>

        <div className="summary-grid">
          <div className="summary-box in">+{kcalIn} kcal</div>
          <div className="summary-box balance">{kcalIn - kcalOut} kcal</div>
          <div className="summary-box out">-{kcalOut} kcal</div>
        </div>

        {/* ⭐ NÚT ĐIỀU HƯỚNG */}
        <div style={{ display:'flex', gap:10, marginTop:15 }}>
          <button onClick={() => navigate(`/activities?date=${selectedDate}`)}>
            ✏️ Sửa hoạt động
          </button>
          <button onClick={() => navigate(`/nutrition?date=${selectedDate}`)}>
            🍽️ Sửa dinh dưỡng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

