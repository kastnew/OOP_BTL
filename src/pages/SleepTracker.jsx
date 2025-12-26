// src/pages/SleepTracker.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT FILE CẤU HÌNH CHUNG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import CalendarPicker from '../components/CalendarPicker'; // (Từ code đồng nghiệp)
import './SleepTracker.css';

const SleepTracker = () => {
  const [sleepData, setSleepData] = useState([]);

  // State điều khiển Modal thêm/sửa
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // MỚI: State điều khiển Modal Lịch (Từ code đồng nghiệp)
  const [showCalendar, setShowCalendar] = useState(false);

  // --- CẤU HÌNH KẾT NỐI ---
  const SLEEP_API_URL = `${API_BASE_URL}/Sleep`;

  // --- 1. LẤY NGÀY ĐANG CHỌN TỪ LOCALSTORAGE ---
  const currentSelectedDate = localStorage.getItem('APP_SELECTED_DATE') || new Date().toISOString().split('T')[0];

  // State Form nhập liệu
  const [formData, setFormData] = useState({
    sleepDate: currentSelectedDate, 
    sleepType: 'Giấc đêm',
    sleepTime: '', 
    wakeTime: '',  
    sleepQuality: 'Tốt'
  });

  // --- HÀM HỖ TRỢ CHUYỂN ĐỔI THỜI GIAN (GIỮ CỦA BẠN - ĐỂ KHỚP BACKEND) ---
  
  // 1. Chuyển từ Backend (YYYY-MM-DDTHH:mm:ss) sang Input (YYYY-MM-DDTHH:mm)
  const formatToInputDateTime = (isoString) => {
    if (!isoString) return '';
    return isoString.substring(0, 16); 
  };

  // 2. Chuyển từ Input (YYYY-MM-DDTHH:mm) sang Backend (YYYY-MM-DDTHH:mm:ss)
  // Logic này quan trọng để giữ đúng giờ địa phương cho Backend Java LocalDatetime
  const formatToBackendDate = (localDateTimeInput) => {
    if (!localDateTimeInput) return null;
    return `${localDateTimeInput}:00`; 
  };

  // --- 2. LOAD DỮ LIỆU TỪ API ---
  const fetchSleeps = () => {
    fetch(`${SLEEP_API_URL}/${CURRENT_USER_ID}`)
      .then(res => res.json())
      .then(data => setSleepData(data)) 
      .catch(err => console.error("Lỗi tải dữ liệu:", err));
  };

  useEffect(() => {
    fetchSleeps();
  }, []);

  // --- MỚI: XỬ LÝ KHI CHỌN NGÀY TỪ LỊCH (Từ code đồng nghiệp) ---
  const handleDateChange = (newDate) => {
    localStorage.setItem('APP_SELECTED_DATE', newDate);
    // Cập nhật lại ngày mặc định trong form để khớp ngày chọn
    setFormData(prev => ({ ...prev, sleepDate: newDate }));
    // Reload nhẹ để cập nhật toàn bộ ứng dụng theo ngày mới
    window.location.reload(); 
  };

  // --- 3. LỌC DỮ LIỆU THEO NGÀY ĐANG CHỌN ---
  const filteredSleepData = sleepData.filter(item => item.sleepDate === currentSelectedDate);

  // --- CÁC HÀM ĐIỀU KHIỂN ---

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ 
      sleepDate: currentSelectedDate, 
      sleepType: 'Giấc đêm', 
      sleepTime: '', 
      wakeTime: '', 
      sleepQuality: 'Tốt' 
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.sleepId);
    setFormData({
      sleepDate: item.sleepDate,
      sleepType: item.sleepType,
      sleepQuality: item.sleepQuality,
      sleepTime: formatToInputDateTime(item.sleepTime),
      wakeTime: formatToInputDateTime(item.wakeTime),
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- GỬI DỮ LIỆU (Dùng logic V2 của bạn để khớp Backend) ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
        userId: CURRENT_USER_ID,
        sleepDate: formData.sleepDate,
        sleepType: formData.sleepType,
        sleepQuality: formData.sleepQuality,
        // Dùng hàm format V2 (thêm :00)
        sleepTime: formatToBackendDate(formData.sleepTime),
        wakeTime: formatToBackendDate(formData.wakeTime)
    };

    if (editingId) {
      // SỬA: Backend mapping @PostMapping("/up") -> Không có ID trên URL
      const updatePayload = { ...payload, sleepId: editingId };
      fetch(`${SLEEP_API_URL}/up`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      }).then(res => {
        if (res.ok) { fetchSleeps(); handleCloseModal(); }
        else alert("Lỗi cập nhật!");
      });

    } else {
      // THÊM MỚI
      fetch(`${SLEEP_API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(res => {
        if (res.ok) { fetchSleeps(); handleCloseModal(); }
        else alert("Lỗi thêm mới!");
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Xóa bản ghi giấc ngủ này?")) {
      fetch(`${SLEEP_API_URL}/delete/${id}`, {
        method: 'GET'
      }).then(res => {
        if (res.ok) fetchSleeps();
        else alert("Lỗi khi xóa!");
      });
    }
  };

  // Hàm hiển thị ngày giờ đẹp
  const formatDisplayTime = (isoString) => {
    if (!isoString) return "---";
    try {
        const [datePart, timePart] = isoString.split('T');
        const [y, m, d] = datePart.split('-');
        const [H, M] = timePart.split(':');
        return `${H}:${M} ${d}/${m}`;
    } catch(e) {
        return isoString;
    }
  };

  return (
    <div className="page-container">
      {/* 🟢 PHẦN TIÊU ĐỀ TÍCH HỢP MỞ LỊCH (Từ code đồng nghiệp) */}
      <div 
        className="sleep-header-top" 
        onClick={() => setShowCalendar(true)} 
        style={{cursor: 'pointer'}}
        title="Bấm để đổi ngày"
      >
        <h1>🌙 Theo Dõi Giấc Ngủ ({currentSelectedDate}) 📅</h1>
      </div>

      {/* 🟢 HIỂN THỊ MODAL LỊCH (Từ code đồng nghiệp) */}
      {showCalendar && (
        <CalendarPicker 
          onDateSelect={handleDateChange} 
          onClose={() => setShowCalendar(false)} 
        />
      )}

      {/* DANH SÁCH GIẤC NGỦ */}
      <div className="sleep-list">
        {filteredSleepData.map((item) => (
          <div key={item.sleepId} className="sleep-card">
            <div className="sleep-icon">😴</div>
            <div className="sleep-info">
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                 <h3>{item.sleepType}</h3>
                 <span style={{fontSize:'0.8rem', color:'#666'}}>({item.sleepDate})</span>
              </div>
              
              <p>🛏️ Ngủ: <strong>{formatDisplayTime(item.sleepTime)}</strong></p>
              <p>⏰ Dậy: <strong>{formatDisplayTime(item.wakeTime)}</strong></p>
            </div>
            
            <div className="sleep-right">
              <span className={`quality-badge ${item.sleepQuality === 'Tốt' ? 'q-good' : item.sleepQuality === 'Kém' ? 'q-bad' : 'q-avg'}`}>
                {item.sleepQuality}
              </span>
              <div className="action-buttons">
                <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
                <button className="btn-icon delete" onClick={() => handleDelete(item.sleepId)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredSleepData.length === 0 && (
            <p style={{textAlign: 'center', color: '#888', marginTop: '20px'}}>
                Chưa có dữ liệu giấc ngủ trong ngày {currentSelectedDate}.
            </p>
        )}
      </div>

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
                <label>Ngày ghi nhận</label>
                <input 
                    type="date" 
                    name="sleepDate" 
                    value={formData.sleepDate} 
                    onChange={handleInputChange} 
                    required 
                />
              </div>

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
                <select name="sleepQuality" value={formData.sleepQuality} onChange={handleInputChange}>
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