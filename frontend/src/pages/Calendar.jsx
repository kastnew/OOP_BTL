import React, { useState } from 'react';
import { MOCK_ACTIVITIES, MOCK_MEALS } from '../services/mockData';
import './Calendar.css';

const Calendar = () => {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0–11
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = CN

  // ====== B: LỌC DỮ LIỆU THEO NGÀY ======
  const activitiesOfDay = selectedDate
    ? MOCK_ACTIVITIES.filter(a => a.date === selectedDate)
    : [];

  const mealsOfDay = selectedDate
    ? MOCK_MEALS.filter(m => m.date === selectedDate)
    : [];

  const totalOut = activitiesOfDay.reduce(
    (sum, a) => sum + Number(a.kcal || 0), 0
  );

  const totalIn = mealsOfDay.reduce(
    (sum, m) => sum + Number(m.calories || 0), 0
  );

  // ====== ĐIỀU HƯỚNG THÁNG ======
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
    setSelectedDate(null);
  };

  // ====== RENDER NGÀY ======
  const renderDays = () => {
    const cells = [];

    // Ô trống đầu tháng
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      cells.push(
        <div
          key={day}
          className={`calendar-day ${selectedDate === fullDate ? 'selected' : ''}`}
          onClick={() => setSelectedDate(fullDate)}
        >
          {day}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="page-container">
      <h1>📅 Lịch Hoạt Động & Dinh Dưỡng</h1>

      {/* HEADER THÁNG */}
      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h2>
          {month + 1}/{year}
        </h2>
        <button onClick={nextMonth}>▶</button>
      </div>

      {/* THỨ */}
      <div className="calendar-weekdays">
        <div>CN</div><div>T2</div><div>T3</div>
        <div>T4</div><div>T5</div><div>T6</div><div>T7</div>
      </div>

      {/* LỊCH */}
      <div className="calendar-grid">
        {renderDays()}
      </div>

      {/* ====== B: THỐNG KÊ NGÀY ====== */}
      {selectedDate && (
        <div className="day-summary">
          <h3>📊 Ngày {selectedDate}</h3>
          <p>🔥 Kcal tiêu hao: <strong>{totalOut}</strong></p>
          <p>🍽️ Kcal nạp: <strong>{totalIn}</strong></p>
          <p>⚖️ Chênh lệch: <strong>{totalIn - totalOut}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Calendar;

