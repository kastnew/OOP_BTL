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

  // ======================
  // B – TÍNH KCal TRONG NGÀY
  // ======================
  const dayActivities = useMemo(
    () => activities.filter(a => a.date === selectedDate),
    [activities, selectedDate]
  );

  const dayMeals = useMemo(
    () => meals.filter(m => m.date === selectedDate),
    [meals, selectedDate]
  );

  const kcalOut = dayActivities.reduce(
    (sum, a) => sum + Number(a.kcal || 0),
    0
  );

  const kcalIn = dayMeals.reduce(
    (sum, m) => sum + Number(m.calories || 0),
    0
  );

  // ======================
  // C – KIỂM TRA NGÀY CÓ DỮ LIỆU
  // ======================
  const hasActivity = (dateStr) =>
    activities.some(a => a.date === dateStr);

  const hasMeal = (dateStr) =>
    meals.some(m => m.date === dateStr);

  const getDayClass = (dateStr) => {
    const a = hasActivity(dateStr);
    const m = hasMeal(dateStr);

    if (a && m) return 'day-both';
    if (a) return 'day-activity';
    if (m) return 'day-meal';
    return '';
  };

  // ======================
  // LỊCH THÁNG
  // ======================
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  // ô trống đầu tháng
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // các ngày trong tháng
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="page-container">
      <h1>📅 Lịch Hoạt Động & Dinh Dưỡng</h1>

      {/* ===== HEADER THÁNG ===== */}
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>◀</button>
        <h2>
          {currentMonth.toLocaleString('vi-VN', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <button onClick={handleNextMonth}>▶</button>
      </div>

      {/* ===== LƯỚI LỊCH ===== */}
      <div className="calendar-grid">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
          <div key={d} className="calendar-day header">
            {d}
          </div>
        ))}

        {days.map((day, idx) => {
          if (!day)
            return <div key={idx} className="calendar-day empty" />;

          const dateStr = `${year}-${String(month + 1).padStart(
            2,
            '0'
          )}-${String(day).padStart(2, '0')}`;

          const isSelected = dateStr === selectedDate;

          return (
            <div
              key={idx}
              className={`calendar-day 
                ${getDayClass(dateStr)} 
                ${isSelected ? 'selected' : ''}
              `}
              onClick={() => setSelectedDate(dateStr)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* ===== THỐNG KÊ NGÀY ===== */}
      <div className="day-summary">
        <h3>📊 Ngày {selectedDate}</h3>
        <p>🔥 Kcal tiêu hao: <strong>{kcalOut}</strong></p>
        <p>🍽️ Kcal nạp vào: <strong>{kcalIn}</strong></p>
        <p>
          ⚖️ Cân bằng:{' '}
          <strong>{kcalIn - kcalOut} kcal</strong>
        </p>
      </div>
    </div>
  );
};

export default Calendar;
