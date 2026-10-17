import assert from 'node:assert/strict';
const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const engine = process.env.TEST_BROWSER === 'webkit' ? webkit : chromium;
const browser = await engine.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage({ baseURL: process.env.TEST_URL || 'http://127.0.0.1:8765/' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(process.env.TEST_URL || 'http://127.0.0.1:8765/', { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  for (const width of [320, 390, 768, 820, 1024, 1120, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('#quote-form').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.floating-whatsapp').hidden);
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      fields: [...document.querySelectorAll('.booking-fields input, .booking-fields select, .booking-submit')].map(element => {
        const r = element.getBoundingClientRect();
        const container = element.closest('.booking-fields').getBoundingClientRect();
        return { height: r.height, inside: r.left >= container.left - 1 && r.right <= container.right + 1, clipped: element.scrollWidth > element.clientWidth + 1 };
      })
    }));
    assert.equal(layout.overflow, false, `Horizontal overflow: ${width}`);
    assert(layout.fields.every(field => field.inside && field.height >= 50 && !field.clipped), `Form clipped: ${width}: ${JSON.stringify(layout)}`);
    console.log(`Form layout and floating shortcut OK at ${width}px`);
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  await page.locator('[data-car]').nth(1).click();
  assert.equal(await page.locator('#car').inputValue(), 'Toyota Verso · 2016');
  await page.locator('button[value="whatsapp"]').click();
  assert.equal(await page.locator('#quote-form').evaluate(form => form.checkValidity()), false);
  const pickup = new Date(); pickup.setDate(pickup.getDate() + 10);
  const dateValue = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  await page.locator('#pickup').fill(dateValue(pickup));
  await page.locator('#return').fill(dateValue(pickup));
  assert.equal(await page.locator('#quote-form').evaluate(form => form.checkValidity()), false);
  const dropoff = new Date(pickup); dropoff.setDate(dropoff.getDate() + 3);
  await page.locator('#return').fill(dateValue(dropoff));
  await page.evaluate(() => { window.open = url => { window.capturedQuoteURL = url; }; });
  await page.locator('button[value="whatsapp"]').click();
  const quote = await page.evaluate(() => window.capturedQuoteURL);
  assert(quote.startsWith('https://wa.me/908508400387?text='));
  assert(decodeURIComponent(quote).includes('Toyota Verso · 2016'));
  assert(decodeURIComponent(quote).includes(pickup.toLocaleDateString('tr-TR', {day:'numeric',month:'long',year:'numeric'})));
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), canonical);
  const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  assert(graph['@graph'].some(entity => entity['@type'] === 'AutoRental' && entity.url === canonical));
  const imageURL = await page.locator('meta[property="og:image"]').getAttribute('content');
  assert.equal((await page.request.get(new URL(imageURL).pathname)).status(), 200);
  const robots = await page.request.get('/robots.txt');
  assert.equal(robots.status(), 200); assert((await robots.text()).includes(`${canonical}sitemap.xml`));
  const sitemap = await page.request.get('/sitemap.xml');
  assert.equal(sitemap.status(), 200); assert((await sitemap.text()).includes(`<loc>${canonical}</loc>`));
  assert.deepEqual(errors, []);
  if (process.env.SCREENSHOT_PATH) await page.screenshot({ path: process.env.SCREENSHOT_PATH });
  console.log('Menu, validation, quote message, SEO metadata, structured data and sitemap OK.');
} finally { await browser.close(); }
