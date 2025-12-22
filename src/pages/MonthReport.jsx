// src/pages/MonthReport.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT FILE CẤU HÌNH CHUNG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import './MonthReport.css';

const MonthReport = () => {
  // 2. CẤU HÌNH API (Sửa để dùng biến chung)
  // const CURRENT_USER_ID = 1; // <-- Đã import ở trên
  const API_URL = `${API_BASE_URL}/monthsummary`;

  // Mặc định chọn tháng hiện tại
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gọi API lấy báo cáo tháng
  const fetchMonthReport = () => {
    setLoading(true);
    setReport(null);

    fetch(`${API_URL}/${CURRENT_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parseInt(selectedMonth)) // Gửi số tháng (VD: 12)
    })
    .then(res => {
      if (!res.ok) throw new Error("Lỗi kết nối");
      return res.text(); // Đọc text trước để check rỗng
    })
    .then(text => {
      if (text) {
        setReport(JSON.parse(text));
      } else {
        setReport(null);
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMonthReport();
  }, [selectedMonth]);

  return (
    <div className="page-container">
      <div className="month-header">
        <h1>📅 Báo Cáo Tháng {selectedMonth}</h1>
        <div className="month-selector">
          <label>Chọn tháng:</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Đang phân tích dữ liệu...</p>}

      {!loading && !report && (
        <div className="empty-state">
          <p>📭 Không có dữ liệu tổng hợp cho <strong>Tháng {selectedMonth}</strong>.</p>
        </div>
      )}

      {!loading && report && (
        <div className="month-content">
          
          {/* 1. THẺ TỔNG QUAN TRUNG BÌNH */}
          <div className="section-title">📊 Trung Bình Mỗi Ngày</div>
          <div className="avg-grid">
            <div className="avg-card calo-in">
              <h3>Nạp vào</h3>
              <p>{report.avgCaloriesIn?.toFixed(0)} kcal</p>
            </div>
            <div className="avg-card calo-out">
              <h3>Tiêu hao</h3>
              <p>{report.avgCaloriesOut?.toFixed(0)} kcal</p>
            </div>
            {/* Cân bằng = Vào - Ra */}
            <div className="avg-card balance">
              <h3>Cân bằng</h3>
              <p>{(report.avgCaloriesIn - report.avgCaloriesOut)?.toFixed(0)} kcal</p>
            </div>
          </div>

          {/* 2. DINH DƯỠNG TRUNG BÌNH */}
          <div className="section-title">🥗 Dinh Dưỡng Trung Bình</div>
          <div className="macros-row">
            <div className="macro-box">
              <span className="dot p"></span> Protein
              <strong>{report.avgProtein?.toFixed(1)}g</strong>
            </div>
            <div className="macro-box">
              <span className="dot f"></span> Chất béo
              <strong>{report.avgFat?.toFixed(1)}g</strong>
            </div>
            <div className="macro-box">
              <span className="dot s"></span> Đường
              <strong>{report.avgSugar?.toFixed(1)}g</strong>
            </div>
            <div className="macro-box">
              <span className="dot fib"></span> Chất xơ
              <strong>{report.avgFiber?.toFixed(1)}g</strong>
            </div>
          </div>

          {/* 3. THỐNG KÊ CẢNH BÁO */}
          <div className="section-title">⚠️ Thống Kê Cảnh Báo ({report.totalDays} ngày dữ liệu)</div>
          <div className="alerts-grid">
            <div className="alert-item">
              <span>Thừa năng lượng (Vào Nhiều Hơn Ra)</span>
              <div className="progress-bar">
                <div className="fill red" style={{width: `${(report.daysCaloriesInMoreThanOut / report.totalDays) * 100}%`}}></div>
              </div>
              <strong>{report.daysCaloriesInMoreThanOut} ngày</strong>
            </div>

            <div className="alert-item">
              <span>Ăn quá nhiều Đường</span>
              <div className="progress-bar">
                <div className="fill yellow" style={{width: `${(report.daysHighSugar / report.totalDays) * 100}%`}}></div>
              </div>
              <strong>{report.daysHighSugar} ngày</strong>
            </div>

            <div className="alert-item">
              <span>Ăn quá nhiều Chất béo</span>
              <div className="progress-bar">
                <div className="fill orange" style={{width: `${(report.daysHighFat / report.totalDays) * 100}%`}}></div>
              </div>
              <strong>{report.daysHighFat} ngày</strong>
            </div>

            <div className="alert-item">
              <span>Thiếu Chất xơ</span>
              <div className="progress-bar">
                <div className="fill gray" style={{width: `${(report.daysLowFiber / report.totalDays) * 100}%`}}></div>
              </div>
              <strong>{report.daysLowFiber} ngày</strong>
            </div>
             <div className="alert-item">
              <span>Thiếu Protein</span>
              <div className="progress-bar">
                <div className="fill blue" style={{width: `${(report.daysLowProtein / report.totalDays) * 100}%`}}></div>
              </div>
              <strong>{report.daysLowProtein} ngày</strong>
            </div>
          </div>

          {/* 4. ĐÁNH GIÁ TỪ HỆ THỐNG */}
          <div className="summary-note">
            <h3>📝 Đánh giá từ chuyên gia AI</h3>
            <div className="note-content">
              {/* StringBuilder trả về string, hiển thị trực tiếp */}
              "{report.note || "Bạn đang làm rất tốt, hãy duy trì phong độ!"}"
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default MonthReport;