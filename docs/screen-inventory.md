# Danh mục màn hình UX v0.5

55 route, 82 role-visible views. SCREEN_META và renderer là nguồn chức năng.

| ID | Nhiệm vụ | Family |
|---|---|---|
| PH01 | Đồng hành cùng con: Lịch gần nhất và thông tin của con | Overview |
| PH02 | Lịch học của con: Lịch tuần và kết quả điểm danh | Schedule |
| PH02b | Chi tiết buổi học: Thời gian, giáo viên và xin nghỉ | List/record/state |
| PH03 | Kết quả học tập: Báo cáo đã được trung tâm duyệt | List/record/state |
| PH03b | Báo cáo của con: Chuyên cần, kết quả và kế hoạch học tập | List/record/state |
| PH04 | Học phí của con: Thông báo và trạng thái thu | List/record/state |
| PH04b | Chi tiết học phí: Các khoản do trung tâm lập | List/record/state |
| PH05 | Trao đổi với trung tâm: Hội thoại về các con được liên kết | List/record/state |
| PH05b | Hội thoại phụ huynh: Trao đổi với người phụ trách | Conversation |
| PH05c | Soạn tin cho trung tâm: Giáo vụ hoặc giáo viên của con | Form/selection sheet |
| PH06 | Yêu cầu xin nghỉ: Theo dõi phản hồi của Giáo vụ | List/record/state |
| PH06a | Gửi xin nghỉ: Chọn buổi học và ghi rõ lý do | Form/selection sheet |
| PH06b | Chi tiết xin nghỉ: Trạng thái, phản hồi và lịch sử | List/record/state |
| PH07 | Gia đình và hỗ trợ: Con liên kết và đầu mối liên hệ | List/record/state |
| A00 | Đăng nhập: Tài khoản do trung tâm cấp | Form/selection sheet |
| GV01 | Tổng quan: Việc cần xử lý và lịch trong ngày | Overview |
| GV02 | Học sinh: Tìm kiếm, lọc và mở hồ sơ | List/record/state |
| GV03 | Hồ sơ học sinh: Thông tin học sinh và các môn đăng ký học | List/record/state |
| GV04 | Tiếp nhận học sinh: Bước 1 · Thông tin học sinh | Form/selection sheet |
| GV04b | Phụ huynh: Bước 2 · Thông tin liên hệ | Form/selection sheet |
| GV04c | Kiểm tra đầu vào: Bước 3 · Kết quả kiểm tra và nhận xét | Form/selection sheet |
| GV05 | Xếp lớp: Học sinh → môn → giáo viên → lịch | Form/selection sheet |
| GV05-s1 | Chọn môn: Danh sách 11 môn | Form/selection sheet |
| GV05-s2 | Chọn giáo viên: Lọc theo bộ môn | Form/selection sheet |
| GV05-s3 | Ngày bắt đầu: Không chọn ngày đã qua | Form/selection sheet |
| GV06 | Đổi giáo viên: Điều chỉnh giáo viên và lịch | Form/selection sheet |
| GV06b | Đổi lịch học: Đổi ca học hằng tuần | Form/selection sheet |
| GV06c | Ngừng học: Lưu lý do và ngày có hiệu lực | Form/selection sheet |
| GV07 | Duyệt báo cáo: Vòng duyệt Giáo vụ | List/record/state |
| GV08 | Học phí tháng: Tạo và cập nhật trạng thái thu | List/record/state |
| GV09 | Giao việc: Gửi nhiệm vụ cho giáo viên | Form/selection sheet |
| GV10 | Điểm danh & xin nghỉ: Yêu cầu từ giáo viên và phụ huynh | List/record/state |
| GV11 | Tài khoản: Vai trò, bộ môn và trạng thái | List/record/state |
| TBM01 | Duyệt bộ môn: Duyệt vòng 1 trước Giáo vụ | List/record/state |
| TC01 | Tổng quan: Ca dạy và việc cần hoàn thành | Overview |
| TC01b | Thống kê: 9 chỉ số theo tháng | List/record/state |
| TC02 | Lịch dạy: Bảng tuần theo ngày × ca | Schedule |
| TC02b | Lịch theo ngày: Lịch theo ngày hoặc từng học sinh | Schedule |
| TC03 | Điểm danh: Có mặt / Vắng trước giờ khóa | List/record/state |
| TC03b | Ca đã khóa: Chỉ xem và yêu cầu sửa | List/record/state |
| TC03c | Buổi học bổ sung: Dạy thay hoặc học bù | Form/selection sheet |
| TC04a | Học sinh: Danh sách học sinh phụ trách | List/record/state |
| TC04 | Hồ sơ học sinh: Lịch, đánh giá và báo cáo | List/record/state |
| TC04b | Đánh giá năng lực: 8 tiêu chí theo thang M1–M4 | List/record/state |
| TC05 | Báo cáo: Trạng thái và hạn nộp | List/record/state |
| TC05b | Xem báo cáo: Tiến trình duyệt hai vòng | List/record/state |
| TC05c | Lập báo cáo: Chuyên cần tổng hợp từ điểm danh | Form/selection sheet |
| TC05d | Bổ sung báo cáo: Nội dung cần bổ sung và lịch sử gửi | Form/selection sheet |
| TC05w | Nhập từ Excel: Nhập hàng loạt trên web | Form/selection sheet |
| TC06 | Công việc: Công việc được giao và tiến độ thực hiện | List/record/state |
| TC06b | Chi tiết công việc: Trao đổi, cập nhật và lịch sử | List/record/state |
| TC06c | Gửi kết quả: Bàn giao cho người giao việc xác nhận | Form/selection sheet |
| TC07 | Trao đổi: Tin nhắn và thông báo chung | List/record/state |
| TC07b | Hội thoại: Tin nhắn, tệp đính kèm và trạng thái đã xem | Conversation |
| TC07c | Soạn tin: Chọn người nhận và gửi | Form/selection sheet |
