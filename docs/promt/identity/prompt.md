# Journey "Tôi là ai"

Nguồn prompt chạy ở backend: `soulmap-web/src/lib/identityJourneyPrompt.ts`.

## Contract

- Input: thông tin người dùng, dữ liệu lá số Tử Vi có cấu trúc và đại vận hiện tại.
- Output: JSON theo kiểu `IdentityJourneyReading`.
- Mỗi chapter gồm `strength` và `watchOut`.

## Quy tắc nội dung

- Tiêu đề chapter tạo riêng theo lá số, không dùng danh sách title cố định.
- Điểm mạnh và điểm cần lưu ý phải bám dữ liệu lá số, nhưng không trả căn cứ kỹ thuật ra response.
- Điểm cần lưu ý là hướng cân bằng hành vi, không phải kết luận định mệnh.
- Ưu tiên Mệnh, Thân, Mệnh - Quan - Tài - Di, Phúc Đức, Tứ Hóa và đại vận hiện tại.
