# SOULMAP Platform

SOULMAP là nền tảng khám phá bản thân và định hướng phát triển cá nhân bằng AI.

Sản phẩm giúp người dùng tổng hợp dữ liệu tính cách, thông tin ngày sinh và lá số Tử Vi Việt Nam thành một bản đồ cá nhân hóa, từ đó hỗ trợ người dùng hiểu bản thân, nhận diện điểm mạnh, điểm mù và định hướng phát triển phù hợp.

## Giá Trị Cốt Lõi

- Hiểu bản thân sâu hơn.
- Kết nối dữ liệu cá nhân thành insight dễ hiểu.
- Cá nhân hóa hành trình phát triển.
- Đồng hành cùng người dùng thông qua AI Mentor.
- Chuyển hóa insight thành hành động thực tế.

## Nguyên Tắc Nội Dung

- Không đưa ra dự đoán tuyệt đối.
- Không trình bày Tử Vi như định mệnh cố định.
- Không đưa ra chẩn đoán y tế hoặc tâm lý.
- Ưu tiên tự nhận thức, phản chiếu và hành động thực tế.

## Share Backend Cho Netlify

Backend local có thể được chia sẻ qua ngrok cho frontend tại
`https://soulmap-patform.netlify.app`. Các API controller hiện cho phép CORS từ
mọi domain để phục vụ giai đoạn test.

Yêu cầu: Java 21, PostgreSQL, ngrok đã đăng nhập và `soulmap-server/.env` đã
được cấu hình đầy đủ. Chạy trong PowerShell:

```powershell
cd "D:\Manh Phong\soulmap-platform\soulmap-server"
powershell -ExecutionPolicy Bypass -File .\start-share.ps1
```

Script sẽ chạy backend, kiểm tra health, mở ngrok và in giá trị cần khai báo
trên Netlify:

```env
NEXT_PUBLIC_API_BASE_URL=https://<ngrok-domain>.ngrok-free.app/api/v1
```

Sau khi cập nhật biến môi trường, redeploy frontend trên Netlify. Giữ terminal
chạy trong suốt thời gian test; nhấn `Ctrl+C` để dừng backend và ngrok.

## License

Dự án riêng tư. All rights reserved.
