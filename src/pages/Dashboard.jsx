// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
// 1. IMPORT CONFIG
import { API_BASE_URL, CURRENT_USER_ID } from '../utils/config';
import CalendarPicker from '../components/CalendarPicker'; // ✅ Thêm Widget Lịch
import './Dashboard.css';

const Dashboard = ({ setIsAuthenticated }) => {
  
  // 2. CẤU HÌNH API
  const USER_API_URL = `${API_BASE_URL}/test`;
  const HEALTH_API_URL = `${API_BASE_URL}/healthincators`;

  // 3. STATE
  const [userInfo, setUserInfo] = useState({
    firstName: '', 
    lastName: '', 
    age: '', 
    gender: 'Nam',
    // Các chỉ số sức khỏe sẽ lấy từ API HealthIndicators
    height: '', 
    weight: '', 
    heartRate: '', 
    bloodPressure: '',
    indicatorId: null // Lưu ID để dùng cho việc Update (nếu có bản ghi cũ)
  });

  const [bmi, setBmi] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  // 4. LOAD DỮ LIỆU TỪ 2 NGUỒN (User + HealthIndicators)
  useEffect(() => {
    const fetchData = async () => {
        try {
            // Gọi song song 2 API để tối ưu tốc độ
            const [userRes, healthRes] = await Promise.all([
                fetch(`${USER_API_URL}/${CURRENT_USER_ID}`),
                fetch(`${HEALTH_API_URL}/${CURRENT_USER_ID}`)
            ]);

            const userData = userRes.ok ? await userRes.json() : null;
            const healthDataList = healthRes.ok ? await healthRes.json() : [];
            
            // Lấy bản ghi sức khỏe mới nhất (nếu list trả về nhiều bản ghi)
            // Giả sử API trả về list, ta lấy phần tử cuối cùng hoặc đầu tiên tùy logic backend
            // Ở đây giả định lấy phần tử mới nhất (ví dụ phần tử cuối cùng)
            const healthData = healthDataList.length > 0 ? healthDataList[healthDataList.length - 1] : null;

            setUserInfo(prev => ({
                ...prev,
                // Dữ liệu từ User API
                firstName: userData?.firstName || '',
                lastName: userData?.lastName || '',
                age: userData?.age || '',
                gender: userData?.gender || 'Nam',
                
                // Dữ liệu từ HealthIndicators API
                height: healthData?.height || '',
                weight: healthData?.weight || '',
                heartRate: healthData?.heartRate || '',
                bloodPressure: healthData?.bloodPressure || '',
                indicatorId: healthData?.indicatorId || null // Quan trọng để biết là Create hay Update
            }));

        } catch (error) {
            console.error("Lỗi tải dữ liệu Dashboard:", error);
        }
    };

    fetchData();
  }, []);

  // 5. TÍNH BMI TỰ ĐỘNG (Frontend Calculation)
  useEffect(() => {
    if (userInfo.weight && userInfo.height) {
      // Chiều cao thường nhập là mét (ví dụ 1.75), nếu nhập cm (175) cần chia 100
      // Kiểm tra logic nhập liệu của bạn. Ở đây giả định nhập mét.
      const h = parseFloat(userInfo.height);
      const w = parseFloat(userInfo.weight);
      if (h > 0) {
          const bmiValue = w / (h * h);
          setBmi(bmiValue.toFixed(2));
      }
    }
  }, [userInfo.weight, userInfo.height]);

  // --- CÁC HÀM XỬ LÝ FORM ---
  const handleEditClick = () => {
    setFormData(userInfo);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- LƯU THÔNG TIN (GỌI 2 API RIÊNG BIỆT) ---
  const handleSave = async (e) => {
    e.preventDefault();

    // 1. Cập nhật thông tin cơ bản (User API)
    const userPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: parseInt(formData.age),
        gender: formData.gender
    };

    // 2. Cập nhật chỉ số sức khỏe (HealthIndicator API)
    const healthPayload = {
        userId: CURRENT_USER_ID,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        heartRate: parseFloat(formData.heartRate),
        bloodPressure: parseFloat(formData.bloodPressure),
        bmi: parseFloat(bmi), // Gửi BMI đã tính lên (nếu backend cần lưu)
        healthStatus: "Normal" // Có thể tính toán dựa trên BMI nếu cần
    };

    try {
        // Gọi API User
        await fetch(`${USER_API_URL}/up/${CURRENT_USER_ID}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userPayload)
        });

        // Gọi API HealthIndicator
        // Nếu đã có indicatorId -> Gọi Update (/up), nếu chưa -> Gọi Create (/create)
        const healthUrl = formData.indicatorId 
            ? `${HEALTH_API_URL}/up` 
            : `${HEALTH_API_URL}/create`;
        
        // Nếu update cần gửi kèm indicatorId
        if (formData.indicatorId) {
            healthPayload.indicatorId = formData.indicatorId;
        }

        await fetch(healthUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(healthPayload)
        });

        // Cập nhật lại UI sau khi lưu thành công
        setUserInfo(formData);
        setShowModal(false);
        alert("Cập nhật thông tin thành công!");

    } catch (error) {
        console.error("Lỗi khi lưu:", error);
        alert("Có lỗi xảy ra khi lưu thông tin.");
    }
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { text: "Thiếu cân", color: "#f1c40f" };
    if (bmi < 24.9) return { text: "Bình thường", color: "#27ae60" };
    if (bmi < 29.9) return { text: "Thừa cân", color: "#e67e22" };
    return { text: "Béo phì", color: "#c0392b" };
  };

  const bmiStatus = getBMIStatus(bmi);

  // --- HÀM XỬ LÝ ĐĂNG XUẤT ---
  const handleLogout = () => {
    localStorage.removeItem("app_is_auth");
    if (typeof setIsAuthenticated === 'function') {
        setIsAuthenticated(false);
    }
  };

  // Hàm xử lý khi chọn ngày từ lịch (Dashboard thường chỉ hiển thị, ít khi đổi ngày để xem lại lịch sử chỉ số cơ thể, nhưng vẫn thêm để đồng bộ)
  const handleDateChange = (newDate) => {
    localStorage.setItem('APP_SELECTED_DATE', newDate);
    // Có thể thêm logic load lại dữ liệu theo ngày nếu Backend hỗ trợ lịch sử cân nặng theo ngày
    window.location.reload();
  };

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>👋 Tổng Quan Sức Khỏe</h1>
        <div className="header-actions">
          <button className="btn-edit-profile" onClick={handleEditClick}>
            ⚙️ Cập nhật thông tin
          </button>
          
          <button
            className="btn-logout"
            onClick={handleLogout}
            style={{
                marginLeft: '10px',
                backgroundColor: '#c0392b',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
            }}
          >
            🔒 Logout
          </button>
        </div>
      </div>

      {/* ✅ WIDGET LỊCH (Xuyên suốt) */}
      <CalendarPicker onDateSelect={handleDateChange} />

      {/* THÔNG TIN CÁ NHÂN */}
      <div className="user-profile-card">
        <div className="avatar-circle">
          {userInfo.lastName ? userInfo.lastName.charAt(0) : 'U'}
        </div>
        <div className="user-details">
          <h2>{userInfo.firstName} {userInfo.lastName}</h2>
          <p>Tuổi: <strong>{userInfo.age}</strong> | Giới tính: <strong>{userInfo.gender}</strong></p>
        </div>
      </div>

      {/* CHỈ SỐ CƠ THỂ */}
      <div className="metrics-grid">
        <div className="metric-card bmi-card" style={{borderColor: bmiStatus.color}}>
          <h3>Chỉ số BMI</h3>
          <div className="big-value" style={{color: bmiStatus.color}}>{bmi}</div>
          <span className="status-badge" style={{backgroundColor: bmiStatus.color}}>
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
          <p className="big-value">{userInfo.bloodPressure || '--'}</p>
        </div>
      </div>

      {/* MODAL SỬA THÔNG TIN */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cập Nhật Hồ Sơ</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <h4 className="form-section-title">Thông tin cá nhân</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Tên</label>
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
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                    </select>
                </div>
              </div>

              <h4 className="form-section-title">Chỉ số sức khỏe (Health Indicators)</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Chiều cao (m)</label>
                  <input type="number" step="0.01" name="height" value={formData.height} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Cân nặng (kg)</label>
                  <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nhịp tim (bpm)</label>
                  <input type="number" name="heartRate" value={formData.heartRate} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Huyết áp</label>
                  <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleInputChange} />
                </div>
              </div>

              <button type="submit" className="btn-save-modal" style={{backgroundColor: '#34495e'}}>Lưu Thông Tin</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;