import React, { useState, useEffect } from 'react';
import { MOCK_MEALS } from '../services/mockData';
import './Nutrition.css';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    setMeals(MOCK_MEALS);
    // Tính tổng calo đơn giản bằng hàm reduce
    const total = MOCK_MEALS.reduce((sum, item) => sum + item.calories, 0);
    setTotalCalories(total);
  }, []);

  return (
    <div className="page-container">
      <div className="nutrition-header">
        <h1>Quản Lý Dinh Dưỡng 🥗</h1>
        <div className="total-box">
          <span>Tổng nạp hôm nay:</span>
          <span className="big-number">{totalCalories} kcal</span>
        </div>
      </div>

      <div className="meal-grid">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <div className="meal-header">
              <h3>{meal.dishName}</h3>
              <span className={`tag ${meal.type === 'Bữa sáng' ? 'morning' : 'meal-tag'}`}>
                {meal.type}
              </span>
            </div>
            <div className="nutrient-info">
              <p>🔥 {meal.calories} kcal</p>
              <p>🥩 Đạm: {meal.protein}g</p>
              <p>💧 Mỡ: {meal.fat}g</p>
              <p>🍬 Đường: {meal.sugar}g</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nutrition;