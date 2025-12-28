import React, { useState, useEffect } from 'react';
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import './CalendarPicker.css';

const CalendarPicker = ({ onDateSelect }) => {
  // Tự quản lý trạng thái đóng/mở
  const [isOpen, setIsOpen] = useState(false);

  // Lấy ngày đang chọn từ localStorage để làm mốc
  const activeDate = localStorage.getItem('APP_SELECTED_DATE') || new Date().toISOString().split('T')[0];
  
  // State quản lý tháng đang hiển thị 
  // Khởi tạo bằng activeDate để khi mở lại vẫn giữ đúng tháng người dùng đang xem dở
  const [currentMonth, setCurrentMonth] = useState(new Date(activeDate));
  
  const [dataMap, setDataMap] = useState({ activities: [], meals: [] });

  // Load dữ liệu chấm tròn
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAct, resMeal] = await Promise.all([
          fetch(`${API_BASE_URL}/DailyActivity/${CURRENT_USER_ID}`),
          fetch(`${API_BASE_URL}/Meal/${CURRENT_USER_ID}`)
        ]);
        const acts = resAct.ok ? await resAct.json() : [];
        const meals = resMeal.ok ? await resMeal.json() : [];
        
        setDataMap({ 
          activities: Array.isArray(acts) ? acts : [], 
          meals: Array.isArray(meals) ? meals : [] 
        });
      } catch (err) { console.error(err); }
    };
    
    if (isOpen) {
        fetchData();
        // Cập nhật lại view theo ngày đang chọn hiện tại mỗi khi mở
        setCurrentMonth(new Date(localStorage.getItem('APP_SELECTED_DATE') || new Date()));
    }
  }, [isOpen]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  // Hàm chọn ngày hôm nay
  const handleJumpToToday = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    setCurrentMonth(today); // Chuyển view về tháng hiện tại
    onDateSelect(todayStr); // Chọn ngày hôm nay cho app
    setIsOpen(false);       // Đóng lịch
  };

  return (
    <>
      {/* 1. NÚT NỔI (FAB) HÌNH LỊCH */}
      <button 
        className={`calendar-fab-btn ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Đổi ngày"
      >
        📅
      </button>

      {/* 2. MODAL LỊCH */}
      {isOpen && (
        <div className="calendar-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="calendar-modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="calendar-modal-header">
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <h3>Chọn Ngày</h3>
                  {/* Nút Hôm nay */}
                  <button className="btn-today-sm" onClick={handleJumpToToday}>Hôm nay</button>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
            </header>

            <div className="calendar-modal-controls">
              <button className="nav-btn" onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>◀</button>
              <span className="month-label">Tháng {month + 1}, {year}</span>
              <button className="nav-btn" onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>▶</button>
            </div>

            <div className="calendar-modal-grid">
              {['CN','T2','T3','T4','T5','T6','T7'].map(d => (
                <div key={d} className="modal-grid-head">{d}</div>
              ))}
              {daysArray.map((day, index) => {
                if (!day) return <div key={index} className="modal-cell empty"></div>;
                
                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                const isSelected = dateStr === activeDate;
                
                return (
                  <div 
                    key={index} 
                    className={`modal-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      onDateSelect(dateStr);
                      setIsOpen(false);
                    }}
                  >
                    <span className="day-number">{day}</span>
                    <div className="modal-dots">
                      {dataMap.activities.some(a => a.date === dateStr) && <span className="m-dot dot-act"></span>}
                      {dataMap.meals.some(m => m.date === dateStr) && <span className="m-dot dot-meal"></span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarPicker;