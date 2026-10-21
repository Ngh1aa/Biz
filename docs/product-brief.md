# Biz — UX trắng đen

## Nguồn và phạm vi
Nguồn chính: yêu cầu trực tiếp và văn bản người dùng cung cấp ngày 21/10/2026. Ba ảnh là concept reference về visual language, không phải bằng chứng usability. Các nhãn [PDF], [DOCX], [ART] trong văn bản không có file gốc để đối chiếu: UNKNOWN. Repo tại thời điểm bắt đầu chỉ có .gitattributes. Native target và backend: UNKNOWN.

Mục tiêu: nhân sự trung tâm biết việc cần làm tiếp theo và hoàn thành xuyên suốt một flow trong một app. Bản bàn giao là browser prototype, dữ liệu tổng hợp lưu cục bộ; không có xác thực, thanh toán, push, camera hoặc máy chủ thật. Không commit/push/deploy khi chưa có yêu cầu.

## Người dùng và job
- Giáo vụ: tiếp nhận hồ sơ → xếp lớp → điều chỉnh → duyệt → hóa đơn.
- Giáo viên: xem ca → tích lịch → theo dõi học sinh → báo cáo → xử lý công việc.
- Trưởng bộ môn: mọi tác vụ giáo viên và duyệt vòng bộ môn.

## Quyết định UX trước visual
Chọn hub theo vai trò, ưu tiên hàng đợi việc cần xử lý. Học sinh là đối tượng dùng chung giữa các module. Tab có nhãn; hộp thư giáo viên đi từ nút trên đầu trang. Không thêm giao diện cho Giám đốc/Kế toán/Trưởng phòng do brief chưa định nghĩa.

| Family | Câu hỏi đầu vào | Wireframe nội dung | Hành động / feedback / recovery |
|---|---|---|---|
| Tổng quan | Hôm nay cần xử lý gì? | nhận diện → ngày → việc gấp → 2 chỉ số → lịch hôm nay | mở ca/hàng đợi; trạng thái cập nhật từ cùng store; quay về tab |
| Danh sách | Chọn đúng học sinh nào? | tiêu đề + số lượng → tìm → bộ lọc → dòng so sánh | mở hồ sơ; không có kết quả có nút xóa lọc |
| Biểu mẫu | Tôi đang nhập gì, còn bao nhiêu bước? | quay lại → bước → trường có nhãn → trợ giúp/lỗi → CTA đáy | giữ draft khi Back; lỗi inline; confirm trước thay đổi quan trọng |
| Lịch | Ca nào và có thể sửa không? | tuần/ngày → chọn ngày → bảng → chú giải → ca | mở ca; khóa được hiển thị rõ; yêu cầu sửa đi Giáo vụ |
| Duyệt | Ai đang giữ báo cáo? | tháng → tab vòng duyệt → học sinh → nội dung → 2 vòng | duyệt/làm lại với lý do bắt buộc; cùng trạng thái ở GV và TC |

Hai bố cục overview để so sánh: A ưu tiên việc gấp với action-card rộng, metrics phụ bên dưới; B metrics-first với hàng 4 ô và task-list bên dưới. Chọn A vì ca chưa tích phải dễ thấy trước KPI. A dùng headline 30/36, body 14/22, 2 metrics; B title 24/32, body 14/20, 4 metrics. Cả hai monochrome theo yêu cầu. Kiểm tra ba family trước rollout; không suy diễn preference của người thật từ đánh giá agent.

## Visual direction
Tinh thần ảnh 1–2: bo góc 28–32, chữ đậm rõ, card lớn, icon nét, nút chuyển tròn. Ảnh 3: lịch tuần và floating tab. Adapt thành grayscale với nhãn, trạng thái không phụ thuộc màu; không dùng người/3D trang trí khi cần wireframe. Font Manrope hỗ trợ tiếng Việt; 24px gutter, 16px gap, touch 44px. Phone 390×844; trên mobile dùng viewport thật, trên desktop reviewer shell bên ngoài app.

Không dùng palette xanh/cam/vàng của tài liệu trong vòng này vì yêu cầu hiện tại là trắng đen. Không giả lập chi phí hoặc chính sách như dữ liệu thật. Profile Giáo vụ/Giáo viên/Trưởng bộ môn chỉ thấy tên/mã/trường; thông tin liên hệ chỉ có trong flow tiếp nhận, không hiển thị lại ở hồ sơ bị hạn chế.

## Acceptance
Mọi mã màn trong brief có đường vào; các flow chính có mutation và phản ánh ở vai trò còn lại. Có validation, search/filter empty, return/retry, persist/reload/reset. Test 360, 390, tablet, desktop, zoom/large text; console/asset không lỗi; link hash hoạt động dưới /Biz/. KPI usability, impact và user preference: chưa đo, N/A.
