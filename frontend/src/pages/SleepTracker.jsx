// src/pages/SleepTracker.jsx
import React, { useState, useEffect } from 'react';
import { MOCK_SLEEP } from '../services/mockData';
import './SleepTracker.css';

const SleepTracker = () => {
  const [sleepData, setSleepData] = useState([]);

  // State điều khiển Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // State Form nhập liệu
  const [formData, setFormData] = useState({
    sleepType: 'Giấc đêm',
    sleepTime: '',
    wakeTime: '',
    quality: 'Tốt'
  });

  // Load dữ liệu
  useEffect(() => {
    setSleepData(MOCK_SLEEP);
  }, []);

  // --- CÁC HÀM ĐIỀU KHIỂN ---

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ sleepType: 'Giấc đêm', sleepTime: '', wakeTime: '', quality: 'Tốt' });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    // Lưu ý: Dữ liệu mock cần đúng chuẩn ISO để hiển thị lên input datetime-local
    // Ở đây mình gán trực tiếp, thực tế có thể cần format lại chuỗi ngày tháng
    setFormData({
      sleepType: item.type, // Lưu ý: trong mockData mình đặt tên là 'type'
      sleepTime: item.sleepTime, // Cần format yyyy-MM-ddThh:mm
      wakeTime: item.wakeTime,
      quality: item.quality
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
      const updatedList = sleepData.map((item) => 
        item.id === editingId ? { 
            ...item, 
            type: formData.sleepType, // Map lại tên trường cho khớp mockData
            sleepTime: formData.sleepTime,
            wakeTime: formData.wakeTime,
            quality: formData.quality
        } : item
      );
      setSleepData(updatedList);
    } else {
      // THÊM MỚI
      const newItem = {
        id: Date.now(),
        type: formData.sleepType,
        sleepTime: formData.sleepTime,
        wakeTime: formData.wakeTime,
        quality: formData.quality
      };
      setSleepData([...sleepData, newItem]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Xóa bản ghi giấc ngủ này?")) {
      setSleepData(sleepData.filter(item => item.id !== id));
    }
  };

  // Hàm nhỏ để hiển thị ngày giờ cho đẹp
  const formatDisplayTime = (dateTimeString) => {
    if (!dateTimeString) return "---";
    // Nếu là dạng ISO (2024-04-01T22:30), chuyển thành 22:30 01/04
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return dateTimeString; // Trả về nguyên gốc nếu không parse được
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="page-container">
      <h1>🌙 Theo Dõi Giấc Ngủ</h1>

      {/* DANH SÁCH GIẤC NGỦ */}
      <div className="sleep-list">
        {sleepData.map((item) => (
          <div key={item.id} className="sleep-card">
            <div className="sleep-icon">😴</div>
            <div className="sleep-info">
              <h3>{item.type}</h3>
              <p>🛏️ Ngủ: <strong>{formatDisplayTime(item.sleepTime)}</strong></p>
              <p>⏰ Dậy: <strong>{formatDisplayTime(item.wakeTime)}</strong></p>
            </div>
            
            <div className="sleep-right">
              <span className={`quality-badge ${item.quality === 'Tốt' ? 'q-good' : item.quality === 'Kém' ? 'q-bad' : 'q-avg'}`}>
                {item.quality}
              </span>
              <div className="action-buttons">
                <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
                <button className="btn-icon delete" onClick={() => handleDelete(item.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        {sleepData.length === 0 && <p style={{textAlign: 'center'}}>Chưa có dữ liệu giấc ngủ.</p>}
      </div>

      {/* NÚT TRÒN (FAB) MÀU TÍM */}
      <button className="fab-btn fab-purple" onClick={handleOpenAdd}>+</button>

      {/* MODAL NHẬP LIỆU */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Sửa Giấc Ngủ' : 'Thêm Giấc Ngủ Mới'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Loại giấc ngủ</label>
                <select name="sleepType" value={formData.sleepType} onChange={handleInputChange}>
                  <option>Giấc đêm</option>
                  <option>Giấc trưa</option>
                  <option>Chợp mắt</option>
                </select>
              </div>

              <div className="form-group">
                <label>Thời gian đi ngủ</label>
                <input 
                    type="datetime-local" 
                    name="sleepTime" 
                    value={formData.sleepTime} 
                    onChange={handleInputChange} 
                    required 
                />
              </div>

              <div className="form-group">
                <label>Thời gian thức dậy</label>
                <input 
                    type="datetime-local" 
                    name="wakeTime" 
                    value={formData.wakeTime} 
                    onChange={handleInputChange} 
                    required 
                />
              </div>

              <div className="form-group">
                <label>Chất lượng</label>
                <select name="quality" value={formData.quality} onChange={handleInputChange}>
                  <option>Rất tốt</option>
                  <option>Tốt</option>
                  <option>Trung bình</option>
                  <option>Kém</option>
                </select>
              </div>

              <button type="submit" className="btn-save-modal btn-purple">Lưu Giấc Ngủ</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepTracker;