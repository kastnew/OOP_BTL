// src/pages/DailyReport.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT FILE CẤU HÌNH CHUNG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import './DailyReport.css';

// Thêm propDate để nhận từ Calendar và isEmbedded để tùy biến giao diện
const DailyReport = ({ propDate, isEmbedded = false }) => {
  // 2. CẤU HÌNH API
  const API_URL = `${API_BASE_URL}/dailysummary`;

  // 3. STATE
  const initialDate = localStorage.getItem('APP_SELECTED_DATE') || new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(propDate || initialDate);
  
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔄 ĐỒNG BỘ: Cập nhật lại ngày khi Calendar truyền xuống ngày mới
  useEffect(() => {
    if (propDate) {
      setSelectedDate(propDate);
    }
  }, [propDate]);

  // 4. GỌI API LẤY BÁO CÁO (DailySummary)
  const fetchReport = () => {
    setLoading(true);
    setSummary(null);

    fetch(`${API_URL}/${CURRENT_USER_ID}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedDate) 
    })
    .then(res => {
      if (!res.ok) throw new Error("Lỗi kết nối");
      return res.text();
    })
    .then(text => {
      if (text) {
        setSummary(JSON.parse(text));
      } else {
        setSummary(null);
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  return (
    // Sử dụng class khác nếu được nhúng để tránh xung đột layout
    <div className={isEmbedded ? "report-embedded-content" : "page-container"}>
      
      {/* CHỈ HIỂN THỊ HEADER NẾU KHÔNG PHẢI NHÚNG */}
      {!isEmbedded && (
        <div className="report-header">
          <h1>📑 Báo Cáo Tổng Hợp Ngày</h1>
          <input 
            type="date" 
            className="date-picker"
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
        </div>
      )}

      {loading && <p>Đang tải dữ liệu...</p>}

      {!loading && !summary && (
        <div className="empty-state">
          <p>📭 Chưa có báo cáo tổng kết cho ngày <strong>{selectedDate}</strong>.</p>
          <small>Hệ thống sẽ tự động tổng hợp khi bạn nhập liệu đầy đủ.</small>
        </div>
      )}

      {/* HIỂN THỊ DỮ LIỆU BÁO CÁO */}
      {!loading && summary && (
        <div className="report-content">
          
          {/* 1. Cân bằng năng lượng */}
          <div className="report-section">
            <h3>🔥 Cân Bằng Năng Lượng</h3>
            <div className="stats-grid">
              <div className="stat-card green">
                <span>Nạp vào</span>
                <strong>{summary.caloriesConsumed || 0} kcal</strong>
              </div>
              <div className="stat-card orange">
                <span>Tiêu hao</span>
                <strong>{summary.caloriesBurned || 0} kcal</strong>
              </div>
              <div className="stat-card blue">
                <span>Kết dư</span>
                <strong>{(summary.caloriesConsumed - summary.caloriesBurned).toFixed(1)} kcal</strong>
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
                <strong>{summary.totalProtein || 0}g</strong>
              </div>
              <div className="macro-item">
                <span className="dot fat"></span>
                <p>Chất béo</p>
                <strong>{summary.totalFat || 0}g</strong>
              </div>
              <div className="macro-item">
                <span className="dot fiber"></span>
                <p>Chất xơ</p>
                <strong>{summary.totalFiber || 0}g</strong>
              </div>
              <div className="macro-item">
                <span className="dot sugar"></span>
                <p>Đường</p>
                <strong>{summary.totalSugar || 0}g</strong>
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
                <span className="rating-score">{summary.rating || 0}/5</span>
                <p className="rating-note">"{summary.notes || 'Không có ghi chú đặc biệt'}"</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default DailyReport;
