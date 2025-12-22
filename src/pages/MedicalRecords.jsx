// src/pages/MedicalRecords.jsx
import React, { useState, useEffect } from 'react';
import { MOCK_MEDICAL_RECORDS } from '../services/mockData';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form data giữ nguyên như cũ
  const [formData, setFormData] = useState({
    diseaseName: '',
    diseaseType: '',
    severity: 'Nhẹ',
    status: 'Đang điều trị',
    diagnosisDate: '',
    notes: ''
  });

  useEffect(() => {
    setRecords(MOCK_MEDICAL_RECORDS);
  }, []);

  // --- GIỮ NGUYÊN CÁC HÀM LOGIC (Copy từ bài cũ hoặc giữ nguyên nếu chưa xóa) ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ diseaseName: '', diseaseType: '', severity: 'Nhẹ', status: 'Đang điều trị', diagnosisDate: '', notes: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updatedList = records.map((item) => 
        item.id === editingId ? { ...item, ...formData } : item
      );
      setRecords(updatedList);
    } else {
      const newItem = { id: Date.now(), ...formData };
      setRecords([...records, newItem]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa bệnh án này?")) {
      setRecords(records.filter(item => item.id !== id));
    }
  };

  return (
    <div className="page-container">
      <h1>🏥 Bệnh Án Điện Tử</h1>

      <div className="record-list">
        {records.map((item) => (
          <div key={item.id} className="record-card compact-card">
            
            {/* DÒNG 1: Tên bệnh + Nút Sửa/Xóa (Đã đưa lên đây) */}
            <div className="card-top-row">
              <div className="title-group">
                <h3>{item.diseaseName}</h3>
                <span className="type-tag">{item.diseaseType}</span>
              </div>
              
              <div className="action-buttons-top">
                <button className="btn-icon edit" onClick={() => handleOpenEdit(item)}>✎</button>
                <button className="btn-icon delete" onClick={() => handleDelete(item.id)}>🗑️</button>
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

            {/* DÒNG 3: Thông tin chi tiết (Ngày + Ghi chú) */}
            <div className="card-details">
              <p className="date-info">📅 {item.diagnosisDate}</p>
              {item.notes && <p className="note-info">📝 {item.notes}</p>}
            </div>

          </div>
        ))}
        {records.length === 0 && <p style={{textAlign: 'center'}}>Chưa có hồ sơ bệnh án nào.</p>}
      </div>

      <button className="fab-btn fab-red" onClick={handleOpenAdd}>+</button>

      {/* --- PHẦN MODAL GIỮ NGUYÊN KHÔNG ĐỔI --- */}
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