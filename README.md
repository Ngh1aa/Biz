# Biz — Minh Hoàng Center · UX tương tác

## GitHub Pages

**[Mở bản Minh Hoàng Center V0.5](https://ngh1aa.github.io/Biz/#/gv/GV01)**

Repo dùng cấu hình Pages sẵn có: nhánh `main`, thư mục `/`. File `.nojekyll` giữ nguyên các ES module, font và SVG. Mỗi thay đổi trên `main` được GitHub Pages xuất bản tự động; workflow `Verify Biz` kiểm tra syntax, logic và static build trên push/pull request. Kết quả CI và kết quả triển khai Pages cần kiểm tra riêng.

**V0.5:** thiết kế lại UX của toàn bộ 55 màn theo workflow `mobile-web-preview` của uiux-ai-workspace. Tổng quan ưu tiên ca/việc cần xử lý; menu có vùng riêng; biểu mẫu chia nhóm, header và trạng thái thống nhất; lịch ngày là entry dễ đọc. Giữ nhận diện Minh Hoàng, câu chữ giáo dục và nghiệp vụ hiện có. Xem `docs/ux-redesign.md` và `docs/screen-inventory.md`. Minh Hoàng là giao diện duy nhất; liên kết Pastel/Mono cũ tự mở giao diện hiện tại, giữ màn và dữ liệu. Tài liệu V0.4 là lịch sử nguồn tham chiếu, không phải yêu cầu giữ bố cục ở lần redesign này.

- Minh Hoàng: `http://127.0.0.1:4173/Biz/#/gv/GV01`
- Tài liệu/capture phiên bản cũ chỉ là hồ sơ lịch sử, không còn là giao diện đang cung cấp.

Browser prototype cho vận hành trung tâm đào tạo, theo tài liệu người dùng cung cấp ngày 21/10/2026. Có **55 màn/trạng thái** dùng chung component và dữ liệu, cho **Giáo vụ · Giáo viên · Trưởng bộ môn · Phụ huynh**.

## Xem bản local

Yêu cầu Node.js. Không cần cài dependency để chạy app.

```sh
npm run dev
```

Mở **http://127.0.0.1:4173/Biz/**. Chọn vai trò ở bên trái trên desktop hoặc thanh trên cùng trên điện thoại. Danh mục màn giúp đi thẳng đến từng bước. Nút **Đặt lại bản trải nghiệm** khôi phục dữ liệu mẫu.

Màn A00 chỉ minh họa đăng nhập; nhập số điện thoại 10 số bắt đầu bằng 0 và mật khẩu bất kỳ từ 6 ký tự để thử luồng. Không nhập thông tin thật. App không gửi hoặc lưu mật khẩu.

## Luồng có thể bấm thử

- Giáo vụ: nhập hồ sơ 3 bước → chọn môn/giáo viên → xếp lịch → hồ sơ và lịch giáo viên cập nhật; đổi giáo viên/lịch/nghỉ theo ngày hiệu lực; kích hoạt lại hồ sơ.
- Giáo viên: lịch tuần/ngày/theo học sinh → Có/Vắng → lưu; ca đã khóa → gửi yêu cầu → Giáo vụ duyệt hoặc từ chối; thêm dạy thay/học bù.
- Báo cáo: nháp/nhập mới → gửi → Trưởng bộ môn duyệt → Giáo vụ duyệt; làm lại có lý do và lịch sử. Chuyên cần đọc từ tích lịch. Có gửi tất cả nháp hợp lệ.
- Excel trên web: tải mẫu `.xlsx` thật, đọc file cục bộ, kiểm tra từng dòng, nhập các dòng hợp lệ vào nháp. Bỏ qua nội dung chuyên cần trong file. Không ghi đè báo cáo đang duyệt hoặc đã duyệt.
- Công việc: giao → nhận → cập nhật tiến độ → gửi kết quả → người giao xác nhận/đóng hoặc trả lại; có trao đổi và lịch sử.
- Hóa đơn từ số buổi có mặt, tránh tạo trùng, ghi nhận trạng thái thu; tài khoản khóa/mở và phản hồi đặt lại mật khẩu mẫu.
- Hộp thư, hội thoại, soạn tin, thông báo, file đính kèm dạng tên file; tin nhắn lưu qua reload.

## Kiểm tra và build

```sh
npm run check
npm test
npm run build
```

`dist/` là bản static với đường dẫn tương đối và hash routes, dùng được dưới `/Biz/`. Trạng thái bàn giao **PREPARED**, chưa publish.

Browser QA ở `tests/browser/`. Môi trường cần có Playwright; có thể trỏ `PLAYWRIGHT_MODULE` tới package sẵn có rồi chạy `npm run test:browser`. Không cần Playwright trong app chạy thật.

## Source owners

- `src/data.js`: fixture, store, chuyên cần, khóa ca, lịch tuần, enrollment và duyệt báo cáo.
- `src/ui.js`, `src/styles.css`: component và semantic tokens monochrome.
- `src/app.js`: hash routes, reviewer controls, render và navigation.
- `src/actions.js`: form validation, mutation và các transition dùng chung.
- `src/screens/`: các family màn hình, không nhân bản một HTML riêng cho mỗi trạng thái.
- `docs/`: brief, giả định, inventory, nguồn tham chiếu và bằng chứng QA.

## Ranh giới bản UX

Toàn bộ dữ liệu là tổng hợp. App dùng localStorage trên cùng trình duyệt, không đồng bộ thiết bị. Reviewer role switch là công cụ xem UX, **không phải cơ chế phân quyền bảo mật**. Không có backend, đăng nhập thật, SMS/push, chấm công thật, upload file thật, xuất bản native hoặc giao dịch thanh toán. Đính kèm chỉ lưu tên tệp, scan chỉ có preview mẫu. Đơn giá 150.000đ/buổi là giả định có nhãn, cần được trung tâm xác nhận.

Hồ sơ rút gọn theo vai trò; thông tin liên hệ chỉ xuất hiện ở flow nhập mới. Giao diện Giám đốc/Admin/Trưởng phòng chưa có đặc tả nên không tự thêm. Chưa có kiểm thử với người dùng thật, thiết bị native, screen reader hoặc chứng nhận WCAG.

Workflow áp dụng: [Ngh1aa/uiux-ai-workspace](https://github.com/Ngh1aa/uiux-ai-workspace), Flow `mobile-web-preview`; hồ sơ v2 và capture ở `docs/uiux/` và `evidence/browser/`. Integrity checker xác nhận tính nhất quán của hồ sơ, không chứng minh thẩm mỹ hay hiệu quả người dùng.

## Vai trò Phụ huynh

[Mở không gian Phụ huynh](https://ngh1aa.github.io/Biz/#/ph/PH01). Chọn vai trò Phụ huynh trên thanh review; dữ liệu mẫu có hai con được liên kết. 14 màn bổ sung gồm lịch/chuyên cần, báo cáo đã công bố, học phí, hội thoại, xin nghỉ và gia đình/hỗ trợ. Giáo vụ xử lý xin nghỉ ở GV10; tin nhắn tới người phụ trách xuất hiện trong Trao đổi. Không tự thay điểm danh/học phí khi xin nghỉ.

Chi tiết phạm vi, nguồn Factory, giả định, trạng thái và giới hạn: `docs/parent-role.md`. Quyền xem là mô phỏng trong trình duyệt, không thay thế phân quyền backend; dữ liệu không đồng bộ qua thiết bị.
