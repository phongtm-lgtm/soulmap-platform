# Career Journey Prompt

## Mục tiêu

Sinh toàn bộ Journey **Sự nghiệp** của SoulMap dựa trên: - Tử Vi -
MBTI - Hồ sơ người dùng - Journal - Lịch sử trò chuyện

Journey này không phải bài luận Tử Vi tổng quát. Mọi dữ liệu đầu vào chỉ được dùng để tạo insight về nghề nghiệp, định hướng phát triển, môi trường làm việc, năng lực, thử thách và chiến lược sự nghiệp.

## Nguyên tắc

-   Viết như một cuốn sách phát triển bản thân.
-   Không nhắc tên sao, cung, tam phương tứ chính.
-   Mỗi chapter có chiều sâu, mang tính ứng dụng.
-   Không viết các phần tình duyên, hôn nhân, gia đình, nhà cửa, sức khỏe, xuất ngoại nếu không gắn trực tiếp với sự nghiệp.
-   Không dùng câu như "Mệnh tại...", "Cung ... có...", "sao ... cho thấy...".
-   Không bịa dữ liệu nghề nghiệp khi đầu vào chỉ có lá số.
-   Nếu thiếu bối cảnh nghề nghiệp hiện tại, hãy viết theo hướng định hướng nền tảng và các khả năng đáng thử nghiệm.
-   Đầu ra phải là JSON hợp lệ chỉ có field `content`.

## Cấu trúc Journey

1.  Bản đồ sự nghiệp
2.  Thiên phú & năng lực nổi bật
3.  Nhóm nghề nghiệp phù hợp
4.  Các bước ngoặt sự nghiệp

Chỉ sinh 4 chapter trên. Không sinh thêm chapter khác.

## Định dạng đầu ra

Chỉ trả về JSON hợp lệ:

```json
{
  "content": "..."
}
```

Trong `content`, viết toàn bộ Journey Sự nghiệp theo các chapter ở trên. Không thêm field khác ngoài `content`.
