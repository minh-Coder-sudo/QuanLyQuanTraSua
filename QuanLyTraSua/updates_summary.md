# 📜 Nhật ký Phát triển Dự án Tea Mango (Toàn diện)

Tài liệu này ghi lại toàn bộ các bước tiến hóa của ứng dụng Quản lý Trà sữa Tea Mango, từ một giao diện sơ khai đến một hệ thống quản trị và bán hàng chuyên nghiệp.

---

## 🏛️ Giai đoạn 1: Hoàn thiện Nền tảng & Cấu trúc Dữ liệu
- **Đồng bộ Logic "Món Hot"**: Thiết lập logic tự động gợi ý món HOT dựa trên lượt yêu thích (Likes).
- **Làm giàu Dữ liệu (Seed Data)**: Bổ sung dữ liệu mẫu để đảm bảo mỗi danh mục đều có ít nhất 5 món thực tế.
- **Chuẩn hóa Database**: Khắc phục lỗi thiếu cột **Size** và các trường thông tin quan trọng (`toppings`, `sugarLevels`, `iceLevels`) để khớp với yêu cầu giao diện.

## 🎨 Giai đoạn 2: Sửa lỗi Giao diện (UI/UX) & Điều hướng
- **Khắc phục lỗi Tab rỗng**: Sửa lỗi trang Trà sữa, Trà trái cây và Đá xay không hiển thị món ăn.
- **Tinh chỉnh Header/Footer**: 
    - Cố định Footer chỉ nằm trên một hàng (Giới thiệu).
    - Khắc phục lỗi Header đè lên nội dung Admin.
- **Giao diện Admin sơ khai**: Xây dựng bảng quản lý sản phẩm với đầy đủ cột thông tin và tính năng lọc.

## 🛡️ Giai đoạn 3: Bảo mật & Phân quyền Admin
- **Giải quyết lỗi 403 Forbidden**: Tinh chỉnh `authMiddleware` và Token để đảm bảo tài khoản Admin có quyền quản trị tuyệt đối.
- **Chuẩn hóa Tài khoản Quản trị**: 
    - Email: `admin@teamango.com` 
    - Password: `admin123`
- **Hệ thống Toast thông báo**: Thêm các thông báo lỗi bảo mật (Nhắc nhở người dùng đăng xuất và đăng nhập lại khi Token hết hạn).

## 🚀 Giai đoạn 4: Đột phá Hệ thống Bán hàng (POS System)
- **POS Dashboard**: Xây dựng giao diện chọn món và tính tiền nhanh tại quầy (SalesDashboard).
- **Tùy biến Sản phẩm**: Cho phép khách hàng chọn Size, Topping, Đường, Đá một cách linh hoạt.
- **Hệ thống Đơn hàng (Orders)**: Xây dựng bộ điều khiển riêng để lưu trữ lịch sử bán hàng và in hóa đơn ảo.
- **Thống kê Doanh thu (Statistics)**: 
    - Biểu đồ doanh thu 7 ngày gần nhất.
    - Phân tích biểu đồ Top sản phẩm bán chạy nhất (Best Seller).

## 🔧 Giai đoạn 5: Tối ưu hóa & Hoàn thiện Cuối cùng
- **Sửa lỗi dãn thẻ Card**: Đảm bảo các sản phẩm hiển thị gọn gàng, không bị tràn màn hình.
- **Kích hoạt Giá âm (Discount S)**: Hỗ trợ tính năng giảm giá cho Size nhỏ bằng cách cho phép nhập giá âm (`-5000đ`).
- **Giao diện Quản trị Tập trung**: Tích hợp tất cả các tab (Bán hàng, Sản phẩm, Danh mục, Đơn hàng, Thống kê) vào một Sidebar Duy nhất.

---
**🏆 Trạng thái Dự án:** Hoàn thành các mục tiêu cốt lõi của hệ thống Quản lý Bán hàng tại quầy. 
**📅 Ngày hoàn tất tổng kết:** 05/04/2026

## 📖 Hướng dẫn Triển khai dự án trên Máy mới

Để chạy dự án này trên một máy tính mới, hãy làm theo các bước sau:

### 1. Yêu cầu chuẩn bị
- Cài đặt **Node.js** (Phiên bản v16 trở lên).
- Cài đặt **MongoDB** (Hoặc sử dụng MongoDB Atlas).

### 2. Cài đặt Backend
1. Truy cập thư mục `backend/`.
2. Mở tệp `.env` và cấu hình:
    ```env
    MONGO_URI=mongodb://localhost:27017/tea_mango
    JWT_SECRET=teamango_secret_key
    PORT=5000
    ```
3. Chạy lệnh: `npm install`
4. **Khởi tạo dữ liệu mẫu**: Chạy lệnh `node seed.js`. 
   > *Lưu ý: Bước này sẽ tạo tài khoản Admin (`admin@teamango.com` / `admin123`) và 20+ món trà sữa.*
5. Khởi động Backend: `npm run dev`

### 3. Cài đặt Frontend
1. Truy cập thư mục gốc (Ngoài thư mục `backend/`).
2. Chạy lệnh: `npm install`
3. Khởi động Frontend: `npm run dev`

### 4. Truy cập hệ thống
- **Trang chủ khách hàng**: `http://localhost:5173`
- **Trang Quản trị (Admin)**: `http://localhost:5173/admin/products` 
  > *(Đăng nhập bằng tài khoản admin ở Bước 2)*
