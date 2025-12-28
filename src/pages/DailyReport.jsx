// src/pages/DailyReport.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT CONFIG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import CalendarPicker from '../components/CalendarPicker'; // Widget Lịch nổi
import './DailyReport.css';

const DailyReport = () => {
  // 2. CẤU HÌNH API
  const API_URL = `${API_BASE_URL}/dailysummary`;

  // 3. STATE
  // Lấy ngày từ localStorage (Nếu chưa có thì lấy hôm nay)
  const getInitialDate = () => localStorage.getItem('APP_SELECTED_DATE') || new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
   
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- HÀM LOAD DỮ LIỆU ---
  const fetchReport = () => {
    setLoading(true);
    setSummary(null);

    // Gọi API Backend
    fetch(`${API_URL}/${CURRENT_USER_ID}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedDate) 
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 404 || res.status === 500) return null; 
        throw new Error("Lỗi kết nối");
      }
      return res.text();
    })
    .then(text => {
      if (text) {
        setSummary(JSON.parse(text));
      } else {
        setSummary(null);
      }
    })
    .catch(err => console.error("Fetch error:", err))
    .finally(() => setLoading(false));
  };

  // --- LOGIC ĐỒNG BỘ & TỰ ĐỘNG CẬP NHẬT ---
  
  // 1. Load lại khi ngày thay đổi
  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  // 2. Hàm xử lý khi Widget Lịch thay đổi ngày
  const handleDateChange = (newDate) => {
    localStorage.setItem('APP_SELECTED_DATE', newDate);
    setSelectedDate(newDate); // Cập nhật state -> Trigger useEffect -> Fetch lại dữ liệu
  };

  // 3. Tự động refresh khi quay lại tab này (Event Focus)
  useEffect(() => {
    const onFocus = () => {
        const currentDate = localStorage.getItem('APP_SELECTED_DATE');
        if (currentDate && currentDate !== selectedDate) {
            setSelectedDate(currentDate);
        } else {
            fetchReport(); // Force reload để lấy dữ liệu mới nhất
        }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [selectedDate]);


  // Hàm render số sao rating
  const renderStars = (rating) => {
    const stars = [];
    const score = rating || 0; 
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(score)) {
            stars.push(<span key={i} style={{color: '#f1c40f'}}>★</span>);
        } else {
            stars.push(<span key={i} style={{color: '#ccc'}}>★</span>);
        }
    }
    return stars;
  };

  return (
    <div className="page-container">
      
      {/* HEADER: Đơn giản, chỉ hiện tiêu đề ngày */}
      <div className="report-header">
        <h1>📑 Báo Cáo Ngày ({selectedDate})</h1>
      </div>

      {/* WIDGET LỊCH (Luôn hiển thị ở góc) */}
      <CalendarPicker onDateSelect={handleDateChange} />

      {/* LOADING */}
      {loading && <p style={{textAlign:'center', marginTop:'20px'}}>Đang tổng hợp dữ liệu...</p>}

      {/* EMPTY STATE */}
      {!loading && !summary && (
        <div className="empty-state">
          <p>📭 Chưa có dữ liệu tổng hợp cho ngày <strong>{selectedDate}</strong>.</p>
          <small>Dữ liệu sẽ tự động xuất hiện khi bạn thêm Hoạt động hoặc Dinh dưỡng.</small>
        </div>
      )}

      {/* NỘI DUNG BÁO CÁO */}
      {!loading && summary && (
        <div className="report-content">
          
          {/* 1. Cân bằng năng lượng */}
          <div className="report-section">
            <h3>🔥 Cân Bằng Năng Lượng</h3>
            <div className="stats-grid">
              <div className="stat-card green">
                <span>Nạp vào</span>
                <strong>{Math.round(summary.caloriesConsumed || 0)} kcal</strong>
              </div>
              <div className="stat-card orange">
                <span>Tiêu hao</span>
                <strong>{Math.round(summary.caloriesBurned || 0)} kcal</strong>
              </div>
              <div className="stat-card blue">
                <span>Kết dư</span>
                <strong>{((summary.caloriesConsumed || 0) - (summary.caloriesBurned || 0)).toFixed(1)} kcal</strong>
              </div>
            </div>
          </div>

          {/* 2. Dinh dưỡng chi tiết */}
          <div className="report-section">
            <h3>🥗 Dinh Dưỡng Chi Tiết</h3>
            <div className="macros-grid">
              <div className="macro-item">
                <span className="dot protein"></span>
                <p>Protein</p>
                <strong>{summary.totalProtein?.toFixed(1) || 0}g</strong>
              </div>
              <div className="macro-item">
                <span className="dot fat"></span>
                <p>Chất béo</p>
                <strong>{summary.totalFat?.toFixed(1) || 0}g</strong>
              </div>
              <div className="macro-item">
                <span className="dot fiber"></span>
                <p>Chất xơ</p>
                <strong>{summary.totalFiber?.toFixed(1) || 0}g</strong>
              </div>
              <div className="macro-item">
                <span className="dot sugar"></span>
                <p>Đường</p>
                <strong>{summary.totalSugar?.toFixed(1) || 0}g</strong>
              </div>
            </div>
          </div>

          {/* 3. Thời gian & Đánh giá */}
          <div className="report-row">
            <div className="report-col">
              <h3>⏱️ Thời Gian Hoạt Động</h3>
              <ul className="time-list">
                <li>🏃 Vận động thể chất: <strong>{summary.totalActivityTime || 0} phút</strong></li>
                <li>🛌 Thời gian nghỉ ngơi: <strong>{summary.totalRestTime || 0} phút</strong></li>
              </ul>
            </div>
            
            <div className="report-col">
              <h3>⭐ Đánh Giá Hiệu Suất</h3>
              <div className="rating-box">
                <div style={{fontSize: '1.5rem', marginBottom: '5px'}}>
                    {renderStars(summary.rating)}
                </div>
                <span className="rating-score">{summary.rating ? summary.rating.toFixed(1) : 0}/5</span>
                
                <p className="rating-note" style={{marginTop: '10px', fontStyle: 'italic', color: '#666'}}>
                    "{summary.notes || 'Chưa có đánh giá chi tiết'}"
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default DailyReport;