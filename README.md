# Phần mềm Quản lý Đảng viên (QLĐV)

Hệ thống Quản lý Đảng viên (QLĐV) là một ứng dụng Web gọn nhẹ, hoạt động dựa trên sự kết hợp giữa **Google Sheets** (Lưu trữ cơ sở dữ liệu), **Google Apps Script** (Xử lý backend logic & APIs), và **HTML/CSS/JS** (Giao diện người dùng). Mã nguồn được quản lý phiên bản và lưu trữ trên **GitHub**.

---

## 🌟 Tính năng nổi bật

1. **Dashboard thống kê trực quan:**
   - Cung cấp các chỉ số KPI tổng quan (Tổng số đảng viên, Đảng viên nữ, Trình độ Đại học trở lên, Số lượng đơn vị).
   - Biểu đồ phân tích động hiển thị cơ cấu giới tính và phân bổ nhân sự theo từng đơn vị phòng ban (sử dụng **Chart.js**).
   
2. **Quản lý Hồ sơ Đảng viên (CRUD):**
   - Xem danh sách đảng viên với các tính năng: tìm kiếm thông tin nhanh, lọc đa điều kiện theo Đơn vị và Giới tính.
   - Hỗ trợ phân trang (Pagination) để tối ưu hiển thị khi danh sách dữ liệu lớn.
   - Thêm mới, sửa đổi thông tin hoặc xóa hồ sơ thông qua các Form dạng Modal hiện đại.

3. **Nhập dữ liệu từ File Excel (Import Excel):**
   - Sử dụng thư viện **SheetJS (xlsx.full.min.js)** để đọc và phân tích file Excel ngay dưới trình duyệt (Client-side).
   - **Xác thực dữ liệu thông minh:** Tự động phát hiện các dòng lỗi (ví dụ: thiếu thông tin bắt buộc, trùng mã đảng viên trong hệ thống) và bôi đỏ cảnh báo trực quan trước khi đồng bộ.
   - Tối ưu hóa đẩy dữ liệu theo lô (Batch Processing) xuống Google Sheets để tăng tốc độ xử lý nhanh hơn gấp 10 lần.

4. **Báo cáo & Xuất bản:**
   - Lọc báo cáo đa chiều theo Đơn vị, Giới tính, Trình độ chuyên môn.
   - Xuất dữ liệu báo cáo ra file Excel hoặc in ấn/xuất file PDF trực tiếp từ trình duyệt.

5. **Giao diện hiện đại (UI/UX):**
   - Sử dụng tông màu Đỏ cờ - Vàng Gold đồng bộ và trang trọng.
   - Tích hợp tính năng **Dark Mode** tự động lưu cấu hình theo sở thích người dùng.
   - Hệ thống Toast thông báo mượt mà ở góc màn hình để phản hồi kết quả thao tác.

---

## 🛠️ Hướng dẫn Thiết lập & Triển khai

### Bước 1: Chuẩn bị Cơ sở dữ liệu (Google Sheets)
1. Tạo một bảng tính Google Sheets mới trên tài khoản Google của bạn.
2. Lấy **Spreadsheet ID** từ thanh địa chỉ trình duyệt.
   *(Ví dụ: URL là `https://docs.google.com/spreadsheets/d/1RrJHVmp5A_jL9BVq1vgXkBeORNU59OaFz3-rkU8BJKY/edit` thì ID là `1RrJHVmp5A_jL9BVq1vgXkBeORNU59OaFz3-rkU8BJKY`)*.

### Bước 2: Thiết lập Backend (Google Apps Script)
1. Trong Google Sheet của bạn, chọn **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
2. Copy toàn bộ nội dung của tệp `Code.gs` và dán vào trình soạn thảo code của Apps Script.
3. Thay thế giá trị của hằng số `SPREADSHEET_ID` ở dòng số 9 bằng ID bảng tính của bạn:
   ```javascript
   const SPREADSHEET_ID = "ID_BANG_TINH_CUA_BAN";
   ```
4. Tạo thêm một tệp mới dạng HTML trong Apps Script và đặt tên là `Index` (hệ thống sẽ tự động thêm đuôi `.html`).
5. Copy toàn bộ nội dung của tệp `Index.html` và dán vào tệp `Index.html` vừa tạo trên Apps Script.

### Bước 3: Triển khai ứng dụng Web (Deploy Web App)
1. Ở góc trên bên phải giao diện Apps Script, chọn **Triển khai** (Deploy) -> **Triển khai mới** (New deployment).
2. Chọn loại cấu hình là **Ứng dụng web** (Web app).
3. Thiết lập các thông số:
   - **Mô tả:** Phiên bản nâng cấp giao diện và tối ưu Excel.
   - **Thực thi dưới danh nghĩa (Execute as):** Tôi (Tài khoản Google của bạn).
   - **Ai có quyền truy cập (Who has access):** Bất kỳ ai (Anyone) hoặc Chỉ mình tôi (Only myself) tùy thuộc vào nhu cầu phân quyền bảo mật của bạn.
4. Bấm **Triển khai** (Deploy). 
5. Cấp quyền truy cập cho ứng dụng nếu được Google yêu cầu. Sau khi hoàn thành, bạn sẽ nhận được một đường link **URL ứng dụng web**. Hãy lưu lại link này để truy cập sử dụng phần mềm.

---

## 📖 Hướng dẫn Sử dụng Chi tiết

### 1. Xem Thống kê tại Dashboard
- Sau khi đăng nhập, hệ thống sẽ mở tab **Dashboard** hiển thị các con số tổng quát.
- Biểu đồ phân bổ đảng viên theo đơn vị và tỉ lệ giới tính sẽ tự động vẽ dựa trên cơ sở dữ liệu hiện tại trong Google Sheet của bạn.
- Nhấn switch **Dark Mode** ở góc phải thanh menu nếu bạn muốn chuyển sang giao diện tối.

### 2. Quản lý Hồ sơ
- Chọn tab **Quản lý Hồ sơ** trên thanh điều hướng.
- **Tìm kiếm:** Gõ tên, mã hoặc quê quán vào thanh tìm kiếm để lọc nhanh thông tin đảng viên.
- **Lọc:** Sử dụng danh sách đơn vị hoặc giới tính để lọc sâu.
- **Thêm mới:** Nhấp **Thêm Đảng Viên**, điền đầy đủ các thông tin cá nhân và thông tin công tác trong Modal rồi nhấn **Thêm mới**.
- **Xem chi tiết:** Nhấn nút biểu tượng mắt trên dòng đảng viên để xem chi tiết lý lịch.
- **Chỉnh sửa:** Nhấn nút biểu tượng bút chì để chỉnh sửa thông tin đảng viên. Mã Đảng viên là duy nhất nên sẽ không thể chỉnh sửa trong chế độ sửa.
- **Xóa:** Nhấn nút biểu tượng thùng rác và xác nhận để xóa đảng viên khỏi cơ sở dữ liệu.

### 3. Nhập dữ liệu hàng loạt từ Excel
- Chọn tab **Nhập liệu Excel**.
- Kéo thả file Excel của bạn vào vùng chứa nét đứt hoặc nhấn **Chọn File** để tải lên.
- **Lưu ý cấu trúc cột trong Excel:** Đảm bảo file Excel có chứa các cột thông tin giống như thứ tự: *Mã Đảng viên, Họ và Tên, Ngày Sinh, Giới Tính, Quê Quán, Trình Độ Chuyên Môn, Chức Vụ Hiện Tại, Đơn Vị Công Tác*.
- Sau khi đọc xong, hệ thống sẽ hiển thị bảng xem trước (Preview):
    - Dòng hiển thị màu trắng/xanh: Dữ liệu hợp lệ.
    - Dòng hiển thị màu đỏ nhạt: Dữ liệu có lỗi (ví dụ: thiếu thông tin bắt buộc, trùng mã đảng viên đã có sẵn). 
- Nhấn nút **Lưu vào hệ thống** để tiến hành ghi dữ liệu xuống Google Sheets. Tiến trình import sẽ được cập nhật liên tục qua thanh trạng thái.

### 4. Tạo Báo cáo & Xuất bản
- Chọn tab **Báo cáo & In ấn**.
- Chọn các tiêu chí lọc cần xuất báo cáo (Đơn vị, Giới tính, Trình độ).
- Nhấp **Xem báo cáo** để tổng hợp dữ liệu và tạo bảng xem trước.
- **Xuất Excel:** Nhấp **Xuất Excel** để tải báo cáo dạng file Excel về máy.
- **In/Xuất PDF:** Nhấp **In / Xuất PDF** để mở hộp thoại in của trình duyệt (giao diện in đã được thiết kế tối ưu, tự động ẩn thanh điều hướng, nút bấm, hiển thị rõ ràng thông tin ký tên và lập biểu).

---

## 💾 Quản lý mã nguồn (Git Workflow)
Để cập nhật mã nguồn lên kho lưu trữ GitHub, sử dụng các câu lệnh Git tiêu chuẩn:
```bash
# Kiểm tra trạng thái thay đổi
git status

# Thêm tất cả thay đổi vào hàng đợi
git add .

# Ghi nhận thay đổi với thông điệp rõ ràng
git commit -m "feat: cập nhật hướng dẫn sử dụng và hoàn thiện giao diện"

# Đẩy mã nguồn lên GitHub nhánh main
git push -u origin main
```
