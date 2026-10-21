# UX v0.5 · Minh Hoàng

## Workflow và nguồn
Factory checkout: dcfe2c70093eafab409965cd4948ab79b5366146. Flow `mobile-web-preview`, scope PRODUCT/redesign, domain education, archetype education-management. Mẫu heuristic không thay thế nghiên cứu người dùng. Source và hành vi đang chạy là nguồn chức năng; tham chiếu Claude/files.zip giữ vai trò lịch sử nhận diện.

Skill đã áp dụng: product-discovery (brief/JTBD/assumptions); journey-driven-content-and-layout (thứ tự câu hỏi/hành động); mobile-navigation-and-state-ux (tab, Back, deep link, scope và phục hồi); mobile-design-system-and-handoff (component/token chung); visual-design-direction (ba family và so sánh A/B đa trục); asset-media-and-art-direction (icon có nhãn, không ảnh filler); frontend-implementation; mobile-prototype-and-qa; web-quality-and-performance; ui-craft-and-visual-qa. Manifest tại `docs/uiux/redesign-task-manifest.json` ghi routing, không phải bằng chứng QA.

Retrieval trả `NO_CURATED_DOMAIN_PROFILE` và `NO_CURATED_REFERENCE_ANATOMY`. Không áp mặc định Claymorphism/landing-page hero do hệ thống gợi ý; đối tượng ở đây là công việc giáo dục của người lớn. Numeric type/spacing là giả thuyết chuyên môn đã xem trên render, không gán thành quy chuẩn chính thức của ngành.

## Thay đổi UX
- Menu là một hàng bố cục riêng, màn hình là vùng cuộn riêng: không che input, CTA, hội thoại hoặc bị lệch trên Excel desktop.
- Tổng quan Giáo vụ: hàng chờ học sinh/báo cáo/xin nghỉ → thao tác thường dùng → lịch hôm nay → quản lý khác. Hàng chờ học sinh mở đúng filter.
- Giáo viên: tên ca/giờ/số học sinh và Mở buổi học → số ca chưa điểm danh/hạn khóa → báo cáo/công việc cần tiếp tục → học sinh cần theo dõi. Trưởng bộ môn có hàng chờ duyệt riêng.
- Phụ huynh: con đang chọn → ca gần nhất → xin nghỉ/liên hệ → chuyên cần và thông tin đã công bố → kết nối với trung tâm. Đổi con vẫn xóa lựa chọn chi tiết cũ theo source hiện hữu.
- Header chia Back/utility với title. Tên màn không bị ép cạnh nút Back; bỏ dấu chấm trang trí ở tiêu đề tác vụ.
- Danh sách: tìm kiếm và filter trước các hàng có cùng thuộc tính; tên, ID/trường, môn và trạng thái rõ cấp.
- Tiếp nhận ba bước: fieldset thông tin học sinh, học tập, liên hệ; phụ huynh và khẩn cấp; đầu vào. Báo cáo chia kết quả kiểm tra và nhận xét/đánh giá. Trường nhập có đường biên và hướng dẫn rõ.
- Tab lịch mở dạng ngày, vẫn giữ tuần và học sinh. Lịch Giáo vụ bao gồm ca toàn trung tâm; các môn đang học được đọc từ enrollment hiện hữu.
- Render cùng màn giữ vị trí cuộn và focus của action. Gửi hội thoại đưa vùng nhập cuối vào tầm nhìn. Back ở điều chỉnh lớp về đúng hồ sơ.

## Design decisions
Nhận diện #253a7e / #ea4c2d / #f4e743 giữ nguyên. Font Google Sans Flex local, Feather, không dependency mới. Title task28/34, greeting24/30, section18/26, body15/23, meta13/19, labelled nav11/15 (10px ở360), gutter20, section28, group12. Controls56, secondary/filters44+, nav80 với vùng safe-area riêng. Nội dung đọc dùng divider và khoảng cách; surface chỉ nhóm đối tượng/record.

So sánh A/B giữ cùng seed, nội dung, action, font assets và viewport. A: session card có text CTA, deadline riêng; B: work queue trước, ca học chia hai cột và action icon; khác weight/density/object anatomy. Tác giả chọn A vì nhận diện điểm danh và hành động rõ hơn trong review hình. `HEURISTIC_ONLY`, không có người tham gia hay kết luận tăng hiệu quả thực tế. Captures và digest nằm trong `redesign-design-decisions.json`; checker chỉ kiểm tính toàn vẹn quyết định.

## Trạng thái và kiểm tra
Giữ 55 route, 82 tổ hợp role-visible. Kiểm tra 220 route/viewport, 32 geometry/contrast cases, 32 parent viewport cases; 14 domain tests, 7 journeys, Excel download/import, 67 staff copy cases, parent authorization/publication/leave/chat/empty recovery. Các fixture capture không đọc browser data của người dùng.

Các regression cần giữ: không bỏ qua vòng duyệt; chưa đủ mark không save; lock theo Asia/Bangkok; học phí derive attendance/idempotent; phụ huynh chỉ xem đúng con và báo cáo đủ hai vòng; xin nghỉ không sửa attendance/fees; teacher không mở hội thoại office-only; stored legacy status không migration chỉ để đổi label.

QA bắt lỗi P1 menu overlay và Excel ngoài frame, đã sửa root layout; P2 title chen với Back, form thiếu nhóm, nav quá nhỏ và quick-link sai ngữ cảnh đã sửa. Review ảnh toàn màn và các bottom state; screenshot không tự chứng minh usability. Contrast chỉ bao phủ các control/pill nền đặc được lấy mẫu, chưa là WCAG audit đầy đủ.

## Giới hạn
Browser prototype, localStorage và dữ liệu mẫu. Không backend/auth thật, payment, native app, đồng bộ thiết bị hoặc xác minh người dùng thật. Không có participant research, VoiceOver/TalkBack hay field performance. Technical PASS không phải kết luận sản phẩm vận hành thật.
