// src/pages/Calendar.jsx
import React, { useState } from 'react';
import DailyReport from './DailyReport'; 
import CalendarPicker from '../components/CalendarPicker'; 
import './Calendar.css';

const Calendar = () => {
  // 1. MẶC ĐỊNH LÀ NGÀY HIỆN TẠI KHI MỚI VÀO
  // Chúng ta lấy ngày hôm nay làm giá trị khởi tạo thay vì đọc từ localStorage ngay lập tức
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // State điều khiển Modal Lịch
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // 2. XỬ LÝ KHI NGƯỜI DÙNG CHỌN NGÀY KHÁC TỪ LỊCH
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // Lưu vào localStorage để các trang khác (Dinh dưỡng, Hoạt động) cũng đồng bộ theo
    localStorage.setItem('APP_SELECTED_DATE', newDate);
  };

  return (
    <div className="page-container">
      {/* HEADER TRANG NHẬT KÝ */}
      <div className="calendar-page-header">
        <div className="header-left-info">
          <h1>📅 Nhật Ký Sức Khỏe</h1>
          <p className="status-label">
            {selectedDate === todayStr ? (
              <span className="badge-today">Đang xem: Hôm nay</span>
            ) : (
              <span>Đang xem dữ liệu ngày: <strong>{selectedDate}</strong></span>
            )}
          </p>
        </div>
        
        {/* NÚT BẤM MỞ LỊCH TRANG KÉP */}
        <button 
          className="btn-select-date"
          onClick={() => setShowCalendarModal(true)}
        >
          🔍 Tra cứu ngày khác
        </button>
      </div>

      {/* MODAL LỊCH (Chỉ hiện khi bấm nút) */}
      {showCalendarModal && (
        <CalendarPicker 
          onDateSelect={handleDateChange} 
          onClose={() => setShowCalendarModal(false)} 
        />
      )}

      {/* HIỂN THỊ BÁO CÁO CHI TIẾT */}
      <div className="report-main-view">
        <DailyReport propDate={selectedDate} isEmbedded={true} />
      </div>
    </div>
  );
};

export default Calendar;
