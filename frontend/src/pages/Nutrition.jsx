// src/pages/Nutrition.jsx
import React, { useState, useEffect } from 'react';
import { MOCK_MEALS } from '../services/mockData';
import './Nutrition.css';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  // State điều khiển Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // State Form nhập liệu
  const [formData, setFormData] = useState({
    dishName: '',
    type: 'Bữa sáng',
    calories: '',
    protein: '',
    fat: '',
    sugar: ''
  });

  // Load dữ liệu và tính tổng calo
  useEffect(() => {
    setMeals(MOCK_MEALS);
  }, []);

  useEffect(() => {
    // Tự động tính tổng calo mỗi khi danh sách món ăn thay đổi
    const total = meals.reduce((sum, item) => sum + Number(item.calories || 0), 0);
    setTotalCalories(total);
  }, [meals]);

  // --- CÁC HÀM ĐIỀU KHIỂN ---

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ dishName: '', type: 'Bữa sáng', calories: '', protein: '', fat: '', sugar: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      dishName: item.dishName,
      type: item.type,
      calories: item.calories,
      protein: item.protein,
      fat: item.fat,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // SỬA
      const updatedList = meals.map((item) => 
        item.id === editingId ? { ...item, ...formData } : item
      );
      setMeals(updatedList);
    } else {
      // THÊM MỚI
      const newItem = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      setMeals([...meals, newItem]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn muốn xóa món này khỏi thực đơn?")) {
      setMeals(meals.filter(item => item.id !== id));
    }
  };

  return (
    <div className="page-container">
      <div className="nutrition-header-top">
        <h1>🥗 Nhật Ký Dinh Dưỡng</h1>
        <div className="total-box">
          <span>Đã nạp:</span>
          <strong>{totalCalories} kcal</strong>
        </div>
      </div>

      {/* DANH SÁCH MÓN ĂN */}
      <div className="meal-list">
        {meals.map((item) => (
          <div key={item.id} className="meal-card">
            <div className="meal-info">
              <div className="meal-title-row">
                <h3>{item.dishName}</h3>
                <span className={`meal-tag ${item.type === 'Bữa sáng' ? 'tag-morning' : 'tag-default'}`}>
                  {item.type}
                </span>
              </div>
              <div className="meal-details">
                <span>🥩 Đạm: {item.protein}g</span>
                <span>💧 Béo: {item.fat}g</span>
                <span>🍬 Đường: {item.sugar}g</span>
              </div>
            </div>
            
            <div className="meal-right">
              <span className="calo-badge">⚡ {item.calories} kcal</span>
              <div className="action-buttons">
                <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
                <button className="btn-icon delete" onClick={() => handleDelete(item.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        {meals.length === 0 && <p style={{textAlign: 'center'}}>Chưa có món ăn nào.</p>}
      </div>

      {/* NÚT TRÒN (FAB) */}
      <button className="fab-btn fab-green" onClick={handleOpenAdd}>+</button>

      {/* MODAL NHẬP LIỆU */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Sửa Món Ăn' : 'Thêm Món Mới'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
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
                  <select name="type" value={formData.type} onChange={handleInputChange}>
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

              {/* Nhập chi tiết dinh dưỡng */}
              <div className="form-row">
                <div className="form-group">
                  <label>Đạm (g)</label>
                  <input type="number" name="protein" value={formData.protein} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Béo (g)</label>
                  <input type="number" name="fat" value={formData.fat} onChange={handleInputChange} />
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