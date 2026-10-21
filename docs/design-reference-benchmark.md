# Reference benchmark · UX redesign

Scope: app đào tạo có dữ liệu hiện hữu. Không dùng hình concept làm chứng cứ usability. Research theo ba vấn đề: hàng chờ công việc giáo dục; điều hướng mobile; biểu mẫu và trạng thái. Không mở pool 20 landing page vì không giúp các quyết định tác vụ.

| Nguồn đã đọc | Vai trò | Chuyển giao | Không sao chép / giới hạn |
|---|---|---|---|
| Source Minh Hoàng: center.css, overview, parents, students, teaching, reports | Nhận diện và nghiệp vụ | Màu nhận diện, đối tượng học sinh/ca/báo cáo, glossary | Bỏ menu overlay, thứ tự số liệu, header chen ngang |
| Google Classroom Help, View all your students’ work, https://support.google.com/edu/classroom/answer/9157286?hl=en | Production education, hàng chờ / hồ sơ | Việc cần review, lọc theo trạng thái, mở đối tượng cụ thể | Đọc hướng dẫn chức năng; không xác minh geometry hay tài khoản Classroom |
| GOV.UK Complete multiple tasks, https://design-system.service.gov.uk/patterns/complete-multiple-tasks/ | Task/status | Tên công việc và trạng thái cùng hàng, nhóm công việc | Không copy brand/government surface, không thêm task-list cho form tuyến tính |
| GOV.UK Question pages, https://design-system.service.gov.uk/patterns/question-pages/ | Form/back/error | Nhãn rõ, heading theo bước, Back, nhóm liên quan | Không chia mỗi input thành một route cho nhân viên nhập thường xuyên |
| Apple Tab bars, https://developer.apple.com/design/human-interface-guidelines/tab-bars | Mobile navigation | Tính ổn định của destination và nhãn | Trang JS chưa đọc đầy đủ; không dùng làm chứng cứ số đo/native QA |

Nguồn ngoài chỉ dùng thông tin/nội dung đã mở; geometry là giả thuyết chuyên môn. Không chấm điểm mỹ thuật từ trang trợ giúp.

## Composition matrix
| Page role | Câu hỏi | Anchor và anatomy | CTA | Mobile |
|---|---|---|---|---|
| Overview TC01/GV01/PH01 | Làm gì trước? | Ca/việc ưu tiên, deadline, một đường mở; số liệu phụ ở sau | Mở ca/hàng chờ | Một cột, hàng chờ có nhãn và số |
| Selection GV02 | Đúng học sinh nào? | Tìm/lọc phía trên comparable identity rows | Mở hồ sơ | Filter ngang cuộn, thêm thuộc tính ở hàng phụ |
| Task GV04/TC05c | Cần điền gì? | Bước, nhóm fieldset, hướng dẫn, CTA cuối | Tiếp tục/gửi | Các field liên quan cùng nhóm; cặp chỉ dùng khi đủ rộng |
| Record TC05b/PH04b | Tình trạng và bước tiếp? | Nhận diện/trạng thái → dữ kiện → nội dung → hành động/lịch sử | Theo quyền hiện tại | Nội dung đọc theo sections, không ép mọi phần vào card |
| Schedule TC02 | Ca nào và ngày nào? | Day strip, timeline/session cards; week grid là lựa chọn | Mở ca | Xem ngày mặc định để nhãn đọc được |
| Conversation TC07b | Trao đổi với ai? | Người nhận, hội thoại, composer riêng | Gửi | Nhãn, focus, vùng nhập không che menu |

Direction A: title 28/34 700, body15/23, section18/26, gutter20, group12, section28; priority card có nhãn, tên ca, giờ, ngữ cảnh, CTA; domain object là lịch/phiếu công việc. Direction B: title24/30 600, body14/22, section16/24, group8, section20; thống kê trước và task-row gộp. So sánh cùng seed, nội dung, CTA và viewport390/1440; khác ba trục type/density/object. Chọn bằng review ảnh thực, không suy ra hiệu quả nhân quả.

Visual signature: xanh Minh Hoàng dành cho hành động hiện tại, lịch và trạng thái có cấu trúc, các nội dung dài dùng section/divider trên nền sáng. Radius12 control,20 summary; không card hóa mọi đoạn đọc, không gradient, không ảnh lấp chỗ. Feather stroke thống nhất, initials chỉ nhận diện dữ liệu mẫu.
