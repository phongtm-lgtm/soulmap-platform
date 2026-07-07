const { chromium } = require('playwright');

(async () => {
  console.log('Khởi chạy trình duyệt chromium...');
  
  // Mở trình duyệt ở chế độ có giao diện (headed mode)
  // slowMo: 600ms giúp các thao tác click/nhập liệu chậm rãi để người dùng kịp quay video
  const browser = await chromium.launch({
    headless: false,
    slowMo: 700
  });

  // Tạo ngữ cảnh trình duyệt với kích thước chuẩn Full HD 1920x1080
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  console.log('Kết nối tới localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  } catch (e) {
    console.error('Không thể kết nối tới http://localhost:3000. Bạn đã chạy lệnh `npm run dev` chưa?');
    await browser.close();
    process.exit(1);
  }

  // Chờ trang tải hoàn tất
  await page.waitForTimeout(1000);

  // 1. Cuộn trang Landing mượt mà để giới thiệu tính năng
  console.log('1. Cuộn trang Landing...');
  for (let i = 1; i <= 3; i++) {
    await page.evaluate((scrollAmount) => {
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }, 500);
    await page.waitForTimeout(1500);
  }

  // Cuộn ngược lên đầu trang
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);

  // 2. Click "Bắt đầu hành trình" để chuyển sang trang Đăng nhập (Auth)
  console.log('2. Click Bắt đầu hành trình -> Chuyển sang Đăng nhập...');
  await page.click('button:has-text("Bắt đầu hành trình")');
  await page.waitForTimeout(1500);

  // 3. Đăng nhập bằng Google Mockup để thao tác nhanh
  console.log('3. Chọn Đăng nhập qua Google (Mockup)...');
  // Click vào nút đầu tiên trong các biểu tượng social login (nút Google)
  await page.click('.grid-cols-3 button:nth-child(1)');
  
  // Chờ hiệu ứng chuyển cảnh của đăng nhập thành công
  await page.waitForTimeout(3000);

  // 4. Bắt đầu làm bài test MBTI
  console.log('4. Bắt đầu làm bài trắc nghiệm MBTI...');
  await page.click('button:has-text("Bắt đầu hành trình")');
  await page.waitForTimeout(1500);
  await page.click('button:has-text("Bắt đầu làm MBTI")');
  await page.waitForTimeout(1500);

  // 5. Trả lời 10 câu hỏi trắc nghiệm
  // Tự động chọn Option A cho tất cả 10 câu để ra kết quả mẫu là INFJ
  console.log('5. Tự động trả lời 10 câu hỏi...');
  for (let questionNum = 1; questionNum <= 10; questionNum++) {
    console.log(`- Trả lời câu hỏi ${questionNum}/10...`);
    // Click vào lựa chọn đầu tiên (Phương án A)
    await page.locator('div.mx-auto.mt-6.grid button').first().click();
    await page.waitForTimeout(600);
    
    // Bấm nút chuyển câu hỏi
    const nextBtn = page.locator('button', { hasText: /Câu tiếp theo|Khám phá kết quả/ });
    await nextBtn.click();
    await page.waitForTimeout(1000);
  }

  // 6. Nhận kết quả MBTI và tiếp tục mở khóa
  console.log('6. Nhận kết quả MBTI (INFJ) -> Chuyển qua nhập ngày sinh...');
  await page.waitForSelector('button:has-text("Mở khóa SoulMap")');
  await page.waitForTimeout(1500);
  await page.click('button:has-text("Mở khóa SoulMap")');
  await page.waitForTimeout(1500);

  // 7. Nhập thông tin Ngày sinh & Tạo bản đồ
  console.log('7. Nhập ngày sinh và tạo bản đồ...');
  // Giữ nguyên các thông tin mặc định có sẵn (Nam/Nữ, Ngày sinh mẫu)
  // Click "Tạo SoulMap"
  await page.click('button:has-text("Tạo SoulMap")');
  
  // Chờ hiệu ứng vẽ bản đồ sao / sinh mệnh (khoảng 8-9 giây)
  console.log('Đang chờ thuật toán AI dệt Bản đồ sao (8s)...');
  await page.waitForTimeout(9000);

  // 8. Tương tác với Dashboard kết quả & AI Chatbot Linh Nhi
  console.log('8. Bản đồ Soulmap đã mở khóa! Bắt đầu chat với AI Mentor Linh Nhi...');
  
  // Cuộn xuống phần Trò chuyện AI mượt mà
  try {
    await page.locator('.glass-card', { hasText: 'AI Mentor Linh Nhi' }).scrollIntoViewIfNeeded();
  } catch (e) {
    await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }));
  }
  await page.waitForTimeout(1500);

  // Nhập câu hỏi vào khung chat
  const inputSelector = 'input[placeholder*="Hỏi Linh Nhi"]';
  await page.fill(inputSelector, 'Tôi có phù hợp làm Product Manager không?');
  await page.waitForTimeout(1000);
  // Bấm phím Enter để gửi câu hỏi
  await page.press(inputSelector, 'Enter');
  
  // Chờ Linh Nhi phân tích trả lời (3.5s)
  console.log('Linh Nhi đang phân hồi câu hỏi 1...');
  await page.waitForTimeout(3500);

  // Click chọn tiếp chủ đề gợi ý: "Tình duyên của tôi thế nào?"
  console.log('Click chủ đề gợi ý tình duyên...');
  await page.click('button:has-text("Tình duyên của tôi thế nào?")');
  
  // Chờ Linh Nhi trả lời (3.5s)
  console.log('Linh Nhi đang phản hồi câu hỏi 2...');
  await page.waitForTimeout(3500);

  // 9. Xem Bản đồ hành trình (Scenic Map)
  console.log('9. Chuyển sang xem sơ đồ 4 Chặng Đường hành trình...');
  // Cuộn lên đầu trang
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await page.waitForTimeout(1000);

  // Click vào nút "Hành trình" trên Navbar để hiển thị Bản đồ 4 chặng đường
  await page.locator('nav').locator('text=Hành trình').first().click();
  await page.waitForTimeout(2000);

  // Cuộn nhẹ xuống để ngắm bản đồ
  await page.evaluate(() => {
    window.scrollBy({ top: 300, behavior: 'smooth' });
  });
  
  // Chờ thêm 4 giây để kết thúc video ghi hình
  console.log('Hoàn thành quá trình demo! Video kết thúc sau 4 giây.');
  await page.waitForTimeout(4000);

  // Đóng trình duyệt
  await browser.close();
  console.log('Đã kết thúc tự động hóa.');
})();
