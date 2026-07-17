# Conan — Bản Nhạc Lúc 0 Giờ

Fan game trinh thám 2D chơi trực tiếp trong trình duyệt. Chương đầu là một vụ án nguyên bản tại Nhà hát Tsukikage: khám phá hiện trường, phân tích dữ liệu, dùng chứng cứ kiểm tra lời khai và tự kết luận ai là thủ phạm.

## Chơi local

1. Giải nén toàn bộ thư mục.
2. Nhấp đúp `index.html` và mở bằng Chrome hoặc Edge.
3. Chọn **Bắt đầu điều tra**. Nếu từng chơi bản cũ, hãy chọn bắt đầu mới để dùng tiến độ V2.

Game không cần cài Node.js, không gọi API và không tải tài nguyên từ Internet.

### Điều khiển

- Bấm khung hội thoại, nút **TIẾP TỤC** hoặc phím `Space` để đọc tiếp.
- Bấm **QUÉT HIỆN TRƯỜNG** hoặc phím `Q` để làm lộ các điểm đáng ngờ.
- Bấm **SỔ** hoặc phím `N` để xem chứng cứ, lời khai và dòng thời gian.
- Trong suy luận cuối, nối đúng hai chứng cứ trước khi chọn kết luận.

## Cấu trúc

- `index.html` — giao diện và các lớp màn hình.
- `assets/` — bối cảnh và chân dung anime-noir nguyên bản, đã nén để chơi local nhanh.
- `styles.css` — bố cục visual novel, hoạt ảnh, màu sắc và responsive.
- `game.js` — cốt truyện, chứng cứ, nghi phạm, hội thoại, lưu game và hệ thống suy luận.
- `AGENTS.md` — hướng dẫn ngắn cho Codex khi sửa game sau này.
- `NOTICE.md` — ghi chú fan project và quyền sở hữu nhân vật.

## Gameplay hiện có

- Giao diện visual novel anime-noir với ba bối cảnh và tám chân dung nguyên bản.
- Ba địa điểm có điểm tương tác: Phòng thu A, Phòng điều khiển và Hành lang.
- Chín chứng cứ, bốn màn phân tích dữ liệu và sáu chứng cứ cốt lõi.
- Bốn cuộc hỏi cung; mỗi lời khai phải được kiểm tra bằng chứng cứ.
- Năm chặng suy luận: nối cặp manh mối rồi mới được đưa ra kết luận.
- Xếp hạng S/A/B dựa trên số lần suy luận sai.
- Lưu tiến độ bằng `localStorage`.
- Nhạc piano trinh thám nguyên bản được tổng hợp trực tiếp bằng Web Audio.
- Hỗ trợ máy tính và điện thoại.

## Đưa lên GitHub

Nên để repository **private** vì dự án dùng tên các nhân vật có bản quyền. Sau khi tạo repository trống, có thể đẩy mã nguồn bằng GitHub Desktop hoặc Git:

```bash
git init
git add .
git commit -m "feat: first playable detective case"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

## Lưu ý

Đây là fan project phi thương mại, không phải sản phẩm chính thức và không liên kết với Gosho Aoyama, Shogakukan, TMS Entertainment hoặc các đơn vị sở hữu quyền liên quan. Mã nguồn và vụ án mới được tạo cho mục đích thử nghiệm cá nhân; tên và nhân vật gốc vẫn thuộc về chủ sở hữu tương ứng.
