// src/pages/MonthReport.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT FILE CẤU HÌNH CHUNG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import './MonthReport.css';

const MonthReport = () => {
  // 2. CẤU HÌNH API
  const API_URL = `${API_BASE_URL}/monthsummary`;

  // Mặc định chọn tháng hiện tại
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- HÀM AN TOÀN: Biến null/undefined/NaN thành 0 để tránh lỗi màn hình trắng ---
  const safeNum = (num) => {
    return (num === null || num === undefined || isNaN(num)) ? 0 : num;
  };

  // Gọi API lấy báo cáo tháng
  const fetchMonthReport = () => {
    setLoading(true);
    setReport(null);

    // Chuẩn bị Payload khớp với Backend (MonthSummaryRequest)
    const requestBody = {
        month: parseInt(selectedMonth),
        year: parseInt(selectedYear)
    };

    fetch(`${API_URL}/${CURRENT_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
    .then(res => {
      if (!res.ok) throw new Error("Lỗi kết nối");
      return res.text();
    })
    .then(text => {
      if (text) {
        try {
            const data = JSON.parse(text);
            
            // --- LOGIC QUAN TRỌNG: LỌC DỮ LIỆU RỖNG ---
            // Chỉ hiển thị nếu object tồn tại VÀ có tổng số ngày dữ liệu > 0
            if (data && data.totalDays && data.totalDays > 0) {
                setReport(data);
            } else {
                // Nếu totalDays = 0 -> Coi như tháng đó trống
                setReport(null);
            }
        } catch (e) {
            console.error("Lỗi parse JSON:", e);
            setReport(null);
        }
      } else {
        setReport(null);
      }
    })
    .catch(err => {
        console.error(err);
        setReport(null);
    })
    .finally(() => setLoading(false));
  };

  // Chạy lại khi Tháng HOẶC Năm thay đổi
  useEffect(() => {
    fetchMonthReport();
  }, [selectedMonth, selectedYear]);

  // Tạo danh sách năm (Ví dụ: 2023 -> 2030)
  const years = Array.from({ length: 8 }, (_, i) => 2023 + i);

  return (
    <div className="page-container">
      <div className="month-header">
        <h1>📅 Báo Cáo Tháng {selectedMonth}/{selectedYear}</h1>
        
        <div className="month-selector">
          <div className="selector-group">
            <label>Tháng:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
          </div>

          <div className="selector-group" style={{marginLeft: '15px'}}>
             <label>Năm:</label>
             <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
             >
                {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
             </select>
          </div>
        </div>
      </div>

      {loading && <p>Đang phân tích dữ liệu...</p>}

      {!loading && !report && (
        <div className="empty-state">
          <p>📭 Không có dữ liệu tổng hợp cho <strong>Tháng {selectedMonth}/{selectedYear}</strong>.</p>
        </div>
      )}

      {!loading && report && (
        <div className="month-content">
          
          {/* 1. THẺ TỔNG QUAN TRUNG BÌNH */}
          <div className="section-title">📊 Trung Bình Mỗi Ngày</div>
          <div className="avg-grid">
            <div className="avg-card calo-in">
              <h3>Nạp vào</h3>
              {/* Sử dụng safeNum để tránh lỗi khi dữ liệu bị null */}
              <p>{safeNum(report.avgCaloriesIn).toFixed(0)} kcal</p>
            </div>
            <div className="avg-card calo-out">
              <h3>Tiêu hao</h3>
              <p>{safeNum(report.avgCaloriesOut).toFixed(0)} kcal</p>
            </div>
            <div className="avg-card balance">
              <h3>Cân bằng</h3>
              <p>{(safeNum(report.avgCaloriesIn) - safeNum(report.avgCaloriesOut)).toFixed(0)} kcal</p>
            </div>
          </div>

          {/* 2. DINH DƯỠNG TRUNG BÌNH */}
          <div className="section-title">🥗 Dinh Dưỡng Trung Bình</div>
          <div className="macros-row">
            <div className="macro-box">
              <span className="dot p"></span> Protein
              <strong>{safeNum(report.avgProtein).toFixed(1)}g</strong>
            </div>
            <div className="macro-box">
              <span className="dot f"></span> Chất béo
              <strong>{safeNum(report.avgFat).toFixed(1)}g</strong>
            </div>
            <div className="macro-box">
              <span className="dot s"></span> Đường
              <strong>{safeNum(report.avgSugar).toFixed(1)}g</strong>
            </div>
            <div className="macro-box">
              <span className="dot fib"></span> Chất xơ
              <strong>{safeNum(report.avgFiber).toFixed(1)}g</strong>
            </div>
          </div>

          {/* 3. THỐNG KÊ CẢNH BÁO */}
          <div className="section-title">⚠️ Thống Kê Cảnh Báo ({safeNum(report.totalDays)} ngày dữ liệu)</div>
          <div className="alerts-grid">
            {[
              { label: "Thừa năng lượng", val: report.daysCaloriesInMoreThanOut, color: "red" },
              { label: "Ăn quá nhiều Đường", val: report.daysHighSugar, color: "yellow" },
              { label: "Ăn quá nhiều Chất béo", val: report.daysHighFat, color: "orange" },
              { label: "Thiếu Chất xơ", val: report.daysLowFiber, color: "gray" },
              { label: "Thiếu Protein", val: report.daysLowProtein, color: "blue" },
            ].map((item, index) => {
                // Tính phần trăm an toàn (Tránh chia cho 0)
                const percent = report.totalDays > 0 ? (safeNum(item.val) / report.totalDays) * 100 : 0;
                
                return (
                    <div className="alert-item" key={index}>
                        <span>{item.label}</span>
                        <div className="progress-bar">
                            <div className={`fill ${item.color}`} style={{width: `${percent}%`}}></div>
                        </div>
                        <strong>{safeNum(item.val)} ngày</strong>
                    </div>
                );
            })}
          </div>

          {/* 4. ĐÁNH GIÁ TỪ HỆ THỐNG */}
          <div className="summary-note">
            <h3>📝 Đánh giá từ chuyên gia AI</h3>
            <div className="note-content">
              "{report.note || "Bạn đang làm rất tốt, hãy duy trì phong độ!"}"
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default MonthReport;