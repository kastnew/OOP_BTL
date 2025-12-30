# Frontend - Ứng Dụng Theo Dõi Sức Khỏe Cá Nhân (Personal Health Tracker)

Chào mừng bạn đến với mã nguồn giao diện (Client-side) của dự án **Ứng Dụng Theo Dõi Sức Khỏe Cá Nhân**. Đây là một ứng dụng web giúp người dùng quản lý toàn diện các chỉ số cơ thể, chế độ dinh dưỡng, vận động và giấc ngủ.

---

## ⚠️ LƯU Ý QUAN TRỌNG (Đọc trước khi cài đặt)

Dự án này được xây dựng theo mô hình **Client-Server**. Repository này chỉ chứa mã nguồn giao diện (Frontend).

Để ứng dụng hoạt động chính xác và hiển thị được dữ liệu, bạn **BẮT BUỘC** phải tải và chạy song song phần **Backend** (Server & Database).

👉 **Vui lòng tải code Backend tại:** [Backend - Ứng Dụng Theo Dõi Sức Khỏe Cá Nhân](https://github.com/kastnew/OOP_BTL_Backend)

---

## 🌟 Tính Năng Chính

Ứng dụng cung cấp các công cụ trực quan để theo dõi sức khỏe hàng ngày:

1.  **🏠 Dashboard (Tổng quan):**
    * Hiển thị thông tin cá nhân.
    * Tự động tính toán và đánh giá chỉ số BMI (Thiếu cân, Bình thường, Thừa cân...).
    * Hiển thị nhanh các chỉ số sức khỏe mới nhất (Huyết áp, Nhịp tim...).

2.  **🏃 Theo dõi Hoạt động (Activities):**
    * Ghi lại các bài tập thể dục, vận động trong ngày.
    * Tính toán lượng Calo tiêu thụ (Calories Burned).

3.  **🥗 Nhật ký Dinh dưỡng (Nutrition):**
    * Quản lý các bữa ăn (Sáng, Trưa, Tối, Phụ).
    * Tính tổng Calo nạp vào và các chỉ số dinh dưỡng (Đạm, Đường, Béo, Xơ).

4.  **😴 Theo dõi Giấc ngủ (Sleep Tracker):**
    * Ghi lại thời gian ngủ, thức dậy.
    * Đánh giá chất lượng giấc ngủ.

5.  **🏥 Bệnh án điện tử (Medical Records):**
    * Lưu trữ lịch sử khám bệnh, chẩn đoán và tình trạng điều trị.

6.  **📊 Báo cáo Thông minh (Reports):**
    * **Báo cáo Ngày:** So sánh Calo Nạp vào vs Tiêu hao, chấm điểm hiệu suất trong ngày (Rating 1-5 sao).
    * **Báo cáo Tháng:** Biểu đồ thống kê cảnh báo sức khỏe và lời khuyên tự động.

7.  **📅 Widget Lịch Thông Minh:**
    * Công cụ chọn ngày nhanh chóng, đi xuyên suốt tất cả các trang.

---

## 🛠 Công Nghệ Sử Dụng

* **Core:** ReactJS (Functional Components, Hooks).
* **Build Tool:** Vite (Tốc độ khởi động và build cực nhanh).
* **Styling:** CSS thuần (Custom CSS với Flexbox/Grid).
* **HTTP Client:** Fetch API (Kết nối RESTful API với Backend).
* **Quản lý State:** React `useState`, `useEffect`, `localStorage`.

---

## ⚙️ Yêu Cầu Cài Đặt (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:

* **Node.js**: Phiên bản 16.0.0 trở lên (Khuyên dùng bản LTS mới nhất).
* **Trình quản lý gói**: `npm` (thường đi kèm với Node.js) hoặc `yarn`.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy (Dành riêng cho Frontend)

Thực hiện lần lượt các bước sau:

### Bước 1: Clone mã nguồn về máy
Mở Terminal (hoặc Git Bash, CMD) và chạy lệnh:
```bash
git clone https://github.com/kastnew/OOP_BTL.git
cd OOP_BTL
```
---

### Bước 2: Cài đặt thư viện (Dependencies)
Chạy lệnh sau để tải các gói thư viện cần thiết (nằm trong package.json):

```bash
npm install
# Hoặc nếu dùng yarn:
yarn
```
---
### Bước 3: Cấu hình kết nối Backend
Mở file src/utils/config.js trong trình biên tập code (VS Code). Đảm bảo biến API_BASE_URL trỏ đúng về địa chỉ mà Backend của bạn đang chạy (mặc định Spring Boot là cổng 8080).

```JavaScript

// src/utils/config.js
export const API_BASE_URL = "http://localhost:8080"; 
export const CURRENT_USER_ID = 1; // ID người dùng mặc định do chưa phát triển thêm
```
---
### Bước 4: Chạy ứng dụng
Khởi động server phát triển (Development Server):

```Bash

npm run dev
```
Sau khi chạy lệnh, Terminal sẽ hiển thị đường dẫn (thường là http://localhost:5173 hoặc http://localhost:3000). Hãy truy cập đường dẫn đó trên trình duyệt để sử dụng ứng dụng.

---
## 📂 Cấu Trúc Thư Mục

```bash
src/
├── components/      # Các thành phần tái sử dụng (CalendarPicker, Navbar...)
├── pages/           # Các trang chính (Dashboard, Activities, Reports...)
├── utils/           # Các file cấu hình chung (config.js)
├── App.jsx          # Component gốc và định tuyến (Routing)
├── main.jsx         # Điểm khởi chạy React
└── index.css        # CSS toàn cục

```

---
## 👥 Các Thành Viên Của Nhóm
Dự án này được thực hiện bởi Nhóm 5 Sinh Viên bao gồm: 

 * Mai Xuân Đại - 202416149

 * Phạm Duy Hiếu - 202400044

 * Phạm Trung Kiên - 202416252

 * Vũ Trung Kiên - 202416254

 * Thái Hùng Lân - 202416261

Cảm ơn bạn đã quan tâm đến dự án của chúng tôi!

---
