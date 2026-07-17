# Conan — Bản Nhạc Lúc 0 Giờ

Fan game trinh thám 2D chơi trực tiếp trong trình duyệt. Chương đầu là một vụ án nguyên bản tại Nhà hát Tsukikage: người chơi điều khiển Conan, khám phá hiện trường, thu thập chứng cứ, hỏi cung bốn nghi phạm và hoàn thành chuỗi suy luận cuối cùng.

## Chơi local

1. Giải nén toàn bộ thư mục.
2. Nhấp đúp `index.html` và mở bằng Chrome hoặc Edge.
3. Chọn **Bắt đầu điều tra**.

Game không cần cài Node.js, không gọi API và không tải tài nguyên từ Internet.

## Cấu trúc

- `index.html` — giao diện và các lớp màn hình.
- `styles.css` — toàn bộ hình ảnh 2D, hoạt ảnh và responsive; không dùng ảnh ngoài.
- `game.js` — cốt truyện, chứng cứ, nghi phạm, hội thoại, lưu game và hệ thống suy luận.
- `AGENTS.md` — hướng dẫn ngắn cho Codex khi sửa game sau này.
- `NOTICE.md` — ghi chú fan project và quyền sở hữu nhân vật.

## Gameplay hiện có

- Mở đầu theo phong cách visual novel.
- Ba địa điểm có điểm tương tác: Phòng thu A, Phòng điều khiển và Hành lang.
- Chín chứng cứ, sáu chứng cứ cốt lõi.
- Bốn cuộc hỏi cung.
- Năm câu suy luận có phản hồi đúng/sai.
- Xếp hạng S/A/B dựa trên số lần suy luận sai.
- Lưu tiến độ bằng `localStorage`.
- Âm thanh không bản quyền được tổng hợp trực tiếp bằng Web Audio.
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
