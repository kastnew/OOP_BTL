// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, getCurrentUserId } from '../utils/config';
import CalendarPicker from '../components/CalendarPicker';
import './Dashboard.css';

const Dashboard = ({ setIsAuthenticated }) => {
  const CURRENT_USER_ID = getCurrentUserId();

  // 1. CẤU HÌNH API
  const USER_API_URL = `${API_BASE_URL}/user`;
  // Lưu ý: Đường dẫn phải khớp chính xác với @RequestMapping trong Backend của bạn
  const HEALTH_API_URL = `${API_BASE_URL}/healthincators`; 

  // 2. STATE
  const [userInfo, setUserInfo] = useState({
    firstName: '', 
    lastName: '', 
    age: '', 
    gender: 'Nam',
    // Các chỉ số sức khỏe
    height: '', 
    weight: '', 
    heartRate: '', 
    bloodPressure: '',
    indicatorId: null // ID của bản ghi sức khỏe (để biết cập nhật dòng nào)
  });

  const [bmi, setBmi] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // 3. LOAD DỮ LIỆU
  useEffect(() => {
    const fetchData = async () => {
      if (!CURRENT_USER_ID) return;
      setLoading(true);
      try {
        // Gọi song song 2 API
        const [userRes, healthRes] = await Promise.all([
          fetch(`${USER_API_URL}/${CURRENT_USER_ID}`),
          fetch(`${HEALTH_API_URL}/${CURRENT_USER_ID}`)
        ]);

        const userData = userRes.ok ? await userRes.json() : {};
        const healthDataList = healthRes.ok ? await healthRes.json() : [];

        // Backend trả về List, ta lấy phần tử mới nhất (giả sử là phần tử cuối)
        // Nếu list rỗng thì là null
        const healthData = (Array.isArray(healthDataList) && healthDataList.length > 0) 
            ? healthDataList[healthDataList.length - 1] 
            : null;

        setUserInfo(prev => ({
          ...prev,
          // User Info
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          age: userData.age || '',
          gender: userData.gender || 'Nam',
          
          // Health Info
          height: healthData?.height || '',
          weight: healthData?.weight || '',
          heartRate: healthData?.heartRate || '',
          bloodPressure: healthData?.bloodPressure || '',
          indicatorId: healthData?.indicatorId || null // Quan trọng cho việc Update
        }));

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 4. TÍNH BMI TỰ ĐỘNG
  useEffect(() => {
    if (userInfo.weight && userInfo.height) {
      // Giả sử chiều cao nhập là mét (ví dụ 1.75)
      const h = parseFloat(userInfo.height);
      const w = parseFloat(userInfo.weight);
      if (h > 0) {
          const bmiValue = w / (h * h);
          setBmi(bmiValue.toFixed(2));
      }
    } else {
        setBmi(0);
    }
  }, [userInfo.weight, userInfo.height]);

  // --- HANDLERS ---
  const handleEditClick = () => {
    setFormData(userInfo); // Copy dữ liệu hiện tại vào form
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- LƯU DỮ LIỆU (SAVE) ---
  const handleSave = async (e) => {
    e.preventDefault();

    try {
        // A. CẬP NHẬT THÔNG TIN CÁ NHÂN (User)
        const userPayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            age: parseInt(formData.age) || 0,
            gender: formData.gender
        };

        // Gọi API User Update (theo code cũ của bạn là PATCH /user/up/{id})
        await fetch(`${USER_API_URL}/up/${CURRENT_USER_ID}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userPayload)
        });

        // B. CẬP NHẬT CHỈ SỐ SỨC KHỎE (HealthIndicators)
        const healthPayload = {
            userId: CURRENT_USER_ID, // Backend cần field này để map User
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            heartRate: parseFloat(formData.heartRate),
            bloodPressure: parseFloat(formData.bloodPressure),
            bmi: parseFloat(bmi), // Gửi BMI hiện tại lên
            healthStatus: "Updated via Dashboard" 
        };

        // Quyết định gọi /create hay /up
        let healthUrl, healthMethod;

        if (formData.indicatorId) {
            // Nếu đã có ID -> Gọi Update
            healthUrl = `${HEALTH_API_URL}/up`;
            healthMethod = 'POST'; // Backend quy định @PostMapping("up")
            healthPayload.indicatorId = formData.indicatorId; // Bắt buộc có ID để update
        } else {
            // Nếu chưa có ID -> Gọi Create
            healthUrl = `${HEALTH_API_URL}/create`;
            healthMethod = 'POST';
        }

        const healthRes = await fetch(healthUrl, {
            method: healthMethod,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(healthPayload)
        });

        if (healthRes.ok) {
            alert("Cập nhật thành công!");
            setUserInfo(formData); // Cập nhật UI ngay lập tức
            setShowModal(false);
            // Reload nhẹ để lấy lại indicatorId mới nếu vừa create xong (tùy chọn)
             window.location.reload(); 
        } else {
            alert("Lỗi khi lưu chỉ số sức khỏe!");
        }

    } catch (error) {
        console.error("Lỗi save:", error);
        alert("Có lỗi xảy ra khi lưu dữ liệu.");
    }
  };

  const getBMIStatus = (bmiVal) => {
    const val = parseFloat(bmiVal);
    if (!val) return { text: "Chưa có dữ liệu", color: "#95a5a6" };
    if (val < 18.5) return { text: "Thiếu cân", color: "#f1c40f" };
    if (val < 24.9) return { text: "Bình thường", color: "#27ae60" };
    if (val < 29.9) return { text: "Thừa cân", color: "#e67e22" };
    return { text: "Béo phì", color: "#c0392b" };
  };

  const bmiStatus = getBMIStatus(bmi);

  const handleLogout = () => {
    localStorage.removeItem("app_is_auth");
    localStorage.removeItem("app_user_id");
    if (setIsAuthenticated) setIsAuthenticated(false);
  };

  const handleDateChange = (newDate) => {
    localStorage.setItem('APP_SELECTED_DATE', newDate);
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>👋 Tổng Quan Sức Khỏe</h1>
        <div className="header-actions">
          <button className="btn-edit-profile" onClick={handleEditClick}>
            ⚙️ Cập nhật hồ sơ
          </button>
          <button className="btn-logout" onClick={handleLogout} style={{marginLeft: '10px', backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer'}}>
             Đăng xuất
          </button>
        </div>
      </div>

      <CalendarPicker onDateSelect={handleDateChange} />

      {loading && <p>Đang tải dữ liệu...</p>}

      {!loading && (
        <>
            {/* CARD THÔNG TIN CÁ NHÂN */}
            <div className="user-profile-card">
                <div className="avatar-circle">
                {userInfo.lastName ? userInfo.lastName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-details">
                <h2>{userInfo.firstName} {userInfo.lastName}</h2>
                <p>Tuổi: <strong>{userInfo.age || '--'}</strong> | Giới tính: <strong>{userInfo.gender}</strong></p>
                </div>
            </div>

            {/* CARD CHỈ SỐ */}
            <div className="metrics-grid">
                <div className="metric-card bmi-card" style={{ borderLeft: `5px solid ${bmiStatus.color}` }}>
                <h3>BMI (Chỉ số khối)</h3>
                <div className="big-value" style={{ color: bmiStatus.color }}>{bmi || '--'}</div>
                <span className="status-badge" style={{ backgroundColor: bmiStatus.color }}>
                    {bmiStatus.text}
                </span>
                </div>

                <div className="metric-card">
                <h3>📏 Chiều cao</h3>
                <p className="big-value">{userInfo.height || '--'} <span>m</span></p>
                </div>

                <div className="metric-card">
                <h3>⚖️ Cân nặng</h3>
                <p className="big-value">{userInfo.weight || '--'} <span>kg</span></p>
                </div>

                <div className="metric-card">
                <h3>❤️ Nhịp tim</h3>
                <p className="big-value">{userInfo.heartRate || '--'} <span>bpm</span></p>
                </div>

                <div className="metric-card">
                <h3>🩸 Huyết áp</h3>
                <p className="big-value">{userInfo.bloodPressure || '--'} <span>mmHg</span></p>
                </div>
            </div>
        </>
      )}

      {/* MODAL EDIT */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cập Nhật Hồ Sơ & Sức Khỏe</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSave}>
              <h4 style={{marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '5px'}}>Thông tin cá nhân</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ (Last Name)</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Tên (First Name)</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                 <div className="form-group">
                    <label>Tuổi</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
                 </div>
                 <div className="form-group">
                    <label>Giới tính</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                 </div>
              </div>

              <h4 style={{marginTop: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>Chỉ số sức khỏe</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Chiều cao (m)</label>
                  <input type="number" step="0.01" name="height" value={formData.height} onChange={handleInputChange} placeholder="VD: 1.75" />
                </div>
                <div className="form-group">
                  <label>Cân nặng (kg)</label>
                  <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="VD: 70.5" />
                </div>
              </div>
              <div className="form-row">
                 <div className="form-group">
                    <label>Nhịp tim</label>
                    <input type="number" name="heartRate" value={formData.heartRate} onChange={handleInputChange} />
                 </div>
                 <div className="form-group">
                    <label>Huyết áp</label>
                    <input type="number" name="bloodPressure" value={formData.bloodPressure} onChange={handleInputChange} placeholder="VD: 120" />
                 </div>
              </div>

              <button type="submit" className="btn-save-modal">Lưu Thay Đổi</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;