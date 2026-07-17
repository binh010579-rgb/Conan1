# Conan — Bản Nhạc Lúc 0 Giờ

Fan game trinh thám 2D chơi trực tiếp trong trình duyệt. Chương đầu là một vụ án nguyên bản tại Nhà hát Tsukikage: lấy lời khai, khám phá vật thể thật trong cảnh, tự đối chiếu mâu thuẫn và dựng lại toàn bộ phương thức gây án.

## Chơi local

1. Giải nén toàn bộ thư mục.
2. Nhấp đúp `index.html` và mở bằng Chrome hoặc Edge.
3. Chọn **Bắt đầu vụ án**. Bản V3 dùng vùng lưu riêng nên không bị lẫn tiến độ V2.

Game không cần cài Node.js, không gọi API và không tải tài nguyên từ Internet.

### Điều khiển

- Bấm khung hội thoại, nút **TIẾP TỤC** hoặc phím `Space` để đọc tiếp.
- Rê chuột hoặc chạm trực tiếp vào đồ vật có thật trong ba cảnh; vật khả nghi chỉ phản sáng nhẹ, không có dấu `+`.
- Bấm **SỔ** hoặc phím `N` để xem riêng Lời khai, Vật chứng, Mâu thuẫn và Dòng thời gian.
- Trên bảng đối chiếu, ghép một mẩu lời khai với một vật chứng. Ghép sai không làm lộ đáp án.
- Ở kết luận cuối, tự gắn thẻ hồ sơ vào năm mắt xích; đoán đúng tên nhưng sai phương thức vẫn không phá được án.

## Cấu trúc

- `index.html` — giao diện và các lớp màn hình.
- `assets/` — bối cảnh và chân dung anime-noir nguyên bản, đã nén để chơi local nhanh.
- `styles.css` — bố cục visual novel, hoạt ảnh, màu sắc và responsive.
- `game.js` — cốt truyện, chứng cứ, nghi phạm, hội thoại, lưu game và hệ thống suy luận.
- `AGENTS.md` — hướng dẫn ngắn cho Codex khi sửa game sau này.
- `NOTICE.md` — ghi chú fan project và quyền sở hữu nhân vật.

## Gameplay hiện có

- Giao diện visual novel anime-noir với ba bối cảnh và tám chân dung nguyên bản.
- Vòng chơi bốn giai đoạn: lấy lời khai → khám phá vật thể → đối chiếu mâu thuẫn → dựng lại vụ án.
- Ba địa điểm có vùng tương tác bám theo đồ vật thật: Phòng thu A, Phòng điều khiển và Hành lang.
- Mười vật thể có thể khám nghiệm; tên và ý nghĩa chỉ hiện sau khi người chơi tự kiểm tra đủ chi tiết.
- Bốn cuộc lấy lời khai không chèn câu hỏi trắc nghiệm; lời nói được lưu nguyên văn trong một mục riêng.
- Phòng pháp y âm thanh cho phép nghe, dịch và đồng bộ hai bản ghi để nhận ra nhịp MIDI máy móc.
- Bảng mâu thuẫn dùng cơ chế ghép thẻ, không dùng đáp án chọn sẵn và không tiết lộ cặp đúng khi ghép sai.
- Kết luận cuối yêu cầu dựng đủ thời điểm, thủ thuật âm thanh, phòng kín, hung khí và thủ phạm.
- Xếp hạng S/A/B/C dựa trên số lần đối chiếu và suy luận sai.
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
