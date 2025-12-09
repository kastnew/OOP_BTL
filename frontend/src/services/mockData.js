// src/services/mockData.js (Thêm đoạn này vào nếu chưa có)
export const MOCK_ACTIVITIES = [
  { id: 1, name: "Chạy bộ", startTime: "06:00", endTime: "07:00", kcal: 350, date: "2024-04-01" },
  { id: 2, name: "Yoga", startTime: "07:00", endTime: "07:45", kcal: 180, date: "2024-04-01" },
  { id: 3, name: "Gym", startTime: "18:00", endTime: "19:30", kcal: 450, date: "2024-04-01" },
];

export const MOCK_MEDICAL_RECORDS = [
  { id: 1, disease: "Tiểu đường type 2", status: "Đang điều trị", date: "2023-03-15", note: "Kiểm soát tốt" },
  { id: 2, disease: "Dị ứng phấn hoa", status: "Cấp tính", date: "2024-01-10", note: "Tránh tiếp xúc hoa" }
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