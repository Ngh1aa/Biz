# Bằng chứng kiểm tra

Trạng thái: **PREPARED — browser prototype local**. Dữ liệu tổng hợp. Không commit, push hoặc publish.

| Kiểm tra | Kết quả | Bằng chứng |
|---|---|---|
| JavaScript syntax | PASS | `npm run check` |
| Logic nghiệp vụ: khóa ca, chuyên cần, 2 vòng duyệt, tuần/năm, nhiều môn, ngày hiệu lực, import, persistence | PASS · 9 tests | `npm test` |
| 41 route × 360, 390, 768, 1440 px | PASS · 164 trường hợp sanity | `evidence/browser/matrix.json` |
| Console/runtime/assets | Không ghi nhận lỗi trong matrix đã chạy | cùng matrix |
| Nhập hồ sơ → tạo lớp → cập nhật trạng thái/lịch | PASS | `evidence/browser/flows.json` |
| Tích lịch → yêu cầu sửa ca khóa → Giáo vụ duyệt → cập nhật | PASS | cùng flow evidence |
| Nháp → gửi → bộ môn → Giáo vụ; làm lại → gửi lại | PASS | cùng flow evidence |
| Giao việc → nhận → tiến độ → kết quả → đóng | PASS | cùng flow evidence |
| Hóa đơn không tạo trùng, ghi nhận thu; chat qua reload; search empty recovery | PASS | cùng flow evidence |
| .xlsx tải mẫu, file thật 3 dòng, một hợp lệ, thiếu Thái độ, sai mã HS, nhập nháp | PASS | `evidence/browser/excel.json` |
| Bàn phím trong modal, Escape, browser Back, link entity không hợp lệ | PASS cơ bản | matrix |
| Text 150% | PASS kiểm tra áp lực không tràn ngang trên TC01/GV04/TC05c | capture `*-text150.png`; đây là CSS text pressure, không phải native Dynamic Type |
| Visual review | Đã mở ảnh phone/desktop của overview A/B, danh sách và form; đã xem lịch và duyệt trên phone | `docs/uiux/design-decisions.json` và captures |
| Canonical design contract v2 | PASS về integrity, HEURISTIC_ONLY | `docs/uiux/design-check-rendered.json` |
| Build static dưới `/Biz/` | PASS sau build và probe đường dẫn | `dist/` và `evidence/browser/build.json` |
| Backend/auth thật, native, screen reader, nghiên cứu người dùng, production performance, public deploy | NOT_RUN / chưa triển khai | Không suy diễn từ browser QA |

## Findings và xử lý

- P2 · Headline chức năng quá ẩn dụ: đổi sang Nhập hồ sơ, Lịch dạy, Báo cáo… và chụp lại.
- P2 · Danh mục reviewer bị căn giữa do variant link chung: sửa owner của danh sách và kiểm lại desktop.
- P1 · Chuyển giáo viên có nguy cơ làm mất lịch sử: enrollment giữ buổi quá khứ, thay allocation tương lai; regression test PASS.
- P1 · Ngày hiệu lực bị áp dụng ngay: lưu pending change, xử lý vào ngày bắt đầu; regression test PASS.
- P2 · Ô lịch tuần chữ nhỏ: mở rộng bảng theo bề ngang phone và tăng cỡ chữ; kiểm 360/390 không tràn.

Không có blocker quan sát được trong các hành trình đã kiểm. Giấy phép, dependency hay integrity PASS không đồng nghĩa sản phẩm production-ready hoặc được người dùng yêu thích.

## 7 dấu hiệu craft

- Card bo tròn: có chủ đích ở task, summary và approval; list/form dùng hàng và trường nhập.
- Gradient/glass: không dùng gradient; blur nhẹ chỉ ở tab nổi nhằm tách nền khi scroll.
- Centered title: title chức năng căn trái; chỉ profile/empty state căn giữa.
- Icon badge: avatar initials dùng nhận diện; icon quick action có nhãn.
- Repeated layout: overview, list, form và calendar có object và grouping khác nhau.
- Accent cạnh tranh: không có, toàn bộ grayscale.
- Decoration: không có stock/3D filler; vòng tròn ở login là brand illustration tối giản, không mang nghĩa nghiệp vụ.
