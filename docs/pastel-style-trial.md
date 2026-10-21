# Biz V0.2 — iOS pastel graphic

## Nguồn đã đọc
Gói người dùng cung cấp `C:/Users/LENOVO/Downloads/Biz-design-system.zip`: README, design-system.css, design-system.html, preview/index.html, detail-screens.html, tailwind.config.js, tailwind.css và 4 SVG. Đã mở render detail-screens để kiểm tra anatomy. Tài liệu trong ZIP được dùng làm nguồn thiết kế; các hành vi demo/toast trong HTML không thay thế logic nghiệp vụ của Biz.

Yêu cầu hiện tại ưu tiên hơn constraint trắng đen của vòng trước. V0.1 được giữ qua `?theme=mono` và các artifact cũ; V0.2 mặc định `?theme=pastel`. Cùng renderer và local store cho cả hai style. Không thêm framework/Tailwind build hoặc thư viện UI vì repo hiện là static ES modules.

## Token → ứng dụng

| Nguồn | Áp dụng | Điều chỉnh có lý do |
|---|---|---|
| Mint #bee5d4 | Ca cần tích, chuyên cần, trạng thái có mặt | Text xanh đậm để đọc được |
| Lilac #d8d3f7 | Metric, chip chờ, tiến độ, form tự điền | Neutral surface cho form nhập thật |
| Yellow #f8df62 | Metric phụ, ca chưa tích | Có nhãn trạng thái, không dùng màu riêng lẻ |
| Pink #f7c4e5 | Ca học tiếp theo và class summary | Graphic không che dữ liệu |
| Blue #c4e8f2 | Báo cáo cần duyệt, report record | Trạng thái duyệt lấy từ store |
| Radius 12/16/22/28/44 | Input 17px, card 23–28px, frame 48px | Frame chỉ là browser presentation; mobile không có border/notch giả |
| Google Sans Flex | Self-hosted WOFF2 latin/vietnamese/latin-ext, 400–800 | Nguồn Google Fonts, OFL đính kèm; không sử dụng font Apple phân phối lại |
| Type scale 32/24/18/14/12/11 | H1 30–32, section 18, form/body 14, label/meta 11–13 | Line-height 1.1–1.7 cho tiếng Việt; không áp 1.02 cho đoạn đọc |
| 4 SVG trong ZIP | Toolkit: overview/login; calendar: lịch/ca; student: danh sách/hồ sơ; report: báo cáo/thống kê | Dùng object-fit:contain; graphic riêng ô với copy; không mang dữ liệu thật |
| Floating capsule nav | Surface trắng, selected đen, 5 tab có nhãn | Giữ IA đã triển khai thay vì tab mẫu chỉ để demo |

## Thành phần và state
- `src/pastel.css` là layer theme có scope `[data-theme=pastel]`, dùng token của gói nguồn.
- `src/app.js` quản lý query theme và graphic theo screen role; đổi theme chỉ thay root CSS/reviewer, không remount form.
- `src/ui.js` gắn semantic status vào pill; chữ trạng thái giữ nguyên, monochrome không đổi behavior.
- `assets/graphics/` dùng lại 4 SVG đầu vào, không tạo bitmap mới hoặc copy ảnh tham khảo.
- `assets/google-sans-flex-*.woff2` được tải từ nguồn Google Fonts; tổng khoảng 230 KB, thay cho file TTF gốc 3,9 MB. License `assets/GOOGLE-SANS-FLEX-OFL.txt`.

## Kiểm tra
- Syntax, 9 unit tests: PASS.
- 41 routes × 360/390/768/1440: 164 cases, không ghi nhận lỗi JavaScript/assets, overflow ngang hoặc button icon không tên trong phạm vi scan.
- Các flow intake/class, tích lịch/correction, report hai vòng/làm lại, task giao/nhận/xác nhận, invoice, chat, search recovery và import XLSX thật: PASS.
- Đổi theme giữ route, draft form; reload link mono giữ style và draft: PASS.
- 9 screen roles × 3 viewports: không ghi nhận broken graphic hay graphic box che text trong region đã quét; control label trên nền phẳng/opaque đạt ngưỡng contrast 4.5 theo kiểm tra này. Nền gradient/translucent được review bằng render, không suy diễn thành full WCAG audit.
- Đã xem ảnh render overview, lịch, hồ sơ, báo cáo, form, login và các trạng thái; chỉnh nhãn ca Chiều để không ngắt dòng giữa từ.
- Browser Back/modal keyboard/text scale 150% được kiểm trong matrix. Native iOS, VoiceOver, người dùng thật: NOT_RUN. Đây là style browser lấy cảm hứng iOS, không phải app native.

Bằng chứng mới: `evidence/pastel-v02/matrix.json`, `flows.json`, `excel.json`, `style-qa.json` và PNG cùng thư mục. QA không thay đổi các quyền commit/push/deploy.
