const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const baseUrl = process.env.DEMO_BASE_URL || 'http://localhost:3000';
const outputDir = path.resolve(__dirname, '../../artifacts/demo-video/raw');

const pause = (page, milliseconds = 1800) => page.waitForTimeout(milliseconds);

async function smoothScroll(page, top, duration = 1200) {
  await page.evaluate(({ top, duration }) => {
    const start = window.scrollY;
    const distance = top - start;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
      window.scrollTo(0, start + distance * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { top, duration });
  await pause(page, duration + 500);
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: outputDir, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();
  const video = page.video();

  console.log(`Opening ${baseUrl}`);
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pause(page, 9000);

  console.log('Scene 1: Landing');
  await smoothScroll(page, 760, 3000);
  await pause(page, 9000);
  await smoothScroll(page, 1500, 3000);
  await pause(page, 9000);
  await smoothScroll(page, 0, 2500);
  await pause(page, 7000);

  console.log('Scene 2: MBTI shortcut');
  await page.getByRole('button', { name: 'Bắt đầu hành trình' }).first().click();
  await pause(page, 10000);
  const existingResult = page.getByRole('button', { name: 'Tôi đã có kết quả MBTI' });
  if (!(await existingResult.isVisible())) {
    // Logged-out landing enters demo auth. Use local demo auth, then return to onboarding.
    await page.locator('.grid-cols-3 button').first().click();
    await pause(page, 2200);
    await page.goto(`${baseUrl}/mbti-test`, { waitUntil: 'domcontentloaded' });
  }
  await page.getByRole('button', { name: 'Tôi đã có kết quả MBTI' }).click();
  await pause(page, 6000);
  await page.getByRole('combobox', { name: 'Chọn loại MBTI của bạn' }).selectOption('INFJ');
  await pause(page, 5000);
  await page.getByRole('button', { name: 'Tiếp tục với kết quả này' }).click();
  await pause(page, 10000);

  console.log('Scene 3: MBTI result and birth profile');
  await smoothScroll(page, 520, 2000);
  await pause(page, 10000);
  await page.getByRole('button', { name: 'Mở khóa SoulMap' }).click();
  await pause(page, 12000);
  await page.getByRole('button', { name: 'Tạo SoulMap' }).click();
  await pause(page, 18000);

  console.log('Scene 4: Journeys');
  await page.getByRole('button', { name: /Vào Journey ngay/i }).click();
  await pause(page, 12000);
  await smoothScroll(page, 520, 2500);
  await pause(page, 10000);
  const careerCard = page.locator('article, div').filter({ hasText: /^Sự nghiệp/ }).last();
  const careerButton = careerCard.getByRole('button', { name: /Tiếp tục hành trình/i });
  if (await careerButton.isVisible()) {
    await careerButton.click();
  } else {
    await page.getByRole('button', { name: /Tiếp tục hành trình/i }).nth(1).click();
  }
  await pause(page, 12000);
  await smoothScroll(page, 700, 2500);
  await pause(page, 9000);
  await smoothScroll(page, 1350, 2500);
  await pause(page, 9000);

  console.log('Scene 5: AI Mentor');
  const mentorLink = page.getByText('AI Mentor', { exact: true }).first();
  await mentorLink.click();
  await pause(page, 12000);
  const composer = page.getByPlaceholder('Hãy hỏi Linh Nhi về sự nghiệp, tình yêu hoặc cuộc sống...');
  await composer.fill('Tôi cảm thấy mất động lực trong công việc hiện tại. Tôi nên bắt đầu thay đổi từ đâu?');
  await pause(page, 5000);
  await composer.press('Enter');
  await pause(page, 18000);

  await context.close();
  await browser.close();
  const recordedPath = await video.path();
  const finalPath = path.join(outputDir, 'soulmap-product-demo.webm');
  fs.renameSync(recordedPath, finalPath);
  console.log(`Recorded: ${finalPath}`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
