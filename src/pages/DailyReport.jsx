// src/pages/DailyReport.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT FILE CẤU HÌNH CHUNG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import './DailyReport.css';

// Thêm propDate để nhận từ Calendar và isEmbedded để tùy biến giao diện
const DailyReport = ({ propDate, isEmbedded = false }) => {
  // 2. CẤU HÌNH API (Khớp với @RequestMapping("/dailysummary"))
  const API_URL = `${API_BASE_URL}/dailysummary`;

  // 3. STATE
  // Ưu tiên dùng propDate (nếu được nhúng), nếu không thì lấy từ localStorage
  const initialDate = localStorage.getItem('APP_SELECTED_DATE') || new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(propDate || initialDate);
   
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔄 ĐỒNG BỘ: Cập nhật lại ngày khi Calendar (trang cha) truyền xuống ngày mới
  useEffect(() => {
    if (propDate) {
      setSelectedDate(propDate);
    }
  }, [propDate]);

  // 4. GỌI API LẤY BÁO CÁO (DailySummary)
  const fetchReport = () => {
    setLoading(true);
    setSummary(null);

    // Backend: @PostMapping("/{id}") và @RequestBody LocalDate date
    fetch(`${API_URL}/${CURRENT_USER_ID}`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      // Backend LocalDate nhận chuỗi "YYYY-MM-DD"
      // JSON.stringify sẽ biến '2025-12-27' thành '"2025-12-27"' -> Spring Boot hiểu đúng.
      body: JSON.stringify(selectedDate) 
    })
    .then(res => {
      if (!res.ok) {
        // Nếu ngày đó chưa có dữ liệu (404) hoặc lỗi server (500)
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

  // Gọi API mỗi khi ngày thay đổi
  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  return (
    // Sử dụng class khác nếu được nhúng để tránh xung đột layout (padding, margin)
    <div className={isEmbedded ? "report-embedded-content" : "page-container"}>
      
      {/* CHỈ HIỂN THỊ HEADER NẾU KHÔNG PHẢI NHÚNG (CHẠY ĐỘC LẬP) */}
      {!isEmbedded && (
        <div className="report-header">
          <h1>📑 Báo Cáo Tổng Hợp Ngày</h1>
          <input 
            type="date" 
            className="date-picker"
            value={selectedDate} 
            onChange={(e) => {
                setSelectedDate(e.target.value);
                // Cập nhật localStorage để đồng bộ với các trang khác nếu cần
                localStorage.setItem('APP_SELECTED_DATE', e.target.value);
            }} 
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
                {/* Dùng Math.round cho Calo để gọn số */}
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
                {/* Khớp với trường Total_Activity_Time (Float) */}
                <li>🏃 Vận động thể chất: <strong>{summary.totalActivityTime || 0} phút</strong></li>
                {/* Khớp với trường Total_Rest_Time (Float) */}
                <li>🛌 Thời gian nghỉ ngơi: <strong>{summary.totalRestTime || 0} phút</strong></li>
              </ul>
            </div>
            
            <div className="report-col">
              <h3>⭐ Đánh Giá Hiệu Suất</h3>
              <div className="rating-box">
                {/* Khớp với trường Rating (Float) */}
                <span className="rating-score">{summary.rating || 0}/5</span>
                {/* Khớp với trường Notes (String) */}
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