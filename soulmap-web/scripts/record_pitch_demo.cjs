/**
 * Quay demo gọi vốn — ưu tiên landing page desktop rõ ràng.
 * Output: artifacts/demo-video/raw/soulmap-product-demo.webm
 *
 *   $env:DEMO_BASE_URL="https://soulmap-patform.netlify.app"
 *   node scripts/record_pitch_demo.cjs
 */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const baseUrl = process.env.DEMO_BASE_URL || 'http://localhost:3000';
const outputDir = path.resolve(__dirname, '../../artifacts/demo-video/raw');

const pause = (page, ms = 1800) => page.waitForTimeout(ms);

async function smoothScroll(page, top, duration = 1400) {
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
  await pause(page, duration + 400);
}

async function safeClick(locator, timeout = 10000) {
  await locator.first().waitFor({ state: 'visible', timeout });
  await locator.first().click();
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
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await page.setViewportSize({ width: 1920, height: 1080 });

  // —— LANDING (bắt buộc, đủ dài) ——
  console.log('Landing: hero hold');
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause(page, 10000);

  console.log('Landing: scroll pillars');
  await smoothScroll(page, 900, 2800);
  await pause(page, 5000);

  console.log('Landing: journey steps');
  await smoothScroll(page, 1600, 2800);
  await pause(page, 5000);

  console.log('Landing: Linh Nhi block');
  await smoothScroll(page, 2300, 2500);
  await pause(page, 4500);

  console.log('Landing: back to hero + CTA');
  await smoothScroll(page, 0, 2200);
  await pause(page, 3500);

  // —— ENTER PRODUCT ——
  console.log('CTA: Bắt đầu hành trình');
  await safeClick(page.getByRole('button', { name: 'Bắt đầu hành trình' }));
  await pause(page, 2500);

  const existingResult = page.getByRole('button', { name: 'Tôi đã có kết quả MBTI' });
  if (!(await existingResult.isVisible().catch(() => false))) {
    const social = page.locator('.grid-cols-3 button').first();
    if (await social.isVisible().catch(() => false)) {
      await social.click();
      await pause(page, 2200);
    }
    await page.goto(`${baseUrl}/mbti-test`, { waitUntil: 'domcontentloaded' });
    await pause(page, 2000);
  }

  console.log('MBTI shortcut');
  await safeClick(page.getByRole('button', { name: 'Tôi đã có kết quả MBTI' }));
  await pause(page, 2500);
  await page.getByRole('combobox', { name: 'Chọn loại MBTI của bạn' }).selectOption('INFJ');
  await pause(page, 2000);
  await safeClick(page.getByRole('button', { name: 'Tiếp tục với kết quả này' }));
  await pause(page, 4000);

  console.log('MBTI summary → unlock');
  await smoothScroll(page, 400, 1500);
  await pause(page, 3000);
  await safeClick(page.getByRole('button', { name: 'Mở khóa SoulMap' }));
  await pause(page, 4000);

  console.log('Birth → create SoulMap');
  await safeClick(page.getByRole('button', { name: 'Tạo SoulMap' }));
  await pause(page, 12000);

  console.log('Journeys');
  const enterJourney = page.getByRole('button', { name: /Vào Journey ngay/i });
  if (await enterJourney.isVisible().catch(() => false)) {
    await enterJourney.click();
    await pause(page, 5000);
  }
  await smoothScroll(page, 480, 2000);
  await pause(page, 3500);

  const careerButton = page.getByRole('button', { name: /Tiếp tục hành trình/i }).nth(1);
  if (await careerButton.isVisible().catch(() => false)) {
    await careerButton.click();
    await pause(page, 5000);
    await smoothScroll(page, 600, 2000);
    await pause(page, 4000);
    await smoothScroll(page, 1100, 2000);
    await pause(page, 3500);
  }

  console.log('AI Mentor');
  const mentor = page.getByText('AI Mentor', { exact: true }).first();
  if (await mentor.isVisible().catch(() => false)) {
    await mentor.click();
    await pause(page, 4000);
  }
  const composer = page.getByPlaceholder(/Hỏi Linh Nhi|Hãy hỏi Linh Nhi/i).first();
  if (await composer.isVisible().catch(() => false)) {
    await composer.fill('Môi trường làm việc nào hợp với mình nhất?');
    await pause(page, 2000);
    await composer.press('Enter');
    await pause(page, 10000);
  }

  // Journal / Academy thoáng nếu có trên nav
  for (const label of ['Nhật ký', 'Học viện']) {
    const nav = page.getByText(label, { exact: true }).first();
    if (await nav.isVisible().catch(() => false)) {
      await nav.click();
      await pause(page, 2800);
    }
  }

  await pause(page, 2500);
  await context.close();
  await browser.close();

  const recordedPath = await video.path();
  const finalPath = path.join(outputDir, 'soulmap-product-demo.webm');
  if (fs.existsSync(finalPath)) {
    fs.renameSync(finalPath, path.join(outputDir, `soulmap-product-demo-prev-${Date.now()}.webm`));
  }
  fs.renameSync(recordedPath, finalPath);
  console.log(`Recorded: ${finalPath}`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
