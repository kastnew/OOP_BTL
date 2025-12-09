// src/pages/Profile.jsx
import React from 'react';
import { MOCK_MEDICAL_RECORDS } from '../services/mockData';

const Profile = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Hồ Sơ Y Tế 🏥</h1>
      
      {/* Phần thông tin cá nhân (Bảng Users) */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>Nguyễn Văn An</h2>
        <p>Tuổi: 28 | Giới tính: Nam</p>
      </div>

      {/* Phần Bệnh Án (Bảng Medical_Record) */}
      <h3>Lịch sử bệnh lý</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#3498db', color: 'white' }}>
            <th style={{ padding: '10px' }}>Tên bệnh</th>
            <th>Trạng thái</th>
            <th>Ngày chẩn đoán</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_MEDICAL_RECORDS.map(rec => (
            <tr key={rec.id}>
              <td style={{ padding: '10px' }}>{rec.disease}</td>
              <td style={{ textAlign: 'center' }}>
                <span style={{ 
                  padding: '5px 10px', 
                  borderRadius: '15px', 
                  background: rec.status === 'Đang điều trị' ? '#f1c40f' : '#2ecc71',
                  fontSize: '12px'
                }}>
                  {rec.status}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>{rec.date}</td>
              <td>{rec.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;