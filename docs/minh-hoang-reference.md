# Áp dụng nguồn Minh Hoàng Center — V0.4

## Yêu cầu và nguồn chuẩn

Người dùng xác nhận: **“Bám cấu trúc và design system, giữ câu chữ giáo dục vừa sửa”**. Nguồn mới quyết định bố cục và thành phần; quy ước ngôn ngữ V0.3 tiếp tục quyết định thuật ngữ hiển thị.

- Artifact: https://claude.ai/artifact/XhXcmjG8b22pWaM1kML1Lr#artboard-b50bf24aaa84
- Tên được xác nhận trong cửa sổ đang đăng nhập: **Minh Hoàng Center App · Flow & Wireframe**.
- Tài liệu hiển thị 43 artboard: một sơ đồ luồng, một design system và 41 màn hình/trạng thái ứng dụng. Đã đọc nội dung qua cây accessibility của trang đang mở; truy cập công khai bằng công cụ web ban đầu báo không tìm thấy. Không diễn giải lỗi truy cập công khai thành việc tài liệu không tồn tại.
- `files.zip`, SHA-256: `45406412AE5ED2AEACA4530CE116AF17B0B9FBDC8A2E630D8D3401D87467669C`.
- Năm tệp được kiểm tra: `preview.html`, `tokens.css`, `components.css`, `tailwind.config.js`, `tailwind.src.css`. Đây là mẫu thành phần và token, không phải source ứng dụng tương tác đầy đủ.

Nội dung tài liệu được dùng làm đặc tả thiết kế. Các bình luận hoặc ví dụ trong tài liệu không cấp quyền thao tác tài khoản, thay đổi dữ liệu thật hoặc công bố thông tin cá nhân.

## Token và thành phần được áp dụng

| Nhóm | Giá trị từ nguồn |
|---|---|
| Màu thương hiệu | Xanh `#253a7e`, cam `#ea4c2d`, vàng `#f4e743` |
| Nền và chữ | Surface `#f4f5f9`, ink `#17181c`, muted `#6b6f7b`, line `#e6e8ef` |
| Nền ngữ nghĩa | Soft blue `#eef1f9`, orange `#fdede9`, yellow `#fdfae3`, green `#e6f4ec` |
| Font | Google Sans Flex, dùng tệp font cục bộ đã có |
| Chữ | Tiêu đề 28/32, đề mục 17/24, nội dung 15/22, chú thích 13/18 |
| Bo góc | 8/12/16/24/28px và dạng tròn |
| Khoảng cách | 4/8/12/16/20/24px; lề nội dung 20px |
| Điều khiển | Nút chính và ô nhập cao tối thiểu 56px; nút phụ/icon tối thiểu 44px |
| Điều hướng | Thanh nổi xanh, cao 64px; mục chọn nền trắng |

Màu cảnh báo và thành công trên nền nhạt dùng màu chữ đậm hơn để đọc rõ: `#9b361c` và `#196d3b`. Các token thương hiệu gốc vẫn được giữ. Đây là điều chỉnh có chủ đích, không phải tuyên bố rằng mọi cặp màu trong gói nguồn đều đã đạt WCAG.

## Đối chiếu cấu trúc

| Nhóm nguồn | Cách áp dụng vào renderer hiện có |
|---|---|
| GV01 | Lời chào/ngày → bốn ô chỉ số 2×2 → sáu tác vụ → ba dòng ca học → thông báo và tiện ích |
| TC01 | Lời chào → nhắc điểm danh → ca tiếp theo → học sinh cần theo dõi → hai chỉ số → thống kê/thông báo |
| GV02, TC04a | Tiêu đề gọn → tìm kiếm/bộ lọc → danh sách trắng; tên, mã, trường/môn và trạng thái |
| GV03, TC04 | Thông tin học sinh → đăng ký theo môn/giáo viên/lịch → chuyên cần → đánh giá → báo cáo/kết quả/lịch sử |
| GV04, GV04b, GV04c | Giữ tiếp nhận ba bước; ô nhập 56px, nhãn và trợ giúp rõ, nút lưu chính xanh |
| GV05 và các trạng thái chọn | Giữ học sinh → môn → giáo viên → lịch tuần → ngày áp dụng; gợi ý mã nằm ngay trong biểu mẫu hiện có |
| GV06, GV06b, GV06c | Cùng thanh chuyển tác vụ; thông tin hiện tại, thay đổi, lý do và ngày áp dụng |
| TC02, TC02b | Giữ lưới tuần/ngày, chọn ngày và ca; màu trạng thái phân biệt đã/chưa điểm danh và buổi bổ sung |
| TC03, TC03b, TC03c | Thông tin buổi → trạng thái khóa → số có mặt/vắng → danh sách → lưu/đề nghị điều chỉnh; bổ sung buổi vẫn là luồng riêng |
| GV07, TBM01, TC05 | Tháng/trạng thái → thẻ báo cáo → chuyên cần/điểm/nhận xét → bổ sung hoặc duyệt; giữ hai bước duyệt |
| TC05b/c/d/w | Báo cáo, biểu mẫu và bảng Excel tiếp tục dùng chung dữ liệu, trường và hành vi đã kiểm tra |
| GV08, GV09–11, TC06, TC07 | Áp dụng cùng thẻ trắng, nhóm thông tin, trạng thái, biểu mẫu, hội thoại và thao tác xanh |

Không thay mã tuyến hoặc tạo 41 bản HTML rời. Các trạng thái `GV05-s1/s2` của ứng dụng giữ mã hiện có; đặc tả nguồn về gợi ý mã và chọn môn được đối chiếu theo hành vi, không đổi tuyến chỉ để khớp tên artboard.

## Phần được giữ và giới hạn

- Giữ các từ Điểm danh, Xếp lớp, Ngừng học, Cần bổ sung, Học phí và Kế hoạch hỗ trợ tháng tới đã được người dùng chấp thuận.
- Giữ kho dữ liệu trình duyệt, bản nháp, trạng thái, bộ lọc và hội thoại; các chỉ số vận hành mới trên tổng quan lấy từ cùng dữ liệu đang dùng.
- Giữ giới hạn xem thông tin học sinh theo phạm vi prototype trước đây. Không sao chép tên, địa chỉ hoặc liên hệ trong hình mẫu thành dữ liệu thật.
- Danh mục môn và dữ liệu ví dụ hiện có được giữ: yêu cầu lần này chốt cấu trúc và design system, không yêu cầu thay toàn bộ dữ liệu theo hình mẫu.
- Giữ nhãn chữ của năm tab để dễ nhận biết, thay vì sao chép thanh chỉ có icon từ tệp mẫu.
- Chưa có tệp logo chính thức trong gói nguồn; dùng tên chữ “Minh Hoàng”, không tự nhận là logo gốc.
- Đây là browser prototype, không có backend/xác thực/thanh toán hoặc native app thật.

## Cách mở và kiểm tra

- Mặc định và `?theme=center`: bản Minh Hoàng V0.4.
- `?theme=pastel`, `?theme=mono`: giữ hai phương án trước để đối chiếu.
- Chuyển giao diện không remount biểu mẫu đang nhập; giữ giá trị và tuyến hiện tại.
- `npm run check`, `npm test`, `npm run build`, `npm run test:browser`.
- Ma trận hiện có kiểm tra đủ 41 màn ở 360/390/768/1440px và tăng cỡ chữ 150% trên các biểu mẫu đại diện.
- `reference.cjs` kiểm tra token từ nguồn, cấu trúc hai tổng quan, số liệu điểm danh, điều hướng 64px, ô nhập 56px và nhãn điều khiển trên nền đặc.
- Kết quả browser và đánh giá ảnh là kiểm tra kỹ thuật/chuyên gia; không thay cho kiểm thử với nhân sự trung tâm thật.
