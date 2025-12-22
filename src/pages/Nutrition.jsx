// src/pages/Nutrition.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT FILE CẤU HÌNH CHUNG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import './Nutrition.css';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  // State điều khiển Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // --- CẤU HÌNH KẾT NỐI (Đã sửa để dùng biến chung) ---
  // const CURRENT_USER_ID = 1; // <-- Đã import ở trên
  const MEAL_API_URL = `${API_BASE_URL}/Meal`; 

  // --- 1. LẤY NGÀY ĐANG CHỌN TỪ CALENDAR ---
  const currentSelectedDate = localStorage.getItem('APP_SELECTED_DATE') || new Date().toISOString().split('T')[0];

  // State Form nhập liệu
  const [formData, setFormData] = useState({
    date: currentSelectedDate, 
    dishName: '',
    mealType: 'Bữa sáng',
    calories: '',
    protein: '',
    fat: '',
    fiber: '',
    sugar: ''
  });

  // --- 2. LOAD DỮ LIỆU TỪ API ---
  const fetchMeals = () => {
    fetch(`${MEAL_API_URL}/${CURRENT_USER_ID}`)
      .then(res => res.json())
      .then(data => setMeals(data)) 
      .catch(err => console.error("Lỗi tải dữ liệu:", err));
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // --- 3. LỌC DỮ LIỆU THEO NGÀY ĐANG CHỌN ---
  const filteredMeals = meals.filter(item => item.date === currentSelectedDate);

  // --- 4. TÍNH TỔNG CALO ---
  useEffect(() => {
    const total = filteredMeals.reduce((sum, item) => sum + Number(item.calories || 0), 0);
    setTotalCalories(total);
  }, [meals, currentSelectedDate]); 

  // --- CÁC HÀM ĐIỀU KHIỂN ---

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ 
      date: currentSelectedDate, 
      dishName: '', 
      mealType: 'Bữa sáng', 
      calories: '', 
      protein: '', 
      fat: '', 
      fiber: '',
      sugar: '' 
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.mealId);
    setFormData({
      date: item.date,
      dishName: item.dishName,
      mealType: item.mealType,
      calories: item.calories,
      protein: item.protein,
      fat: item.fat,
      fiber: item.fiber,
      sugar: item.sugar
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- GỬI DỮ LIỆU ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
        userId: CURRENT_USER_ID,
        date: formData.date,
        dishName: formData.dishName,
        mealType: formData.mealType,
        calories: parseFloat(formData.calories || 0),
        protein: parseFloat(formData.protein || 0),
        fat: parseFloat(formData.fat || 0),
        fiber: parseFloat(formData.fiber || 0),
        sugar: parseFloat(formData.sugar || 0)
    };

    if (editingId) {
      // SỬA
      const updatePayload = { ...payload, mealId: editingId };
      fetch(`${MEAL_API_URL}/up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      }).then(res => {
        if (res.ok) { fetchMeals(); handleCloseModal(); }
        else alert("Lỗi cập nhật!");
      });

    } else {
      // THÊM MỚI
      fetch(`${MEAL_API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(res => {
        if (res.ok) { fetchMeals(); handleCloseModal(); }
        else alert("Lỗi thêm mới!");
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn muốn xóa món này khỏi thực đơn?")) {
      fetch(`${MEAL_API_URL}/delete/${id}`, {
        method: 'GET'
      }).then(res => {
        if (res.ok) fetchMeals();
        else alert("Lỗi khi xóa!");
      });
    }
  };

  return (
    <div className="page-container">
      <div className="nutrition-header-top">
        <h1>🥗 Dinh Dưỡng ({currentSelectedDate})</h1>
        <div className="total-box">
          <span>Đã nạp:</span>
          <strong>{totalCalories} kcal</strong>
        </div>
      </div>

      <div className="meal-list">
        {filteredMeals.map((item) => (
          <div key={item.mealId} className="meal-card">
            <div className="meal-info">
              <div className="meal-title-row">
                <h3>{item.dishName}</h3>
                <span className={`meal-tag ${item.mealType === 'Bữa sáng' ? 'tag-morning' : 'tag-default'}`}>
                  {item.mealType}
                </span>
              </div>
              
              <div style={{fontSize:'0.85rem', color:'#666', marginBottom:'5px'}}>
                 📅 Ngày: <strong>{item.date}</strong>
              </div>

              <div className="meal-details">
                <span>🥩 Đạm: {item.protein}g</span>
                <span>💧 Béo: {item.fat}g</span>
                {item.fiber > 0 && <span>🌾 Xơ: {item.fiber}g</span>}
                <span>🍬 Đường: {item.sugar}g</span>
              </div>
            </div>
            
            <div className="meal-right">
              <span className="calo-badge">⚡ {item.calories} kcal</span>
              <div className="action-buttons">
                <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
                <button className="btn-icon delete" onClick={() => handleDelete(item.mealId)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredMeals.length === 0 && (
            <p style={{textAlign: 'center', color: '#888', marginTop: '20px'}}>
                Chưa có món ăn nào trong ngày {currentSelectedDate}.
            </p>
        )}
      </div>

      <button className="fab-btn fab-green" onClick={handleOpenAdd}>+</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Sửa Món Ăn' : 'Thêm Món Mới'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Ngày ăn</label>
                <input 
                  type="date" name="date" 
                  value={formData.date} onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Tên món ăn</label>
                <input 
                  type="text" name="dishName" 
                  value={formData.dishName} onChange={handleInputChange} 
                  placeholder="Ví dụ: Phở bò" required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Loại bữa</label>
                  <select name="mealType" value={formData.mealType} onChange={handleInputChange}>
                    <option>Bữa sáng</option>
                    <option>Bữa trưa</option>
                    <option>Bữa tối</option>
                    <option>Bữa phụ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Calo (kcal)</label>
                  <input type="number" name="calories" value={formData.calories} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Đạm (g)</label>
                  <input type="number" name="protein" value={formData.protein} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Béo (g)</label>
                  <input type="number" name="fat" value={formData.fat} onChange={handleInputChange} />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Chất xơ (g)</label>
                  <input type="number" name="fiber" value={formData.fiber} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                   <label>Đường (g)</label>
                   <input type="number" name="sugar" value={formData.sugar} onChange={handleInputChange} />
                </div>
              </div>

              <button type="submit" className="btn-save-modal btn-green">Lưu Thực Đơn</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;