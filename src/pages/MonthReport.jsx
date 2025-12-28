// src/pages/MonthReport.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT FILE CẤU HÌNH CHUNG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import CalendarPicker from '../components/CalendarPicker'; 
import './MonthReport.css';

const MonthReport = () => {
  const API_URL = `${API_BASE_URL}/monthsummary`;

  // --- CÁC HẰNG SỐ ĐỊNH MỨC (Dùng để so sánh) ---
  const THRESHOLDS = {
    sugarMax: 50,   // Tối đa 50g
    fatMax: 70,     // Tối đa 70g
    fiberMin: 25,   // Tối thiểu 25g
    proteinMin: 60  // Tối thiểu 60g
  };

  // --- STATE VỚI PERSISTENCE ---
  const getInitialMonth = () => {
    const saved = localStorage.getItem('REPORT_SELECTED_MONTH');
    return saved ? parseInt(saved) : new Date().getMonth() + 1;
  };
  const getInitialYear = () => {
    const saved = localStorage.getItem('REPORT_SELECTED_YEAR');
    return saved ? parseInt(saved) : new Date().getFullYear();
  };

  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth());
  const [selectedYear, setSelectedYear] = useState(getInitialYear());
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('REPORT_SELECTED_MONTH', selectedMonth);
    localStorage.setItem('REPORT_SELECTED_YEAR', selectedYear);
  }, [selectedMonth, selectedYear]);

  // --- HÀM AN TOÀN ---
  const safeNum = (num) => {
    return (num === null || num === undefined || isNaN(num)) ? 0 : num;
  };

  // --- XỬ LÝ CHỌN NGÀY TỪ LỊCH ---
  const handleDateChange = (newDateStr) => {
    localStorage.setItem('APP_SELECTED_DATE', newDateStr);
    const date = new Date(newDateStr);
    if (!isNaN(date.getTime())) {
        setSelectedMonth(date.getMonth() + 1);
        setSelectedYear(date.getFullYear());
    }
  };

  // --- GỌI API ---
  const fetchMonthReport = () => {
    setLoading(true);
    setReport(null);

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
            // Logic hiển thị: Chỉ cần data tồn tại (dù totalDays = 0 do lỗi tính toán cũ) vẫn hiển thị
            if (data) {
                setReport(data);
            } else {
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

  useEffect(() => {
    fetchMonthReport();
  }, [selectedMonth, selectedYear]);

  const years = Array.from({ length: 8 }, (_, i) => 2023 + i);

  // --- HÀM HELPER ĐỂ SO SÁNH DINH DƯỠNG ---
  const getNutritionStatus = (type, value) => {
    const val = safeNum(value);
    switch(type) {
        case 'sugar':
            return val > THRESHOLDS.sugarMax 
                ? { text: `Vượt mức (> ${THRESHOLDS.sugarMax}g)`, color: '#e74c3c' } // Đỏ
                : { text: 'An toàn', color: '#27ae60' }; // Xanh
        case 'fat':
            return val > THRESHOLDS.fatMax 
                ? { text: `Vượt mức (> ${THRESHOLDS.fatMax}g)`, color: '#e74c3c' }
                : { text: 'An toàn', color: '#27ae60' };
        case 'fiber':
            return val < THRESHOLDS.fiberMin 
                ? { text: `Thiếu (< ${THRESHOLDS.fiberMin}g)`, color: '#f39c12' } // Cam
                : { text: 'Đạt chuẩn', color: '#27ae60' };
        case 'protein':
            return val < THRESHOLDS.proteinMin 
                ? { text: `Thiếu (< ${THRESHOLDS.proteinMin}g)`, color: '#f39c12' }
                : { text: 'Đạt chuẩn', color: '#27ae60' };
        default: return { text: '', color: '#333' };
    }
  };

  return (
    <div className="page-container">
      
      {/* HEADER */}
      <div className="month-header">
        <h1>📅 Báo Cáo Tháng {selectedMonth}/{selectedYear}</h1>
        <div className="month-selector">
          <div className="selector-group">
            <label>Tháng:</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
          </div>
          <div className="selector-group" style={{marginLeft: '15px'}}>
             <label>Năm:</label>
             <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
             </select>
          </div>
        </div>
      </div>

      <CalendarPicker onDateSelect={handleDateChange} />

      {loading && <p>Đang phân tích dữ liệu...</p>}

      {!loading && !report && (
        <div className="empty-state">
          <p>📭 Không có dữ liệu tổng hợp cho <strong>Tháng {selectedMonth}/{selectedYear}</strong>.</p>
        </div>
      )}

      {!loading && report && (
        <div className="month-content">
          
          {/* 1. CALO TRUNG BÌNH (Giữ nguyên) */}
          <div className="section-title">📊 Trung Bình Mỗi Ngày</div>
          <div className="avg-grid">
            <div className="avg-card calo-in">
              <h3>Nạp vào</h3>
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

          {/* 2. DINH DƯỠNG (DẠNG LIỆT KÊ & SO SÁNH) - Yêu cầu mới */}
          <div className="section-title">🥗 Đánh Giá Dinh Dưỡng Trung Bình</div>
          <div className="nutrition-list-card" style={{background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '30px'}}>
             {[
               { key: 'protein', label: 'Protein (Đạm)', val: report.avgProtein, icon: '🥩' },
               { key: 'fat', label: 'Chất béo', val: report.avgFat, icon: '🥑' },
               { key: 'sugar', label: 'Đường', val: report.avgSugar, icon: '🍬' },
               { key: 'fiber', label: 'Chất xơ', val: report.avgFiber, icon: '🥦' },
             ].map((item) => {
                 const status = getNutritionStatus(item.key, item.val);
                 return (
                    <div key={item.key} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span style={{fontSize: '1.2rem'}}>{item.icon}</span>
                            <span style={{fontWeight: '600', color: '#555'}}>{item.label}</span>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <div style={{fontSize: '1.1rem', fontWeight: 'bold'}}>{safeNum(item.val).toFixed(1)}g</div>
                            <small style={{color: status.color, fontWeight: '600'}}>{status.text}</small>
                        </div>
                    </div>
                 )
             })}
          </div>

          {/* 3. THỐNG KÊ CẢNH BÁO (BIỂU ĐỒ CỘT 5 CỘT) - Yêu cầu mới */}
          <div className="section-title">⚠️ Biểu Đồ Cảnh Báo ({safeNum(report.totalDays)} ngày)</div>
          <div className="chart-container" style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', 
              height: '220px', background: '#fff', padding: '20px', borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '30px'
          }}>
             {[
               { label: 'Dư Calo', val: report.daysCaloriesInMoreThanOut, color: '#e74c3c' },
               { label: 'Dư Đường', val: report.daysHighSugar, color: '#f1c40f' },
               { label: 'Dư Béo', val: report.daysHighFat, color: '#e67e22' },
               { label: 'Thiếu Xơ', val: report.daysLowFiber, color: '#95a5a6' },
               { label: 'Thiếu Đạm', val: report.daysLowProtein, color: '#3498db' },
             ].map((item, idx) => {
                 // Tính chiều cao cột dựa trên tổng số ngày trong tháng (hoặc mặc định 30 nếu totalDays=0)
                 const total = report.totalDays > 0 ? report.totalDays : 30;
                 const percent = Math.min((safeNum(item.val) / total) * 100, 100);
                 
                 return (
                    <div key={idx} style={{display:'flex', flexDirection:'column', alignItems:'center', width: '18%', height: '100%', justifyContent: 'flex-end'}}>
                        {/* Số ngày hiển thị trên đầu cột */}
                        <span style={{fontSize:'0.9rem', fontWeight:'bold', marginBottom:'5px', color: item.color}}>
                            {safeNum(item.val)}
                        </span>
                        
                        {/* Cột */}
                        <div style={{
                            width: '60%', 
                            height: `${percent}%`, 
                            background: item.color, 
                            borderRadius: '6px 6px 0 0',
                            transition: 'height 0.5s ease',
                            minHeight: '4px' // Để vẫn hiện thị vạch nhỏ nếu 0 ngày
                        }}></div>
                        
                        {/* Nhãn dưới chân cột */}
                        <span style={{marginTop:'8px', fontSize:'0.75rem', color:'#555', textAlign: 'center', lineHeight: '1.2'}}>
                            {item.label}
                        </span>
                    </div>
                 )
             })}
          </div>

          {/* 4. ĐÁNH GIÁ (TỐI ƯU KHÔNG GIAN) - Yêu cầu mới */}
          <div className="section-title">📝 Lời Khuyên</div>
          <div className="summary-compact" style={{
              background: '#eef2f7', padding: '15px', borderRadius: '8px', 
              borderLeft: '4px solid #4a90e2', fontSize: '0.95rem', color: '#2c3e50'
          }}>
              {report.note 
                ? report.note.split('.').map((sentence, index) => (
                    sentence.trim() && <div key={index} style={{marginBottom: '4px'}}>• {sentence.trim()}</div>
                  ))
                : "Duy trì chế độ sinh hoạt hiện tại."
              }
          </div>

        </div>
      )}
    </div>
  );
};

export default MonthReport;