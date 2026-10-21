# Nguồn và chuyển hóa thiết kế

## Nguồn chính
- Văn bản yêu cầu người dùng cung cấp ngày 21/10/2026, chứa mã A00/GV/TC/TBM. Các file PDF/DOCX gốc được nhắc đến nhưng không được cung cấp: UNKNOWN.
- 3 ảnh người dùng đính kèm: visual concept references. Không phải sản phẩm đã kiểm chứng hay bằng chứng nghiên cứu người dùng.
- Repo Biz ban đầu chỉ có `.gitattributes`: không có framework/design system để tái sử dụng.
- Factory: đọc `START-HERE.md → AGENTS.md → docs/CONTRACT-OWNERSHIP.md`, tạo manifest với target truth, resolve `mobile-web-preview`, đọc skill theo stage.

## Transfer matrix

| Nguồn | Quyết định áp dụng | Giới hạn |
|---|---|---|
| Ảnh 1, 2 · progress/course cards | Bo 28px, headline bên trái, action tròn tách khỏi nội dung | Đổi decision object sang ca chưa tích/báo cáo chờ duyệt; bỏ rating/avatar học viên trang trí |
| Ảnh 3 · schedule/tab capsule | Calendar tuần và tab bar nổi | Thêm nhãn tab, trạng thái bằng chữ, ô lịch có thể bấm |
| Văn bản · nhập hồ sơ | Form 3 bước, giữ draft, cảnh báo trùng, bottom sheets | Không suy diễn quy trình từ ảnh concept |
| Văn bản · phân quyền | Hồ sơ rút gọn tên/mã/trường cho các vai trò được thiết kế | Backend ACL chưa triển khai; role switch chỉ để review |
| Yêu cầu hiện tại · trắng đen | Palette grayscale | Tạm không dùng xanh/cam/vàng trong DS cũ |

Lookup Factory theo identity `education` và `app-overview` trả `NO_CURATED_DOMAIN_PROFILE` / `NO_CURATED_REFERENCE_ANATOMY`; numeric ranges là `PROFESSIONAL_HYPOTHESIS`. Không áp một theme ngành khác làm chuẩn cho Biz. Dùng 3 ảnh được chỉ định và task contract để tạo bố cục riêng.

## So sánh direction

- A: task ưu tiên rộng, headline 31px/800, card padding 23px, khoảng section 27px.
- B: metrics trước, task thu thành một hàng ngang, title 24px/600, object padding 13px, section 18px.
- Cùng audience, dữ liệu, claims, action, font asset và viewport. Tác giả đã xem render, chọn A vì hành động trước giờ khóa cần nổi bật. B đưa lịch tiếp theo lên cao hơn nhưng giảm nhấn việc gấp. Đây là heuristic của agent, không phải kết quả preference của người dùng.

Danh sách và form dùng chung hệ token nhưng có composition riêng. Không ép lịch/table/form vào cùng một hero-card.

## Tài nguyên và giấy phép

- Font Manrope từ [Google Fonts](https://github.com/google/fonts/tree/main/ofl/manrope), SIL Open Font License, giấy phép kèm `assets/MANROPE-OFL.txt`.
- Feather Icons 4.29.2 từ [Feather](https://github.com/feathericons/feather), MIT, giấy phép kèm `assets/FEATHER-LICENSE`.
- SheetJS CE 0.20.3 từ [nguồn phân phối chính thức](https://docs.sheetjs.com/docs/getting-started/installation/standalone/), Apache 2.0, giấy phép kèm `assets/SHEETJS-LICENSE`. Chỉ tải bộ đọc khi người dùng dùng Excel.
- Dialog dùng HTML dialog theo [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), có focus trap/Escape do trình duyệt quản lý.
- Không dùng lại artwork/ảnh chân dung của ảnh mẫu trong sản phẩm.
