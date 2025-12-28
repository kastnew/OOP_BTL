// src/pages/MedicalRecords.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT FILE CẤU HÌNH CHUNG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import CalendarPicker from '../components/CalendarPicker'; 
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 2. CẤU HÌNH API
  const MEDICAL_API_URL = `${API_BASE_URL}/medicalrecord`;

  // LẤY NGÀY ĐANG CHỌN TỪ LOCALSTORAGE (Để dùng làm mặc định cho form thêm mới)
  const currentSelectedDate = localStorage.getItem('APP_SELECTED_DATE') || new Date().toISOString().split('T')[0];

  // Form data
  const [formData, setFormData] = useState({
    diseaseName: '',
    diseaseType: '',
    severity: 'Nhẹ',
    status: 'Đang điều trị',
    diagnosisDate: currentSelectedDate, // Mặc định theo ngày chọn
    notes: ''
  });

  // --- 3. LOAD DỮ LIỆU TỪ DB ---
  const fetchRecords = () => {
    fetch(`${MEDICAL_API_URL}/${CURRENT_USER_ID}`)
      .then(res => {
        if (!res.ok) return []; 
        return res.json();
      })
      .then(data => {
        // Sắp xếp giảm dần theo ngày (Mới nhất lên đầu)
        const sortedList = Array.isArray(data) 
            ? data.sort((a, b) => new Date(b.diagnosisDate) - new Date(a.diagnosisDate)) 
            : [];
        setRecords(sortedList);
      })
      .catch(err => console.error("Lỗi tải bệnh án:", err));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // XỬ LÝ KHI CHỌN NGÀY TỪ LỊCH (Chỉ để cập nhật ngày mặc định cho form thêm mới)
  const handleDateChange = (newDate) => {
    localStorage.setItem('APP_SELECTED_DATE', newDate);
    setFormData(prev => ({ ...prev, diagnosisDate: newDate }));
    // Reload nhẹ để cập nhật state toàn cục (nếu các trang khác cần)
    window.location.reload(); 
  };

  // --- CÁC HÀM LOGIC ---

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ 
      diseaseName: '', 
      diseaseType: '', 
      severity: 'Nhẹ', 
      status: 'Đang điều trị', 
      diagnosisDate: currentSelectedDate, // Tự điền ngày đang chọn
      notes: '' 
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.recordId); 
    setFormData({
      diseaseName: item.diseaseName,
      diseaseType: item.diseaseType,
      severity: item.severity,
      status: item.status,
      diagnosisDate: item.diagnosisDate,
      notes: item.notes
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- 4. GỬI DỮ LIỆU ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
        userId: CURRENT_USER_ID,
        ...formData
    };

    if (editingId) {
      // SỬA
      const updatePayload = { ...payload, recordId: editingId };
      fetch(`${MEDICAL_API_URL}/up`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      }).then(res => {
        if (res.ok) { fetchRecords(); handleCloseModal(); }
        else alert("Lỗi cập nhật!");
      });

    } else {
      // THÊM MỚI
      fetch(`${MEDICAL_API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(res => {
        if (res.ok) { fetchRecords(); handleCloseModal(); }
        else alert("Lỗi thêm mới!");
      });
    }
  };

  // --- 5. XÓA ---
  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa bệnh án này?")) {
      fetch(`${MEDICAL_API_URL}/delete/${id}`, {
        method: 'GET'
      }).then(res => {
        if (res.ok) fetchRecords();
        else alert("Lỗi xóa!");
      });
    }
  };

  return (
    <div className="page-container">
      {/* HEADER: Đơn giản hóa, không còn chức năng click */}
      <div className="medical-header-top">
        <h1>🏥 Bệnh Án Điện Tử (Tất cả)</h1>
      </div>

      {/* ✅ LỊCH WIDGET (Luôn hiển thị) */}
      <CalendarPicker onDateSelect={handleDateChange} />

      <div className="record-list">
        {records.map((item) => (
          <div key={item.recordId} className="record-card compact-card">
            
            {/* DÒNG 1: Tên bệnh + Nút Sửa/Xóa */}
            <div className="card-top-row">
              <div className="title-group">
                <h3>{item.diseaseName}</h3>
                <span className="type-tag">{item.diseaseType}</span>
              </div>
              
              <div className="action-buttons-top">
                <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
                <button className="btn-icon delete" onClick={() => handleDelete(item.recordId)}>🗑️</button>
              </div>
            </div>

            {/* DÒNG 2: Các badge trạng thái */}
            <div className="card-badges-row">
              <span className={`severity-badge ${item.severity === 'Nặng' ? 'sv-high' : item.severity === 'Trung bình' ? 'sv-med' : 'sv-low'}`}>
                {item.severity}
              </span>
              <span className={`status-text ${item.status === 'Đã khỏi' ? 'st-done' : 'st-active'}`}>
                {item.status}
              </span>
            </div>

            {/* DÒNG 3: Thông tin chi tiết */}
            <div className="card-details">
              <p className="date-info">📅 {item.diagnosisDate}</p>
              {item.notes && <p className="note-info">📝 {item.notes}</p>}
            </div>

          </div>
        ))}
        
        {records.length === 0 && (
            <p style={{textAlign: 'center', color: '#888', marginTop: '20px'}}>
                Chưa có hồ sơ bệnh án nào.
            </p>
        )}
      </div>

      <button className="fab-btn fab-red" onClick={handleOpenAdd}>+</button>

      {/* --- PHẦN MODAL GIỮ NGUYÊN --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Cập Nhật Bệnh Án' : 'Thêm Bệnh Án Mới'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên bệnh</label>
                <input type="text" name="diseaseName" value={formData.diseaseName} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                    <label>Loại bệnh</label>
                    <input type="text" name="diseaseType" value={formData.diseaseType} onChange={handleInputChange} placeholder="VD: Mãn tính" />
                </div>
                <div className="form-group">
                    <label>Ngày chẩn đoán</label>
                    {/* Input này tự động nhận giá trị ngày đang chọn từ localStorage */}
                    <input type="date" name="diagnosisDate" value={formData.diagnosisDate} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mức độ</label>
                  <select name="severity" value={formData.severity} onChange={handleInputChange}>
                    <option>Nhẹ</option>
                    <option>Trung bình</option>
                    <option>Nặng</option>
                    <option>Nguy kịch</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option>Đang điều trị</option>
                    <option>Đã khỏi</option>
                    <option>Tái phát</option>
                    <option>Theo dõi</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="2" style={{width: '100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}}></textarea>
              </div>
              <button type="submit" className="btn-save-modal btn-red">Lưu Hồ Sơ</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;