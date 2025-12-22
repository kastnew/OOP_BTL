// src/pages/MedicalRecords.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT CONFIG ĐỂ ĐỒNG BỘ VỚI NHÓM
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Cấu hình URL cho API Bệnh án
  const RECORDS_API_URL = `${API_BASE_URL}/MedicalRecord`; 

  const [formData, setFormData] = useState({
    diseaseName: '',
    diseaseType: '',
    severity: 'Nhẹ',
    status: 'Đang điều trị',
    diagnosisDate: '',
    notes: ''
  });

  // --- 2. LOAD DỮ LIỆU TỪ BACKEND ---
  const fetchRecords = () => {
    fetch(`${RECORDS_API_URL}/${CURRENT_USER_ID}`)
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(err => console.error("Lỗi tải bệnh án:", err));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // --- CÁC HÀM ĐIỀU KHIỂN BIỂU MẪU ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ diseaseName: '', diseaseType: '', severity: 'Nhẹ', status: 'Đang điều trị', diagnosisDate: '', notes: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    // Lưu ý: ID từ Backend thường là recordId
    setEditingId(item.recordId || item.id); 
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

  // --- 3. GỬI DỮ LIỆU LÊN SERVER ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
        userId: CURRENT_USER_ID,
        ...formData
    };

    if (editingId) {
      // CẬP NHẬT (Sử dụng cấu trúc tương tự trang Nutrition)
      const updatePayload = { ...payload, recordId: editingId };
      fetch(`${RECORDS_API_URL}/up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      }).then(res => {
        if (res.ok) { fetchRecords(); handleCloseModal(); }
        else alert("Lỗi cập nhật bệnh án!");
      });

    } else {
      // THÊM MỚI
      fetch(`${RECORDS_API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(res => {
        if (res.ok) { fetchRecords(); handleCloseModal(); }
        else alert("Lỗi thêm bệnh án mới!");
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa bệnh án này?")) {
      // Xóa theo chuẩn GET delete mà nhóm bạn đang dùng
      fetch(`${RECORDS_API_URL}/delete/${id}`, {
        method: 'GET'
      }).then(res => {
        if (res.ok) fetchRecords();
        else alert("Lỗi khi xóa bệnh án!");
      });
    }
  };

  return (
    <div className="page-container">
      <h1>🏥 Bệnh Án Điện Tử</h1>

      <div className="record-list">
        {records.map((item) => (
          <div key={item.recordId || item.id} className="record-card compact-card">
            <div className="card-top-row">
              <div className="title-group">
                <h3>{item.diseaseName}</h3>
                <span className="type-tag">{item.diseaseType}</span>
              </div>
              <div className="action-buttons-top">
                <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
                <button className="btn-icon delete" onClick={() => handleDelete(item.recordId || item.id)}>🗑️</button>
              </div>
            </div>

            <div className="card-badges-row">
              <span className={`severity-badge ${item.severity === 'Nặng' ? 'sv-high' : item.severity === 'Trung bình' ? 'sv-med' : 'sv-low'}`}>
                {item.severity}
              </span>
              <span className={`status-text ${item.status === 'Đã khỏi' ? 'st-done' : 'st-active'}`}>
                {item.status}
              </span>
            </div>

            <div className="card-details">
              <p className="date-info">📅 {item.diagnosisDate}</p>
              {item.notes && <p className="note-info">📝 {item.notes}</p>}
            </div>
          </div>
        ))}
        {records.length === 0 && <p style={{textAlign: 'center'}}>Chưa có hồ sơ bệnh án nào.</p>}
      </div>

      <button className="fab-btn fab-red" onClick={handleOpenAdd}>+</button>

      {/* --- PHẦN MODAL GIỮ NGUYÊN GIAO DIỆN CŨ --- */}
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
              {/* ... Các trường nhập liệu khác giữ nguyên ... */}
              <div className="form-row">
                <div className="form-group">
                    <label>Loại bệnh</label>
                    <input type="text" name="diseaseType" value={formData.diseaseType} onChange={handleInputChange} placeholder="VD: Mãn tính" />
                </div>
                <div className="form-group">
                    <label>Ngày chẩn đoán</label>
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
