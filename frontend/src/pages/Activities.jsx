// src/pages/Activities.jsx
import React, { useState, useEffect } from 'react';
import { MOCK_ACTIVITIES } from '../services/mockData';
import './Activities.css';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  
  // 1. Thêm state lưu tổng calo tiêu hao
  const [totalBurned, setTotalBurned] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', startTime: '', endTime: '', kcal: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setActivities(MOCK_ACTIVITIES);
  }, []);

  // 2. Tự động tính tổng calo mỗi khi danh sách thay đổi
  useEffect(() => {
    const total = activities.reduce((sum, item) => sum + Number(item.kcal || 0), 0);
    setTotalBurned(total);
  }, [activities]);

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
      const updatedList = activities.map((item) => 
        item.id === editingId ? { ...item, ...formData } : item
      );
      setActivities(updatedList);
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      setActivities([...activities, newItem]);
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
      {/* HEADER: Tiêu đề + Tổng Calo */}
      <div className="activities-header-top">
        <h1>🏃 Nhật Ký Hoạt Động</h1>
        <div className="total-burned-box">
          <span>Đã tiêu hao:</span>
          <strong>-{totalBurned} kcal</strong>
        </div>
      </div>

      {/* DANH SÁCH HOẠT ĐỘNG */}
      <div className="activity-list">
        {activities.map((item) => (
          <div key={item.id} className="activity-card">
            
            {/* Phần thông tin bên trái */}
            <div className="act-info">
              <div className="act-header-row">
                <h3>{item.name}</h3>
                {/* Số calo hiển thị ngay cạnh tên hoặc góc phải */}
                <span className="kcal-badge-top">🔥 {item.kcal} kcal</span>
              </div>
              <p>🕒 Thời gian: {item.startTime} - {item.endTime}</p>
            </div>
            
            {/* Phần nút bấm bên phải */}
            <div className="act-actions">
              <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
              <button className="btn-icon delete" onClick={() => handleDelete(item.id)}>🗑️</button>
            </div>

          </div>
        ))}
      </div>

      <button className="fab-btn" onClick={handleOpenAdd}>+</button>

      {/* MODAL */}
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
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bắt đầu</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Kết thúc</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Calo tiêu thụ (kcal)</label>
                <input type="number" name="kcal" value={formData.kcal} onChange={handleInputChange} required />
              </div>
              <button type="submit" className="btn-save-modal">Lưu Lại</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;