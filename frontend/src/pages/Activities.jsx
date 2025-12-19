// src/pages/Activities.jsx
import React, { useState } from 'react';
import './Activities.css';

const Activities = ({ activities, setActivities }) => {
  const today = new Date().toISOString().split('T')[0];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    kcal: ''
  });
  const [editingId, setEditingId] = useState(null);

  // 🔹 Chỉ lấy hoạt động của hôm nay
  const todayActivities = activities.filter(
    item => item.date === today
  );

  // 🔹 Tổng kcal OUT hôm nay
  const totalBurned = todayActivities.reduce(
    (sum, item) => sum + Number(item.kcal || 0),
    0
  );

  // =========================
  // HANDLERS
  // =========================
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
      // ✏️ Sửa
      setActivities(
        activities.map(item =>
          item.id === editingId
            ? { ...item, ...formData }
            : item
        )
      );
    } else {
      // ➕ Thêm (chỉ hôm nay)
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
    if (window.confirm('Xóa hoạt động này?')) {
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
                <span className="kcal-badge-top">
                  🔥 {item.kcal} kcal
                </span>
              </div>
              <p>🕒 {item.startTime} - {item.endTime}</p>
            </div>

            {/* Chỉ hôm nay mới được sửa/xóa */}
            <div className="act-actions">
              <button
                className="btn-icon edit"
                onClick={() => handleOpenEdit(item)}
              >
                ✎
              </button>
              <button
                className="btn-icon delete"
                onClick={() => handleDelete(item.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {todayActivities.length === 0 && (
          <p style={{ textAlign: 'center' }}>
            Hôm nay chưa có hoạt động nào.
          </p>
        )}
      </div>

      <button className="fab-btn" onClick={handleOpenAdd}>+</button>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Chỉnh Sửa' : 'Thêm Hoạt Động'}</h3>
              <button
                className="close-btn"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên hoạt động</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Calo (kcal)</label>
                <input
                  type="number"
                  name="kcal"
                  value={formData.kcal}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button className="btn-save-modal">
                Lưu Lại
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
