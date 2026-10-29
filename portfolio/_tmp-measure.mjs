import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1860, height: 1000 } });
await p.goto('http://localhost:5173/blog/movies-flutter-produto-completo', { waitUntil: 'networkidle' });
const diagram = p.locator('[data-blog-article] figure').nth(1);
await diagram.waitFor({ timeout: 15000 });
await diagram.scrollIntoViewIfNeeded();
const info = await p.evaluate(() => {
  const figs = [...document.querySelectorAll('[data-blog-article] figure')];
  const col = document.querySelector('[data-blog-article] > div.mt-8 p').getBoundingClientRect();
  return figs.map((fig) => {
    const img = fig.querySelector('img');
    return { src: img.getAttribute('src'), x: Math.round(fig.getBoundingClientRect().x), w: Math.round(fig.getBoundingClientRect().width), colX: Math.round(col.x), colW: Math.round(col.width) };
  });
});
console.log(JSON.stringify(info, null, 1));
await p.screenshot({ path: 'C:/Users/Qiyana/AppData/Local/Temp/opencode/fig-left.png' });
await b.close();
