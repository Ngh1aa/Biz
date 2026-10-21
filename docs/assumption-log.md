# Giả định cần xác nhận

| Quyết định | Trạng thái | Cách xác nhận |
|---|---|---|
| Giáo vụ chỉ xem tên/mã/trường trong hồ sơ, vẫn được nhập intake | Theo quyền trong văn bản; mâu thuẫn GV03 được giải quyết theo rule phân quyền | Xác nhận owner nghiệp vụ |
| Duyệt tuần tự TBM rồi Giáo vụ | Giả định từ tiến trình 1/2 | Xác nhận quy trình thật |
| Duyệt vòng 1 và vòng 2 đều phải xong mới Đã duyệt | Working rule | Kiểm tra với owner |
| Học phí mẫu 150.000đ/buổi | Synthetic, không phải biểu phí thật | Thay bằng cấu hình được trung tâm cấp |
| Khóa tích lịch theo giờ địa phương Asia/Bangkok lúc 0h | Theo brief; dữ liệu ngày mẫu có cơ chế ca khóa riêng | Backend timezone/clock cần xác nhận khi triển khai |
| Danh sách 11 môn | Synthetic, có thể đổi trong data owner | Cần danh mục chính thức |
| Màn Giám đốc/Admin/Trưởng phòng | Chưa có trong phạm vi | Cần đặc tả riêng |
| Dữ liệu file đính kèm | Metadata lưu cục bộ, không upload; scan mẫu mở preview mô phỏng | Cần backend/storage/ACL thật |
| Review usability | Chỉ agent heuristic walkthrough và browser checks | Chưa có người dùng thật |
