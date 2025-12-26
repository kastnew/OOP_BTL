// src/pages/Activities.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT FILE CẤU HÌNH CHUNG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import CalendarPicker from '../components/CalendarPicker'; // (Từ code đồng nghiệp)
import './Activities.css';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [totalBurned, setTotalBurned] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // MỚI: State điều khiển Modal Lịch (Từ code đồng nghiệp)
  const [showCalendar, setShowCalendar] = useState(false);

  // Cấu hình URL
  const ACTIVITIES_API_URL = `${API_BASE_URL}/DailyActivity`; 

  // --- 1. LẤY NGÀY ĐANG CHỌN ---
  const currentSelectedDate = localStorage.getItem('APP_SELECTED_DATE') || new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({ 
    date: currentSelectedDate, 
    activityName: '', 
    startTime: '', 
    endTime: '',   
    caloriesBurned: '' 
  });

  // --- HÀM XỬ LÝ THỜI GIAN (GIỮ CỦA BẠN - ĐỂ KHỚP BACKEND) ---
  
  // 1. Chuyển chuỗi từ Backend (2025-12-27T08:30:00) thành giờ hiển thị input (08:30)
  const extractTime = (isoString) => {
    if (!isoString) return '';
    try {
        const timePart = isoString.split('T')[1]; 
        return timePart.substring(0, 5); // Lấy HH:mm
    } catch (e) {
        return '';
    }
  };

  // 2. Gộp Ngày + Giờ để gửi lên Backend (Tạo format LocalDateTime chuẩn: YYYY-MM-DDTHH:mm:ss)
  const combineDateTimeLocal = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    return `${dateStr}T${timeStr}:00`; 
  };

  // --- LOGIC GỌI API ---
  const fetchActivities = () => {
    fetch(`${ACTIVITIES_API_URL}/${CURRENT_USER_ID}`)
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error("Lỗi tải dữ liệu:", err));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // --- MỚI: XỬ LÝ KHI CHỌN NGÀY TỪ LỊCH MODAL (Từ code đồng nghiệp) ---
  const handleDateChange = (newDate) => {
    localStorage.setItem('APP_SELECTED_DATE', newDate);
    // Cập nhật lại ngày mặc định trong form để khớp với ngày vừa chọn
    setFormData(prev => ({ ...prev, date: newDate }));
    // Đồng bộ lại dữ liệu (Fetch lại API)
    // Lưu ý: React state update là bất đồng bộ, nên tốt nhất gọi fetchActivities 
    // trong useEffect lắng nghe currentSelectedDate, hoặc gọi thủ công ở đây nhưng cần cẩn thận.
    // Cách tốt nhất là reload trang hoặc trigger useEffect phụ thuộc vào currentSelectedDate (nhưng ở đây ta reload nhẹ).
    window.location.reload(); // Cách đơn giản nhất để refresh toàn bộ state theo ngày mới
  };

  // --- 2. LỌC DỮ LIỆU ---
  const filteredActivities = activities.filter(item => item.date === currentSelectedDate);

  // --- 3. TÍNH TỔNG CALO ---
  useEffect(() => {
    const total = filteredActivities.reduce((sum, item) => sum + Number(item.caloriesBurned || 0), 0);
    setTotalBurned(total);
  }, [activities, currentSelectedDate]);

  // --- XỬ LÝ FORM ---

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ 
      date: currentSelectedDate, 
      activityName: '', 
      startTime: '', 
      endTime: '', 
      caloriesBurned: '' 
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.activityId);
    setFormData({
      date: item.date, 
      activityName: item.activityName, 
      startTime: extractTime(item.startTime), 
      endTime: extractTime(item.endTime),
      caloriesBurned: item.caloriesBurned 
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

    // Dùng logic của BẠN (combineDateTimeLocal) để khớp Backend
    const payload = {
        userId: CURRENT_USER_ID,
        activityName: formData.activityName,
        caloriesBurned: parseFloat(formData.caloriesBurned),
        date: formData.date,
        startTime: combineDateTimeLocal(formData.date, formData.startTime),
        endTime: combineDateTimeLocal(formData.date, formData.endTime)
    };

    if (editingId) {
      // SỬA (PATCH)
      const updatePayload = { ...payload, activityId: editingId };
      fetch(`${ACTIVITIES_API_URL}/up`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      }).then(res => {
        if (res.ok) { fetchActivities(); handleCloseModal(); }
        else console.error("Lỗi update");
      });

    } else {
      // THÊM MỚI (POST)
      fetch(`${ACTIVITIES_API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(res => {
        if (res.ok) { fetchActivities(); handleCloseModal(); }
        else console.error("Lỗi tạo mới");
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Xóa hoạt động này?")) {
      fetch(`${ACTIVITIES_API_URL}/delete/${id}`, { method: 'GET' })
      .then(res => {
        if (res.ok) fetchActivities();
        else console.error("Lỗi xóa");
      });
    }
  };

  return (
    <div className="page-container">
      {/* 🟢 PHẦN TIÊU ĐỀ TÍCH HỢP MỞ LỊCH (Từ code đồng nghiệp) */}
      <div 
        className="activities-header-top" 
        onClick={() => setShowCalendar(true)}
        style={{cursor: 'pointer'}}
        title="Bấm để đổi ngày"
      >
        <h1>🏃 Hoạt Động ({currentSelectedDate}) 📅</h1>
        <div className="total-burned-box">
          <span>Đã tiêu hao:</span>
          <strong>-{totalBurned} kcal</strong>
        </div>
      </div>

      {/* 🟢 HIỂN THỊ MODAL LỊCH (Từ code đồng nghiệp) */}
      {showCalendar && (
        <CalendarPicker 
          onDateSelect={handleDateChange} 
          onClose={() => setShowCalendar(false)} 
        />
      )}

      <div className="activity-list">
        {filteredActivities.map((item) => (
          <div key={item.activityId} className="activity-card">
            <div className="act-info">
              <div className="act-header-row">
                <h3>{item.activityName}</h3>
                <span className="kcal-badge-top">🔥 {item.caloriesBurned} kcal</span>
              </div>
              <p style={{fontSize: '0.9rem', color: '#666', margin: '4px 0'}}>
                📅 Ngày: <strong>{item.date}</strong>
              </p>
              <p>🕒 Thời gian: {extractTime(item.startTime)} - {extractTime(item.endTime)}</p>
            </div>
            
            <div className="act-actions">
              <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
              <button className="btn-icon delete" onClick={() => handleDelete(item.activityId)}>🗑️</button>
            </div>
          </div>
        ))}
        
        {filteredActivities.length === 0 && (
            <p style={{textAlign: 'center', color: '#888', marginTop: '20px'}}>
                Không có hoạt động nào trong ngày {currentSelectedDate}.
            </p>
        )}
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
                <label>Ngày thực hiện</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Tên hoạt động</label>
                <input type="text" name="activityName" value={formData.activityName} onChange={handleInputChange} required />
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
                <input type="number" name="caloriesBurned" value={formData.caloriesBurned} onChange={handleInputChange} required />
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