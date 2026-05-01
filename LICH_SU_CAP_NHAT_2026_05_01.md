# 📝 Nhật ký Cập nhật Hệ thống Tea Mango (01/05/2026)

Tài liệu này ghi lại chi tiết các lỗi đã khắc phục và các tính năng mới đã được triển khai sau khi thực hiện `git pull` và đồng bộ hóa hệ thống.

---

### 1. 🛡️ Hệ thống Tài khoản & Phiên làm việc (Session)
- **Sửa lỗi Reload (F5)**: Khắc phục hiện tượng bị đẩy về trang chủ khi nhấn F5 tại trang Admin. Đã thêm trạng thái `loading` vào `App.jsx` để chờ nạp dữ liệu User từ localStorage.
- **Lưu trạng thái Tab**: Tích hợp `URLSearchParams` vào trang Quản lý. Bây giờ khi bạn nhấn F5, trình duyệt sẽ giữ đúng Tab bạn đang xem (Sản phẩm, Đơn hàng, Thống kê) thông qua tham số `?view=...`.
- **Trải nghiệm đăng nhập**: Loại bỏ thông báo `alert()` dư thừa, hệ thống sẽ chuyển thẳng vào trang chủ ngay sau khi đăng nhập thành công.

### 2. 🛒 Giỏ hàng & Sản phẩm
- **Gộp món thông minh**: Sửa lỗi thêm 2 món giống nhau bị tách thành 2 dòng. Bây giờ hệ thống sẽ tự động tăng số lượng (`qty`) nếu cùng sản phẩm, cùng Size và Topping.
- **Đồng bộ dữ liệu**: Sửa lỗi lệch tên trường giữa `productId` và `_id`, giúp `cartStore` nhận diện chính xác sản phẩm.
- **Sửa lỗi giao diện**: 
  - Khắc phục lỗi thiếu `key` trong danh sách giỏ hàng.
  - Sửa logic nút "Xóa món" để xóa đúng vị trí món đã chọn (không xóa nhầm món trùng ID).
  - Khắc phục lỗi `toLocaleString()` gây trắng trang khi dữ liệu bị rỗng.

### 3. 🧾 Quản lý Đơn hàng (Admin)
- **Sửa lỗi 500 (Internal Server Error)**: Bổ sung lại trường `user` vào Model `Order` bị mất sau khi pull mã nguồn.
- **Lưu vết người đặt**:
  - **Khách hàng**: Đơn hàng COD và PayOS hiện đã lưu đúng ID của khách hàng đặt.
  - **Admin/Staff**: Đơn hàng bán tại quầy (POS) hiện đã lưu ID của nhân viên thực hiện giao dịch.
- **Hiển thị**: Thêm cột **"Khách hàng"** vào danh sách đơn hàng để Admin dễ dàng quản lý.

### 4. 📊 Thống kê & Doanh thu
- **Sửa lỗi doanh thu 0đ**: Khắc phục việc Backend không đọc được trường `totalPrice` cũ. Đã cập nhật logic tự động tính toán tổng tiền từ danh sách món ăn nếu đơn hàng thiếu trường tổng.
- **Thống kê thời gian thực**: Cập nhật để tính toán cả các đơn hàng `PENDING` (đang xử lý), giúp Admin thấy được doanh thu ngay lập tức khi có đơn mới.
- **Sửa lỗi Best Seller**: Đồng bộ tên trường `qty` và `price` trong các lệnh truy vấn thống kê.

### 5. ✨ Tính năng mới: Đơn hàng của tôi
- **Giao diện**: Thêm mục **"Đơn hàng của tôi"** vào menu thả xuống của tài khoản.
- **Chức năng**: Tạo trang `MyOrders.jsx` riêng biệt cho khách hàng xem lại lịch sử các món họ đã đặt với giao diện trực quan, rõ ràng.
- **Bảo mật**: Xây dựng API Backend riêng (`/api/orders/my-orders/:userId`) để đảm bảo khách hàng chỉ thấy đơn hàng của chính mình.
