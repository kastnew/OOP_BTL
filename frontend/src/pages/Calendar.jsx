import React, { useState } from 'react';
import { MOCK_ACTIVITIES, MOCK_MEALS } from '../services/mockData';
import './Calendar.css';

const Calendar = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split('T')[0]
  );

  const year = today.getFullYear();
  const month = today.getMonth(); // 0–11

  // 👉 SỐ NGÀY TRONG THÁNG
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 👉 LỌC DỮ LIỆU THEO NGÀY
  const activitiesOfDay = MOCK_ACTIVITIES.filter(
    a => a.date === selectedDate
  );
  const mealsOfDay = MOCK_MEALS.filter(
    m => m.date === selectedDate
  );

  const kcalOut = activitiesOfDay.reduce(
    (sum, a) => sum + Number(a.kcal || 0), 0
  );

  const kcalIn = mealsOfDay.reduce(
    (sum, m) => sum + Number(m.calories || 0), 0
  );

  return (
    <div className="calendar-page">
      <h1>📅 Lịch Hoạt Động & Dinh Dưỡng</h1>

      {/* ==== LỊCH ==== */}
      <div className="calendar-grid">
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

          return (
            <div
              key={day}
              className={`calendar-cell ${dateStr === selectedDate ? 'active' : ''}`}
              onClick={() => setSelectedDate(dateStr)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* ==== THỐNG KÊ NGÀY ==== */}
      <div className="day-summary">
        <h2>📌 Ngày {selectedDate}</h2>
        <p>🔥 Kcal tiêu hao: <strong>{kcalOut}</strong></p>
        <p>🍽 Kcal nạp vào: <strong>{kcalIn}</strong></p>
      </div>

      {/* ==== CHI TIẾT ==== */}
      <div className="day-details">
        <div>
          <h3>🏃 Hoạt động</h3>
          {activitiesOfDay.map(a => (
            <div key={a.id} className="detail-item">
              {a.name} – {a.kcal} kcal
            </div>
          ))}
          {activitiesOfDay.length === 0 && <p>Không có hoạt động</p>}
        </div>

        <div>
          <h3>🥗 Dinh dưỡng</h3>
          {mealsOfDay.map(m => (
            <div key={m.id} className="detail-item">
              {m.dishName} – {m.calories} kcal
            </div>
          ))}
          {mealsOfDay.length === 0 && <p>Không có món ăn</p>}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

