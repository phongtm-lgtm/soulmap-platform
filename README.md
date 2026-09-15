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

## Đăng Nhập Google

Tạo OAuth 2.0 Client ID loại **Web application** trong Google Cloud Console,
sau đó thêm các URL frontend (ví dụ `http://localhost:3000` và domain Netlify)
và `soulmap-web/.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

Khai báo cùng Client ID cho backend để endpoint `/api/v1/auth/google` kiểm tra
chữ ký và audience của Google ID token:

```env
SOULMAP_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

Trước khi deploy production, chạy `soulmap-server/src/main/resources/db/users.sql`
trên PostgreSQL. Backend production dùng `ddl-auto: validate`, nên không tự tạo
bảng `users`. Với database đã chạy phiên bản cũ, chạy thêm
`soulmap-server/src/main/resources/db/alter_users_add_mbti.sql` để bổ sung
trường kết quả MBTI.

## Phiên Đăng Nhập

Backend lưu hash của session token trong PostgreSQL và trả cookie `HttpOnly` sau
khi xác thực Google. Chạy thêm `soulmap-server/src/main/resources/db/user_sessions.sql`
và `soulmap-server/src/main/resources/db/user_tuvi_charts.sql` trước khi deploy
production. Với cơ sở dữ liệu đã có bảng `ai_readings`, chạy thêm
`soulmap-server/src/main/resources/db/alter_ai_readings_add_profile_key.sql`.
Cấu hình backend production:

```env
SOULMAP_FRONTEND_ORIGIN="https://app.your-domain.com"
SOULMAP_SESSION_COOKIE_SECURE=true
SOULMAP_SESSION_COOKIE_SAME_SITE=Lax
```

Frontend phải gọi backend tại HTTPS. Khi dùng domain riêng, nên đặt frontend và
API dưới cùng site, ví dụ `app.your-domain.com` và `api.your-domain.com`.

API dưới các nhóm `mbti`, `la-so` và `ai` dùng session để xác định user hiện
tại. AI reading chỉ có thể được đọc bởi đúng user đã tạo nó; frontend không gửi
hoặc quyết định `userId`.

## License

Dự án riêng tư. All rights reserved.
