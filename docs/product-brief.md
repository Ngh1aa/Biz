# Minh Hoàng · UX redesign

## Mục tiêu và nguồn
Yêu cầu hiện tại: thiết kế lại toàn bộ UX đang yếu bằng workflow uiux-ai-workspace. Nguồn chức năng là 55 route trong SCREEN_META, các module màn hình, dữ liệu và kiểm thử hiện có tại f649a8b. Giữ Minh Hoàng, tiếng Việt giáo dục, bốn vai trò và các quy tắc nghiệp vụ; không giữ bố cục cũ chỉ vì đã có.

## Người dùng và công việc
- Giáo vụ xử lý tiếp nhận, xếp lớp, duyệt, học phí và điều chỉnh trong ngày. Cần thấy hàng chờ và đúng hồ sơ, tránh chọn sai người. Hiện dùng các màn trong prototype; thực tế vận hành ngoài prototype UNKNOWN.
- Giáo viên mở lịch trên điện thoại, điểm danh và báo cáo. Cần nhận ra ca cần xử lý và hạn khóa, không mất nội dung khi quay lại.
- Trưởng bộ môn vừa dạy vừa duyệt vòng một. Cần phân biệt chờ mình và chờ Giáo vụ.
- Phụ huynh xem lịch, kết quả đã công bố, học phí và xin nghỉ theo từng con. Cần luôn thấy đang xem ai, ai tiếp nhận yêu cầu và cách liên hệ.

JTBD: Khi bắt đầu ngày, tôi muốn biết việc cần xử lý để mở đúng màn. Khi tìm học sinh, tôi muốn lọc theo trạng thái và mở đúng hồ sơ. Khi nhập liệu dài, tôi muốn biết từng nhóm thông tin và lỗi cần sửa. Khi theo dõi con, tôi muốn chuyển con mà không lẫn báo cáo hay học phí.

## Ràng buộc
Buildless ESM, renderer và localStorage hiện hữu, hash routes /Biz/, không thêm framework/dependency. Blue #253a7e là nhận diện, orange dùng cảnh báo, yellow chỉ nhấn có mục đích. Google Sans Flex tự lưu, Feather icons có nhãn. Không thêm ảnh stock, số liệu tiến bộ hay backend giả. GitHub Pages là bản trải nghiệm; xác minh công bố riêng.

## Kết quả kiểm tra được
55 route không mất; 360/390/768/1440 không tràn ngang; menu không che nội dung; trường/CTA chính tối thiểu 56px, mục điều hướng có nhãn đọc được; giữ domain tests, 7 staff journeys, Excel và parent scope. Kiểm thực tế hình chụp ba family: tổng quan, chọn hồ sơ, biểu mẫu; sau đó rà tất cả màn. Không gán giảm thời gian tác vụ hoặc tăng hài lòng khi chưa có người dùng thật.

## Scope
Toàn bộ shell, thành phần, bố cục và nội dung hướng dẫn của 55 màn; tổng quan theo vai trò, danh sách, lịch, hồ sơ, biểu mẫu, duyệt, tài chính, nhắn tin. Không mở rộng nghiệp vụ, auth, payment, native hoặc cloud sync. Dữ liệu, quyền và transition hiện hữu phải giữ.

## UX walkthrough trước visual
| Family | Vào từ / câu hỏi | Ưu tiên | Hành động và đích | Phản hồi / khôi phục |
|---|---|---|---|---|
| Tổng quan | Đầu ngày / làm gì trước? | Người dùng, hàng chờ có số, ca hôm nay, tác vụ khác | Mở ca TC03 hoặc hàng chờ GV07/GV10 | Dữ liệu cập nhật cùng store; rỗng có đích đến |
| Lựa chọn | GV02/TC04a / đúng học sinh nào? | Tên màn, tìm kiếm, trạng thái, thuộc tính, số kết quả | Mở GV03/TC04 với ID | Không kết quả có xóa lọc; Back giữ filter |
| Biểu mẫu | GV04 / cần điền gì, đang ở bước nào? | Back, bước 1/3, hướng dẫn, nhóm nhận diện, học tập, liên hệ | Tiếp tục GV04b rồi GV04c/GV05 | Validation giữ giá trị; draft lưu theo flow |
| Bản ghi | TC05b/PH06b / trạng thái và ai xử lý? | Người/đối tượng, trạng thái, nội dung, lịch sử, bước tiếp | Gửi/duyệt/trao đổi theo quyền | Chặn sai vòng; lý do bổ sung/reject giữ lại |
| Lịch | TC02/PH02 / có ca nào, mở đâu? | Thời gian, ca, đối tượng, trạng thái | Mở buổi cụ thể | Tuần rỗng trở về tuần này |

Audit từ source và hình: P1 menu đè trường cuối; P1 TC05w menu lệch desktop; P2 chữ nav 9px; P2 header h1 ngang nút Back gây gãy; P2 tổng quan đặt nhiều số ngang cấp trước việc; P2 trường read-only chiếm nhịp nhập; P2 lịch tuần chật. Thực hiện sửa nguyên nhân và retest các trạng thái đó. Đây là agent heuristic, không có người tham gia nghiên cứu.
