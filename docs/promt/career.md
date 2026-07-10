# Journey Prompt - Career

## Nhiệm vụ

Tạo Journey "Sự nghiệp" dựa trên: - Lá số Tử Vi - MBTI - Hồ sơ người
dùng - Journal (nếu có) - Lịch sử trò chuyện (nếu có)

## Phạm vi bắt buộc

- Chỉ luận giải **chặng đường sự nghiệp**.
- Không viết thành bài luận Tử Vi tổng quát.
- Không phân tích tình duyên, hôn nhân, phụ mẫu, huynh đệ, điền trạch, sức khỏe nếu các phần đó không liên quan trực tiếp đến sự nghiệp.
- Không liệt kê tên sao, tên cung, cách cục, tam phương tứ chính, tứ hóa trong nội dung trả về.
- Lá số chỉ là dữ liệu nền để rút ra insight nghề nghiệp bằng ngôn ngữ đời thường.
- Nếu dữ liệu đầu vào chỉ có lá số, vẫn chỉ tạo bản đồ sự nghiệp; không tự bịa công việc hiện tại, ngành hiện tại, kỹ năng hiện có hoặc mục tiêu cá nhân.
- Đầu ra phải là JSON hợp lệ với duy nhất một field top-level: `content`.
- Giá trị của `content` là toàn bộ bài Journey Sự nghiệp dạng markdown.

## Cấu trúc MVP 4 chapter

### Chapter 1 - Bản đồ sự nghiệp

Tổng quan con đường sự nghiệp, động lực, ý nghĩa công việc, kiểu thành
công phù hợp.

### Chapter 3 - Thiên phú và năng lực nổi bật

Điểm mạnh tự nhiên, lợi thế cạnh tranh, năng lực có thể phát triển.

### Chapter 5 - Nhóm nghề nghiệp phù hợp

Đề xuất 5-8 nhóm nghề, giải thích lý do, kỹ năng cần bổ sung.

### Chapter 9 - Chu kỳ phát triển

Phân tích các bước ngoặt sự nghiệp, giai đoạn tích lũy, bứt phá, chuyển đổi, ổn định.

Chỉ sinh 4 chapter trên. Không sinh các chapter khác.

## Dữ liệu AI sử dụng

AI tự tổng hợp từ: - Mệnh - Thân - Quan Lộc - Tài Bạch - Thiên Di - Phúc
Đức - Tam phương tứ chính - Chính tinh - Phụ tinh - Tứ Hóa - Đại vận -
MBTI - Journal

Không trình bày quá trình suy luận.

## Định dạng đầu ra

Chỉ trả về JSON hợp lệ theo đúng dạng sau:

```json
{
  "content": "Toàn bộ nội dung Journey Sự nghiệp ở đây"
}
```

Không thêm bất kỳ field nào khác ngoài `content`.
Không bọc JSON trong markdown fence.
