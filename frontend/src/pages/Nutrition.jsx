import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Nutrition.css';

const Nutrition = ({ meals, setMeals }) => {
  const [params] = useSearchParams();
  const selectedDate = params.get('date') || new Date().toISOString().split('T')[0];

  const mealsDay = meals.filter(m => m.date === selectedDate);

  return (
    <div className="page-container">
      <h1>🥗 Dinh dưỡng ngày {selectedDate}</h1>
      {/* UI giữ nguyên, chỉ đổi mealsToday → mealsDay */}
    </div>
  );
};

export default Nutrition;
