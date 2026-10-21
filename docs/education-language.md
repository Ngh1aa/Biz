# Ngôn ngữ giao diện Biz — V0.3

## Phạm vi và cơ sở lựa chọn

Yêu cầu: nghiên cứu và sửa toàn bộ ngôn ngữ trình bày của ứng dụng theo nghiệp vụ giáo dục. Rà soát 41 mã màn hình, ba vai trò, điều hướng, hướng dẫn nhập liệu, trạng thái, hộp thoại, thông báo, lỗi và mẫu Excel. Giữ nguyên bố cục iOS pastel và trắng đen, tuyến màn hình, quy trình hai bước duyệt và dữ liệu người dùng đã lưu.

Nguồn nghiệp vụ được đọc ngày 21/10/2026:

1. [MISA EMIS — Điểm danh cho học sinh](https://helpemis.misa.vn/kb/447/): dùng “điểm danh” cho thao tác ghi nhận tình hình đi học; “chuyên cần” là thông tin tổng hợp. Biz chỉ hỗ trợ Có mặt/Vắng, nên không thêm trạng thái Có phép/Không phép từ sản phẩm tham khảo.
2. [MISA EMIS — Nhận xét trong quá trình học tập](https://helpigov.misa.vn/khoan-thu/kb/13140/): nhận xét gắn với quá trình học tập và rèn luyện. Chuyển thành hướng dẫn viết nhận xét về tiến bộ, kiến thức đã nắm, phần cần luyện tập.
3. [MISA EMIS — Quy trình lập đợt thu](https://helpemis.misa.vn/kb/8637/): phân biệt lập đợt thu, thông báo thu tiền và ghi nhận thu. Dùng “Học phí”, “Lập học phí tháng”, “Ghi nhận đã thu” để phản ánh đúng chức năng hiện có.
4. [MISA EMIS — Danh sách học sinh](https://helpemis.misa.vn/kb/8284/): “hồ sơ học sinh”, “danh sách học sinh”, “xếp lớp” là những cách gọi nghiệp vụ có thể tham khảo.
5. Văn bản và design system người dùng cung cấp: giữ vai trò Giáo vụ/Giáo viên/Trưởng bộ môn, 8 tiêu chí, các mức M1–M4 và chức năng sẵn có.

Nguồn bên ngoài là bằng chứng về cách dùng từ trong phần mềm giáo dục, không phải quy định vận hành của trung tâm Biz. Đây là rà soát chuyên gia dựa trên tài liệu và ứng dụng; chưa có phỏng vấn hay kiểm thử với nhân sự trung tâm.

## Quy ước dùng từ

| Khái niệm | Cách gọi trên giao diện | Lý do và giới hạn |
|---|---|---|
| Ghi nhận học sinh đi học | Điểm danh | Tránh “tích lịch”; phân biệt với đổi lịch học |
| Kết quả của một học sinh trong buổi học | Có mặt / Vắng | Giữ hai lựa chọn hiện có; không bổ sung nghiệp vụ chưa triển khai |
| Tổng hợp số buổi học | Chuyên cần | Lấy từ sổ điểm danh, không nhập đè từ Excel |
| Đưa học sinh vào môn, giáo viên và ca học | Xếp lớp | Hiện tại không có chức năng tạo một thực thể lớp độc lập |
| Kết thúc theo học một môn | Ngừng học | Phân biệt với vắng một buổi; nêu rõ môn và ngày áp dụng |
| Trở lại sau ngừng học | Tiếp nhận học trở lại | Hồ sơ chuyển sang Chờ xếp lớp, chưa mặc nhiên có lịch mới |
| Thay đổi phân công | Đổi giáo viên | Không dùng viết tắt GV trong nhãn thao tác |
| Thay đổi ngày/ca | Đổi lịch học | Phân biệt với điều chỉnh điểm danh |
| Buổi học bù hoặc dạy thay | Buổi học bổ sung | Hình thức tổ chức vẫn là Học bù/Dạy thay |
| Bài khảo sát khi tiếp nhận | Kiểm tra đầu vào | Dùng tiếng Việt thay “test”; tệp là bản chụp bài kiểm tra |
| Nội dung báo cáo đang soạn | Bản nháp | Cùng cách gọi trong bộ lọc, trạng thái và thao tác lưu |
| Báo cáo bị trả về | Cần bổ sung | Nêu phần cần bổ sung; CTA “Bổ sung và gửi lại” |
| Báo cáo đang xét duyệt | Chờ bộ môn / Chờ giáo vụ | Nêu người xử lý tiếp theo thay cho chỉ số 0/2, 1/2 riêng lẻ |
| Nhận xét tháng | Nhận xét kết quả học tập | Hướng dẫn nêu tiến bộ, phần đã nắm được, phần cần rèn |
| Hoạt động tiếp theo | Kế hoạch hỗ trợ tháng tới | Nêu mục tiêu, nội dung ôn tập và cách hỗ trợ học sinh |
| Theo dõi khoản cần đóng | Học phí | Không gọi là hóa đơn khi chưa có chức năng phát hành hóa đơn |
| Công việc đang xử lý | Đang thực hiện | Tránh ngôn ngữ quản lý ticket trên giao diện người dùng |
| Công việc đã được xác nhận | Đã hoàn thành | Giữ ý nghĩa đã được người giao việc xác nhận |
| Tệp và nhập nhiều báo cáo | Tệp, Nhập từ Excel | Dùng tiếng Việt, giữ tên định dạng Excel/.xlsx/PDF |

Không đổi thang M1 Xây nền/M2 Phát triển/M3 Đạt chuẩn/M4 Vững chắc do người dùng cung cấp thành hệ xếp loại chính thức của Bộ GDĐT. Nhãn nêu đây là thang đánh giá của trung tâm. Tính phù hợp của thang đo, mốc khóa 00:00, thời hạn duyệt 24 giờ, hạn nộp và biểu phí vẫn cần trung tâm xác nhận trước khi dùng thật.

## Giọng điệu và cấu trúc câu

- Tiêu đề nêu rõ nghiệp vụ: Công tác hôm nay, Danh sách học sinh, Lịch giảng dạy, Thống kê giảng dạy.
- CTA dùng động từ và kết quả: Lưu điểm danh, Lưu và xếp lớp, Gửi yêu cầu bổ sung, Ghi nhận đã thu.
- Lỗi nêu vấn đề và cách sửa; ví dụ “Số điện thoại cần có 10 chữ số, bắt đầu bằng 0”.
- Yêu cầu bổ sung tập trung vào nội dung, tránh phán xét học sinh hoặc giáo viên.
- Không ngầm kết luận học sinh học kém hoặc phải học bù chỉ vì số buổi có mặt thấp hơn kế hoạch.
- Bản trải nghiệm phải nói rõ giới hạn lưu tệp, học phí mẫu và tài khoản mẫu khi thao tác liên quan.

## Tương thích dữ liệu

Nhãn hiển thị được chuyển trong `src/ui.js`; các giá trị lưu như `Làm lại`, `Đã nghỉ`, `Đang làm`, `Đã đóng`, `Có` và giá trị bộ lọc được giữ để bản đã dùng trước đây tiếp tục hoạt động. Không sửa lời nhận xét, tin nhắn, lý do do người dùng nhập hoặc lịch sử cũ đã ghi.

Mẫu Excel mới dùng cột “Kế hoạch hỗ trợ tháng tới”. Bộ nhập vẫn nhận cột “Định hướng tháng sau” từ mẫu cũ; các cột bắt buộc và dữ liệu chuyên cần không thay đổi.

## Bằng chứng kiểm tra

- `npm run check`, `npm test`, `npm run build`.
- `npm run test:browser`: ma trận 41 màn hình × 4 kích thước; các luồng tiếp nhận/xếp lớp, điểm danh/điều chỉnh, báo cáo/hai bước duyệt, công việc, học phí, trao đổi và Excel.
- `tests/browser/copy.cjs`: lập danh mục câu chữ theo ba vai trò; kiểm tra bộ lọc hiển thị mới với giá trị lưu cũ, giữ nguyên nhận xét do giáo viên nhập, hộp thoại theo ngữ cảnh, hồ sơ ngừng học và công việc đã hoàn thành.
- Kiểm tra ảnh chụp điện thoại và máy tính để phát hiện nhãn quá dài, xuống dòng sai hoặc che nội dung. Chỉ số tự động không thay thế nhận xét của người dùng thật.
