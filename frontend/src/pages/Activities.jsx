// src/pages/Activities.jsx
import React, { useState, useEffect } from 'react';
import { MOCK_ACTIVITIES } from '../services/mockData';
import './Activities.css';

const Activities = () => {
  const today = new Date().toISOString().split('T')[0];

  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', startTime: '', endTime: '', kcal: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setActivities(MOCK_ACTIVITIES);
  }, []);

  // 🔹 Chỉ lấy hoạt động của hôm nay
  const todayActivities = activities.filter(
    item => item.date === today
  );

  // 🔹 Tổng kcal OUT của hôm nay
  const totalBurned = todayActivities.reduce(
    (sum, item) => sum + Number(item.kcal || 0),
    0
  );

  // --- CÁC HÀM ĐIỀU KHIỂN ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', startTime: '', endTime: '', kcal: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      startTime: item.startTime,
      endTime: item.endTime,
      kcal: item.kcal
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setActivities(
        activities.map(item =>
          item.id === editingId ? { ...item, ...formData } : item
        )
      );
    } else {
      setActivities([
        ...activities,
        {
          id: Date.now(),
          ...formData,
          date: today
        }
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Xóa hoạt động này?")) {
      setActivities(activities.filter(item => item.id !== id));
    }
  };

  return (
    <div className="page-container">
      <div className="activities-header-top">
        <h1>🏃 Nhật Ký Hoạt Động</h1>
        <div className="total-burned-box">
          <span>Đã tiêu hao:</span>
          <strong>-{totalBurned} kcal</strong>
        </div>
      </div>

      <div className="activity-list">
        {todayActivities.map((item) => (
          <div key={item.id} className="activity-card">
            <div className="act-info">
              <div className="act-header-row">
                <h3>{item.name}</h3>
                <span className="kcal-badge-top">🔥 {item.kcal} kcal</span>
              </div>
              <p>🕒 {item.startTime} - {item.endTime}</p>
            </div>

            {item.date === today && (
              <div className="act-actions">
                <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
                <button className="btn-icon delete" onClick={() => handleDelete(item.id)}>🗑️</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="fab-btn" onClick={handleOpenAdd}>+</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Chỉnh Sửa' : 'Thêm Hoạt Động'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên hoạt động</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required />
                <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Calo (kcal)</label>
                <input type="number" name="kcal" value={formData.kcal} onChange={handleInputChange} required />
              </div>
              <button className="btn-save-modal">Lưu Lại</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
