# Conan — Bản Nhạc Lúc 0 Giờ

Fan game trinh thám 2D chơi trực tiếp trong trình duyệt. Chương đầu là một vụ án nguyên bản tại Nhà hát Tsukikage: lấy lời khai, khám phá vật thể thật trong cảnh, tự đối chiếu mâu thuẫn và dựng lại toàn bộ phương thức gây án.

## Chơi local

1. Giải nén toàn bộ thư mục.
2. Nhấp đúp `index.html` và mở bằng Chrome hoặc Edge.
3. Chọn **Bắt đầu vụ án**. Bản V4 dùng vùng lưu riêng nên không bị lẫn tiến độ cũ.

Game không cần cài Node.js, không gọi API và không tải tài nguyên từ Internet.

### Điều khiển

- Bấm khung hội thoại, nút **TIẾP TỤC** hoặc phím `Space` để đọc tiếp.
- Bấm **CHỮ: LỚN** trên thanh hồ sơ để chuyển giữa ba cỡ chữ: vừa, lớn và rất lớn. Game ghi nhớ lựa chọn này cho lần chơi sau.
- Game chờ Chrome tải giọng Việt (`vi-VN`) rồi mới phát và phụ đề hiện theo đúng từng từ đang được đọc. Bấm **↻ NGHE LẠI** để phát lại; nút **ÂM** điều khiển cả nhạc, hiệu ứng và giọng đọc. Nếu thiết bị thật sự không có giọng Việt, game giữ phụ đề và không tự chuyển sang giọng ngoại ngữ.
- Trong lúc hỏi cung, bấm **GHIM CÂU ĐÁNG NGỜ** ngay khi nghi phạm nói một chi tiết có thể kiểm chứng. Nếu bỏ lỡ, bạn phải nghe lại lời khai.
- Rê chuột hoặc chạm trực tiếp vào đồ vật có thật trong ba cảnh; vật khả nghi chỉ phản sáng nhẹ, không có dấu `+`.
- Thao tác trực tiếp trên vật chứng: lau đồng hồ, soi UV cây đàn, lắp quả nặng, ráp log và đồng bộ hai bản ghi.
- Bấm **SỔ** hoặc phím `N` để xem riêng Lời khai, Vật chứng, Mâu thuẫn và Dòng thời gian.
- Khi đủ vật chứng, tự kéo-thả năm sự kiện vào đúng mốc giờ trước khi được đối chất.
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
- Vòng chơi năm giai đoạn: hỏi cung chủ động → khám nghiệm bằng mini-game → xếp dòng thời gian → đối chiếu mâu thuẫn → dựng lại vụ án.
- Ba địa điểm có vùng tương tác bám theo đồ vật thật: Phòng thu A, Phòng điều khiển và Hành lang.
- Mười vật thể có thể khám nghiệm; tên và ý nghĩa chỉ hiện sau khi người chơi tự kiểm tra đủ chi tiết.
- Bốn cuộc hỏi cung có thanh căng thẳng và cơ chế ghim câu đáng ngờ đúng lúc; lời nói vẫn được lưu nguyên văn trong một mục riêng.
- Năm thử nghiệm vật chứng khác nhau, được thiết kế để thay thao tác “bấm đọc”: lau kính, đèn UV, lắp vật thể, ráp log và pháp y âm thanh.
- Phòng pháp y âm thanh cho phép nghe, dịch và đồng bộ hai bản ghi để nhận ra nhịp MIDI máy móc.
- Bàn dòng thời gian hỗ trợ kéo-thả trên máy tính và chọn-thẻ/chạm-ô trên điện thoại; chấm cả chuỗi mà không lộ ô sai.
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
