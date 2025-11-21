
# TỔNG HỢP SCENE & ASSET GAME

| Scene/Asset         | Tên file (ví dụ)         | Số lượng | Kích thước (px)         | Loại file | Yêu cầu Design |
|---------------------|-------------------------|----------|-------------------------|-----------|----------------|
| **Background**      | background.png/svg      | 3        | 1920x1080, 900x2000, 1200x900 | PNG/SVG   | Nền tươi sáng, scale linh hoạt |
| **Main Board**      | main_board.png/svg      | 1        | ~900x600 (16:9)         | PNG/SVG   | Bo góc, nền trong suốt, đặt thẻ số & hình |
| **Card**            | card.png/svg            | 8+       | 340x100                 | PNG/SVG   | Nền trắng, bo góc, viền cam nhạt |
| **Object Icons**    | apple.png, carrot.png...| 4–8+     | 80x80                   | PNG       | Nền trong suốt, hoạt hình, lặp lại đúng số lượng |
| **Number Font**     | —                       | 4        | —                       | —         | Font chữ to, màu nổi bật, căn giữa thẻ |
| **Character**       | character_left.png, character_right.png | 2 | 220x340 | PNG | Hoạt hình, thân thiện trẻ em |
| **Nút chức năng**   | close.png, replay_btn.png, next_btn.png | 3 | 64x64 | PNG | Nền trong suốt, đồng bộ phong cách |
| **Trang trí nhỏ**   | star.png, moon.png, fishbowl.png | 3+ | 48x48 | PNG | Nền trong suốt, màu sắc tươi sáng |
| **Âm thanh**        | correct.mp3, wrong.mp3, complete.mp3 | 3 | — | MP3/WAV | Vui nhộn, phù hợp trẻ em |
| **Sticker/Animation** | sticker.png, sprite sheet | 1 | 120x120 (hoặc sprite sheet 4–6 frames) | PNG | Hiệu ứng động hoàn thành màn |

## Yêu cầu cho designer
- Asset lẻ ưu tiên SVG, đặt tên rõ ràng, dễ nhận biết
- Nền trong suốt cho asset lẻ (trừ background, main_board)
- Phong cách hoạt hình, màu sắc tươi sáng, thân thiện trẻ em 3–6 tuổi
- Layout linh hoạt, thích ứng tốt với 3 tỉ lệ màn hình (16:9, 9:20, 4:3)
- Nút chức năng đồng bộ phong cách tổng thể
- Đảm bảo 4 ô số và 4 ô hình rõ ràng, dễ thao tác kéo nối
- Khung nội dung căn giữa, chiếm ~80% chiều rộng màn hình

# YÊU CẦU ASSET GAME "NỐI SỐ ĐÚNG – COUNT & MATCH" (CẬP NHẬT)

## Yêu cầu tổng quan cho designer

- Thiết kế 1 màn hình game hoàn chỉnh, bao gồm cả các asset lẻ (nhân vật, vật trang trí, nút, background, icon, v.v.) xuất file SVG riêng biệt, không dính vào nền tổng.
- Cần xuất đủ 3 tỉ lệ màn hình:
  - **Màn hình ngang:** 16:9 (ví dụ: 1920x1080px hoặc 1280x720px)
  - **Màn hình dọc:** 9:20 (ví dụ: 900x2000px hoặc 720x1600px)
  - **Màn hình vuông:** 4:3 (ví dụ: 1200x900px hoặc 800x600px)
- Khung nội dung (content board) căn giữa, chiếm khoảng 80% chiều rộng màn hình.
- Mỗi ô số và ô hình: khoảng 340x100px (hoặc điều chỉnh cho vừa layout), bo góc, có thể trang trí thêm.
- Các asset SVG cần xuất file riêng, đặt tên rõ ràng, dễ nhận biết để lập trình tích hợp.
- Ưu tiên thiết kế linh hoạt, dễ scale cho nhiều tỉ lệ màn hình.
- Bố cục đảm bảo 4 ô số và 4 ô hình luôn rõ ràng, dễ thao tác kéo nối.
- Style vui tươi, phù hợp trẻ em 3–6 tuổi.

## 1. Nền (Background)
- **Tên file:** `background.png` (hoặc SVG nếu cần scale linh hoạt)
- **Kích thước:**
  - 1920x1080 px (16:9)
  - 900x2000 px (9:20)
  - 1200x900 px (4:3)
- **Loại file:** PNG hoặc SVG

## 2. Bảng chính (Main Board)
- **Tên file:** `main_board.png` (hoặc SVG)
- **Kích thước:**
  - 80% chiều rộng màn hình, căn giữa (tham khảo: 900x600 px cho 16:9)
- **Loại file:** PNG hoặc SVG, nền trong suốt
- **Ghi chú:** Bảng bo góc, dùng để đặt các thẻ số và thẻ đồ vật

## 3. Thẻ (Card)
- **Tên file:** `card.png` (hoặc SVG)
- **Kích thước:** 340x100 px (hoặc điều chỉnh cho vừa layout, đảm bảo 4 thẻ xếp dọc hoặc ngang vừa trong bảng)
- **Loại file:** PNG hoặc SVG, nền trắng, bo góc, viền cam nhạt
- **Ghi chú:** Dùng cho cả thẻ số và thẻ đồ vật

## 4. Đồ vật (Object Icons)
- **Tên file:**
  - `apple.png` (quả táo)
  - `carrot.png` (cà rốt)
  - `bird.png` (chim)
  - `horse.png` (ngựa gỗ)
  - `robot.png` (robot)
  - `flower.png` (hoa)
  - `car.png` (xe)
  - ... (bổ sung theo level)
- **Kích thước:** 80x80 px (nền trong suốt)
- **Loại file:** PNG
- **Ghi chú:** Mỗi icon sẽ được lặp lại đúng số lượng trên thẻ

## 5. Số (Number Font)
- **Không cần asset hình ảnh, dùng font chữ to, màu nổi bật (hồng/đỏ), căn giữa thẻ**

## 6. Nhân vật hoạt hình (Character)
- **Tên file:**
  - `character_left.png` (bên trái)
  - `character_right.png` (bên phải)
- **Kích thước:** 220x340 px
- **Loại file:** PNG, nền trong suốt
- **Ghi chú:** Phong cách hoạt hình, thân thiện trẻ em

## 7. Nút chức năng
- **Nút đóng:** `close.png` (64x64 px, PNG, nền trong suốt, đặt góc trên phải)
- **Nút chơi lại:** `replay_btn.png` (64x64 px, PNG, nền trong suốt, đặt góc trên phải)
- **Nút chuyển màn:** `next_btn.png` (64x64 px, PNG, nền trong suốt, đặt góc dưới phải)

## 8. Trang trí nhỏ (Decorations)
- **Tên file:**
  - `star.png` (sao)
  - `moon.png` (trăng)
  - `fishbowl.png` (bể cá)
- **Kích thước:** 48x48 px
- **Loại file:** PNG, nền trong suốt

## 9. Âm thanh (Sound Effects)
- **Tên file:**
  - `correct.mp3` (nối đúng)
  - `wrong.mp3` (nối sai)
  - `complete.mp3` (hoàn thành màn)
- **Loại file:** MP3/WAV
- **Ghi chú:** Âm thanh vui nhộn, phù hợp trẻ em

## 10. Sticker/Animation Hoàn Thành
- **Tên file:** `sticker.png` hoặc sprite sheet animation
- **Kích thước:** 120x120 px (hoặc sprite sheet 4-6 frames, mỗi frame 120x120 px)
- **Loại file:** PNG
- **Ghi chú:** Hiệu ứng động khi hoàn thành màn chơi

---
**Lưu ý:**
- Tất cả asset nên có nền trong suốt (trừ background, main_board)
- Phong cách hoạt hình, màu sắc tươi sáng, thân thiện trẻ em
- Đặt asset vào thư mục `assets/` đúng tên file như trên
- Các asset nút chức năng (replay, next, close) nên đồng bộ phong cách với giao diện tổng thể
- Ưu tiên xuất file SVG cho các asset lẻ để dễ scale và tái sử dụng.
- Đảm bảo layout linh hoạt, thích ứng tốt với cả 3 tỉ lệ màn hình (16:9, 9:20, 4:3).
