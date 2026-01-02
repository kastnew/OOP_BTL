// src/pages/MedicalRecords.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, getCurrentUserId } from '../utils/config';
import CalendarPicker from '../components/CalendarPicker'; 
import './MedicalRecords.css';

const MedicalRecords = () => {
  const CURRENT_USER_ID = getCurrentUserId();
  
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Cấu hình API
  const MEDICAL_API_URL = `${API_BASE_URL}/medicalrecord`;

  // Lấy ngày hiện tại để mặc định cho form
  const currentSelectedDate = localStorage.getItem('APP_SELECTED_DATE') || new Date().toISOString().split('T')[0];

  // State Form (Bổ sung endDate)
  const [formData, setFormData] = useState({
    diseaseName: '',
    diseaseType: '',
    severity: 'Nhẹ',
    status: 'Đang điều trị',
    diagnosisDate: currentSelectedDate,
    endDate: '', // Mặc định rỗng
    notes: ''
  });

  // --- LOAD DỮ LIỆU ---
  const fetchRecords = () => {
    if (!CURRENT_USER_ID) return;
    
    fetch(`${MEDICAL_API_URL}/${CURRENT_USER_ID}`)
      .then(res => {
        if (!res.ok) return []; 
        return res.json();
      })
      .then(data => {
        // Sắp xếp giảm dần theo ngày chẩn đoán
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

  const handleDateChange = (newDate) => {
    localStorage.setItem('APP_SELECTED_DATE', newDate);
    // Nếu đang mở form thêm mới thì cập nhật ngày chẩn đoán theo lịch
    if (!editingId) {
        setFormData(prev => ({ ...prev, diagnosisDate: newDate }));
    }
  };

  // --- LOGIC FORM ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ 
      diseaseName: '', 
      diseaseType: '', 
      severity: 'Nhẹ', 
      status: 'Đang điều trị', 
      diagnosisDate: currentSelectedDate,
      endDate: '', // Reset ngày kết thúc
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
      endDate: item.endDate || '', // Nếu null thì để rỗng
      notes: item.notes
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- GỬI DỮ LIỆU ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // Chuẩn bị payload
    const payload = {
        userId: CURRENT_USER_ID,
        ...formData,
        // Nếu endDate là chuỗi rỗng "" thì chuyển thành null để backend lưu đúng logic
        endDate: formData.endDate === '' ? null : formData.endDate
    };

    const url = editingId ? `${MEDICAL_API_URL}/up` : `${MEDICAL_API_URL}/create`;
    
    if (editingId) {
        payload.recordId = editingId;
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => {
      if (res.ok) { 
          fetchRecords(); 
          handleCloseModal(); 
          alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
      }
      else alert("Có lỗi xảy ra!");
    }).catch(err => console.error(err));
  };

  // --- XÓA ---
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
      <div className="medical-header-top">
        <h1>🏥 Hồ Sơ Bệnh Án</h1>
      </div>

      <CalendarPicker onDateSelect={handleDateChange} />

      <div className="record-list">
        {records.map((item) => (
          <div key={item.recordId} className="record-card compact-card">
            
            {/* DÒNG 1: Tiêu đề & Nút bấm */}
            <div className="card-top-row">
              <div className="title-group">
                <h3>{item.diseaseName}</h3>
                <span className="type-tag">{item.diseaseType || 'Chưa phân loại'}</span>
              </div>
              
              <div className="action-buttons-top">
                <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
                <button className="btn-icon delete" onClick={() => handleDelete(item.recordId)}>🗑️</button>
              </div>
            </div>

            {/* DÒNG 2: Badge Mức độ & Trạng thái */}
            <div className="card-badges-row">
              <span className={`severity-badge ${item.severity === 'Nặng' ? 'sv-high' : item.severity === 'Trung bình' ? 'sv-med' : 'sv-low'}`}>
                Mức độ: {item.severity}
              </span>
              <span className={`status-text ${item.status === 'Đã khỏi' ? 'st-done' : 'st-active'}`}>
                {item.status}
              </span>
            </div>

            {/* DÒNG 3: Chi tiết ngày tháng */}
            <div className="card-details" style={{borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px'}}>
              <div style={{display: 'flex', gap: '20px', marginBottom: '5px', fontSize: '14px', color: '#555'}}>
                  <div>
                    <strong>📅 Ngày phát hiện:</strong> {item.diagnosisDate}
                  </div>
                  <div>
                    <strong>🏁 Ngày kết thúc:</strong> {item.endDate ? item.endDate : <span style={{color: '#e67e22', fontStyle: 'italic'}}>Chưa kết thúc</span>}
                  </div>
              </div>
              
              {item.notes && (
                  <p className="note-info" style={{marginTop: '5px', fontStyle: 'italic', color: '#666'}}>
                    📝 Ghi chú: {item.notes}
                  </p>
              )}
            </div>

          </div>
        ))}
        
        {records.length === 0 && (
            <p style={{textAlign: 'center', color: '#888', marginTop: '30px'}}>
                Chưa có hồ sơ bệnh án nào. Nhấn dấu + để thêm mới.
            </p>
        )}
      </div>

      <button className="fab-btn fab-red" onClick={handleOpenAdd}>+</button>

      {/* MODAL FORM */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Cập Nhật Bệnh Án' : 'Thêm Bệnh Án Mới'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên bệnh <span style={{color:'red'}}>*</span></label>
                <input type="text" name="diseaseName" value={formData.diseaseName} onChange={handleInputChange} required placeholder="Ví dụ: Cúm mùa, Đau dạ dày..." />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                    <label>Loại bệnh</label>
                    <input type="text" name="diseaseType" value={formData.diseaseType} onChange={handleInputChange} placeholder="VD: Truyền nhiễm, Mãn tính" />
                </div>
                <div className="form-group">
                    <label>Mức độ</label>
                    <select name="severity" value={formData.severity} onChange={handleInputChange}>
                      <option>Nhẹ</option>
                      <option>Trung bình</option>
                      <option>Nặng</option>
                      <option>Nguy kịch</option>
                    </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                    <label>Ngày phát hiện <span style={{color:'red'}}>*</span></label>
                    <input type="date" name="diagnosisDate" value={formData.diagnosisDate} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Ngày kết thúc (Nếu có)</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Trạng thái hiện tại</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option>Đang điều trị</option>
                  <option>Đã khỏi</option>
                  <option>Tái phát</option>
                  <option>Theo dõi</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ghi chú thêm</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3" placeholder="Triệu chứng, đơn thuốc..."></textarea>
              </div>

              <button type="submit" className="btn-save-modal btn-red">
                  {editingId ? "Lưu Thay Đổi" : "Thêm Mới"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;