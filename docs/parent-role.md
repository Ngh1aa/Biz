# Vai trò Phụ huynh — phạm vi và hợp đồng trải nghiệm

Yêu cầu hiện hành: giữ giao diện Minh Hoàng hiện tại, thêm Phụ huynh; không thực hiện việc sao chép artifact ở yêu cầu đã được thay thế.

## Nguồn và cách áp dụng Factory

- Target: renderer `src/app.js`, dữ liệu `src/data.js`, action `src/actions.js`, token/component `src/center.css` và `src/ui.js`.
- Quy trình: `Ngh1aa/uiux-ai-workspace`, START-HERE → AGENTS → CONTRACT-OWNERSHIP → manifest `work/parent-task-manifest.json`, Flow `mobile-web-preview`: research → design → implementation → QA.
- Ghi nhận và sửa suy luận routing ban đầu: metadata fallback nhầm commerce; explicit override `education` / `education-management`. Manifest chỉ là điều phối, không chứng minh QA.
- Browser prototype hiện có; không đổi framework, không thêm dependency. Giữ storage v1, migrate bổ sung trường khi thiếu, không ghi đè dữ liệu cũ.
- Style được người dùng giữ cố định: Google Sans Flex, blue #253a7e, surface #f4f5f9, lề 20px, body 15/22, h1 28/32, radius 16/24, input/button 56px, nav 64px. Dùng lại component hiện có. Không tìm style mới, không cần thử art direction khác. Không thêm ảnh trang trí.
- Baseline tham chiếu: `outputs/Biz-center-only/qa`, tổng quan Giáo vụ/Giáo viên và biểu mẫu; phải giữ hierarchy và các luồng staff.

## Product brief và giả định

Phụ huynh cần biết hôm nay con học gì, tình hình học tập, khoản học phí do trung tâm lập và cách trao đổi/xin nghỉ. Ba JTBD: kiểm tra lịch trước khi đưa con đi học; hiểu kết quả đã được trung tâm duyệt; gửi xin nghỉ và theo dõi phản hồi. Tất cả dữ liệu mẫu, chưa có nghiên cứu người dùng thật hoặc KPI vận hành. Tiêu chí kỹ thuật: không lộ dữ liệu ngoài liên kết, trạng thái thống nhất, không tạo yêu cầu trùng, không thay điểm danh khi xin nghỉ, không có đường cụt, không overflow ở 360px.

Giả định: một tài khoản có thể liên kết nhiều con; học phí do Giáo vụ lập; báo cáo chỉ công bố sau đủ hai vòng duyệt; xin nghỉ do Giáo vụ xử lý. Cần trung tâm xác nhận quy tắc này trước khi dùng thật. Không tự tạo hạn xin nghỉ hay thông tin ngân hàng.

## Màn hình, task và recovery

| ID | Task / thứ tự thông tin | Hành động → nơi đến | Feedback và recovery |
|---|---|---|---|
| PH01 | Con đang chọn → lịch gần nhất → chuyên cần → thông tin đã công bố | Xem buổi → PH02b; chọn con | Thông tin đổi theo con; chưa liên kết → liên hệ trung tâm |
| PH02 | Tuần đang xem → các buổi theo ngày → điểm danh | Xem buổi → PH02b; tuần trước/sau/hôm nay | Tuần trống có nút về tuần này |
| PH02b | Buổi/ngày/giáo viên → điểm danh → yêu cầu đã gửi | Xin nghỉ → PH06a | Không xin nghỉ buổi cũ/đã khóa; lỗi liên kết → lịch |
| PH03 | Tháng → báo cáo đã duyệt của con | Xem → PH03b | Chưa công bố hiển thị rõ, không lộ bản nháp |
| PH03b | Đã công bố → chuyên cần → điểm/nhận xét/kế hoạch | Trao đổi → PH05c | Entity ngoài phạm vi không hiện dữ liệu, quay về danh sách |
| PH04 | Tháng → thông báo học phí đã được lập | Xem → PH04b | Chưa lập hiển thị đúng; không đồng nhất với đã thanh toán |
| PH04b | Trạng thái → số buổi/môn/số tiền → người cập nhật | Hỏi Giáo vụ → PH05c | Không có nút giả thanh toán, dùng trạng thái thu chung |
| PH05 | Hội thoại liên quan con → người phụ trách | Mở → PH05b; soạn → PH05c | Trống có CTA soạn tin |
| PH05b | Người nhận/con → hội thoại → nội dung nhập | Gửi → giữ hội thoại | Lưu chung với staff, reload không mất; không gửi rỗng |
| PH05c | Con → liên hệ Giáo vụ/giáo viên phụ trách → nội dung | Gửi → PH05b | Không cho chọn giáo viên ngoài phạm vi |
| PH06 | Yêu cầu của con → trạng thái → người xử lý | Xem → PH06b; tạo → PH06a | Trống có đường tới lịch |
| PH06a | Con → buổi hợp lệ → lý do → người tiếp nhận | Gửi → PH06b | Giữ nháp; chặn buổi cũ/trùng; giải thích xin nghỉ không tự đổi điểm danh |
| PH06b | Mã/trạng thái → buổi/lý do → phản hồi | Hủy yêu cầu chờ; trao đổi | Xác nhận trước hủy, không hủy đã xử lý |
| PH07 | Phụ huynh → con liên kết → hỗ trợ | Chọn con / trao đổi Giáo vụ | Không tự thêm con bằng mã học sinh |
| GV10 + TC07b | Giáo vụ xử lý xin nghỉ / staff trả lời phụ huynh | Duyệt/từ chối có lý do; trả lời | Phụ huynh nhận cùng trạng thái; không tự sửa điểm danh |

## Ba composition proof trước implementation

1. Tổng quan: lời chào + chọn con → khối ca gần nhất màu xanh → 2 chỉ số chuyên cần → danh sách thông tin/tác vụ. Mobile một cột, desktop vẫn khung review hiện hữu.
2. Danh sách/record: tiêu đề + chọn con/tháng → các hàng trắng có dữ kiện so sánh → chi tiết; không dùng hero trang trí. Màu trạng thái kèm chữ.
3. Form/status: tiêu đề + chọn con → buổi → lý do → lưu/gửi; trang kết quả giữ mã, trạng thái, người xử lý, lý do và thao tác tiếp theo cùng nhau.

Walkthrough trước code (agent-heuristic): đã xác định bốn nguy cơ cần sửa ở owning layer: parent đi nhầm route staff, lộ báo cáo chờ duyệt, xin nghỉ bị hiểu thành điểm danh, thay con nhưng vẫn thấy chi tiết con trước. Thiết kế dùng route guard, hàm lọc dữ liệu, copy rõ và reset detail khi đổi con. Retest sẽ ghi bằng domain/browser tests; không coi walkthrough là nghiên cứu thật.

## Ranh giới

Phân quyền ở đây chỉ kiểm soát UX trong browser prototype. Mọi dữ liệu nằm trên cùng thiết bị; đây không phải bảo mật backend. Không có thanh toán, push notification hoặc gửi tin ra ngoài. Quy tắc vận hành/human validation/native QA: UNKNOWN/NOT_RUN.

## Kiểm tra implementation

- Factory revision được dùng: `dcfe2c70093eafab409965cd4948ab79b5366146`. Manifest riêng: `docs/uiux/parent-task-manifest.json`.
- `npm run check`, `npm test` (14 domain tests), `npm run build`: đã chạy thành công.
- Browser matrix: 55 tuyến × 360/390/768/1440 = 220 trường hợp; kiểm tra overflow, heading, button label, lỗi runtime/resource, Back, entity-missing và modal keyboard.
- `parent.cjs`: chọn con, chặn route staff, chỉ công bố đủ hai vòng duyệt, đổi con xóa detail cũ, invalid entity recovery, thu học phí cùng nguồn, hội thoại Phụ huynh–Giáo vụ và hạn chế hội thoại của giáo viên, xin nghỉ/hủy/từ chối/chấp thuận, chống thay điểm danh, nháp qua reload, tuần trống, 32 trường hợp có dữ liệu theo viewport, form có dữ liệu ở cỡ chữ 150% và tài khoản chưa liên kết con.
- Đã mở ảnh tổng quan/lịch/form ở mobile và desktop, cùng hội thoại/trạng thái xin nghỉ ở mobile. Sửa khung soạn tin dùng lại composer để nội dung và nút gửi gọn trong khung hiện tại; bỏ link tự trỏ trong chi tiết xin nghỉ.
- Bản ghi thiết kế v2 riêng cho ba composition family kế thừa: `docs/uiux/parent-design-decisions.json`. Canonical checker trả `DECISION_INTEGRITY_ONLY` và `UX RECORDED`; không chứng minh thẩm mỹ hoặc ý kiến người dùng thật. Bằng chứng ảnh nằm trong gói QA, không được Git theo dõi cùng source.
- Giữ hồi quy nghiệp vụ staff, Excel và 67 trường hợp copy; kiểm tra lại targeted sau thay đổi renderer hội thoại.
- Môi trường kiểm tra: Chromium/Playwright trên Windows; chưa xác nhận native iOS/Android, VoiceOver/TalkBack hoặc hiệu quả dùng thực tế.
