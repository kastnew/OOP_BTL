// src/services/mockData.js (Thêm đoạn này vào nếu chưa có)
export const MOCK_ACTIVITIES = [
  { id: 1, name: "Chạy bộ", startTime: "06:00", endTime: "07:00", kcal: 350, date: "2024-04-01" },
  { id: 2, name: "Yoga", startTime: "07:00", endTime: "07:45", kcal: 180, date: "2024-04-01" },
  { id: 3, name: "Gym", startTime: "18:00", endTime: "19:30", kcal: 450, date: "2024-04-01" },
];

// src/services/mockData.js

// --- Dữ liệu Bảng Meal (Bữa ăn) ---
export const MOCK_MEALS = [
  { id: 1, dishName: "Phở bò", type: "Bữa sáng", calories: 350, protein: 20, fat: 8, sugar: 3 },
  { id: 2, dishName: "Cơm gà", type: "Bữa trưa", calories: 450, protein: 25, fat: 10, sugar: 5 },
  { id: 3, dishName: "Salad cá ngừ", type: "Bữa tối", calories: 250, protein: 30, fat: 5, sugar: 2 },
  { id: 4, dishName: "Sữa chua", type: "Bữa phụ", calories: 80, protein: 5, fat: 2, sugar: 10 },
];

// --- Dữ liệu Bảng Sleep (Giấc ngủ) ---
export const MOCK_SLEEP = [
  { id: 1, sleepTime: "22:30 01/04", wakeTime: "06:30 02/04", quality: "Tốt", type: "Giấc đêm" },
  { id: 2, sleepTime: "13:00 02/04", wakeTime: "13:45 02/04", quality: "Trung bình", type: "Giấc trưa" },
];

// src/services/mockData.js

export const MOCK_MEDICAL_RECORDS = [
  { 
    id: 1, 
    diseaseName: "Tiểu đường type 2", 
    diseaseType: "Mãn tính", 
    severity: "Nhẹ", 
    status: "Đang điều trị", 
    diagnosisDate: "2023-03-15", 
    notes: "Kiểm soát đường huyết tốt" 
  },
  { 
    id: 2, 
    diseaseName: "Viêm phế quản", 
    diseaseType: "Cấp tính", 
    severity: "Trung bình", 
    status: "Đã khỏi", 
    diagnosisDate: "2024-01-10", 
    notes: "Đã dùng kháng sinh 2 tuần" 
  }
];

export const USERS = [
  {
    userId: 1,
    firstName: "Nguyễn Văn",
    lastName: "An",
    age: 28,
    gender: "Nam"
  }
];

export const HEALTH_INDICATORS = [
  {
    indicatorId: 1,
    userId: 1,
    height: 1.75,       // Đơn vị mét
    weight: 70,         // Đơn vị kg
    bloodPressure: "120/80",
    heartRate: 75,
    bmi: 22.86,
    healthStatus: "Bình thường"
  }
];