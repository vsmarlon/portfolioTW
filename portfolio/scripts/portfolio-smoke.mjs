import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { createServer } from 'vite'

const root = resolve(import.meta.dirname, '..')
const artifactDir = globalThis.process.env.PORTFOLIO_ARTIFACT_DIR ?? resolve(tmpdir(), 'opencode', 'portfolio-smoke')
const widths = [320, 375, 640, 768, 1024, 1440]
const locales = ['en', 'pt-BR']
const themes = ['light', 'dark']
const failures = []
let checks = 0

function check(condition, message) {
  checks += 1
  if (!condition) failures.push(message)
}

async function openPage(browser, path, width, locale, theme) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  await context.addInitScript(({ locale: nextLocale, theme: nextTheme }) => {
    globalThis.localStorage.setItem('locale', nextLocale)
    globalThis.localStorage.setItem('theme', nextTheme)
  }, { locale, theme })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle')
  await page.locator('body').waitFor()
  await page.evaluate(() => globalThis.document.fonts.ready)
  await page.waitForFunction(() => globalThis.document.getAnimations().every((animation) => animation.playState === 'finished' || animation.effect?.getComputedTiming().iterations === Infinity))
  for (const error of errors) check(false, `${path} ${width}px ${locale}/${theme} [${page.url()}]: ${error}`)
  return { context, page }
}

async function checkLayout(page, label) {
  const layout = await page.evaluate(() => ({
    viewport: globalThis.innerWidth,
    bodyWidth: globalThis.document.body.scrollWidth,
    documentWidth: globalThis.document.documentElement.scrollWidth,
    header: globalThis.document.querySelector('header')?.getBoundingClientRect().toJSON(),
  }))
  check(layout.bodyWidth <= layout.viewport + 1, `${label}: body horizontal overflow (${layout.bodyWidth} > ${layout.viewport})`)
  check(layout.documentWidth <= layout.viewport + 1, `${label}: document horizontal overflow (${layout.documentWidth} > ${layout.viewport})`)
  if (layout.header) check(layout.header.right <= layout.viewport + 1, `${label}: header reaches beyond viewport`)
}

async function checkHeader(page, label) {
  const metrics = await page.evaluate(() => {
    const header = globalThis.document.querySelector('header')
    const brand = header?.querySelector('[data-header-group="brand"] > a')
    const blogLogo = header?.querySelector('[data-header-group="search"] a[aria-label]')
    const actions = header?.querySelector('#locale-select')?.parentElement
    const rect = (node) => node?.getBoundingClientRect().toJSON()
    return { viewport: globalThis.innerWidth, header: rect(header), brand: rect(brand), actions: rect(actions), brandText: brand?.textContent ?? '', brandSvgs: brand?.querySelectorAll('svg').length ?? 0, blogLogoText: blogLogo?.textContent ?? '', blogLogo: rect(blogLogo), brandLinks: header?.querySelectorAll('[data-header-group="brand"] > a').length ?? 0 }
  })
  const gutter = metrics.viewport >= 1024 ? 32 : metrics.viewport >= 640 ? 24 : 8
  check(metrics.actions?.right <= metrics.viewport - gutter + 1, `${label}: header actions exceed the ${gutter}px right gutter`)
  check(metrics.actions && Math.abs(metrics.actions.right - (metrics.viewport - gutter)) <= 2, `${label}: header actions are not anchored to the expected right gutter`)
  check(!metrics.brand || !metrics.actions || metrics.brand.right <= metrics.actions.left, `${label}: header brand and actions overlap`)
  if (label.startsWith('blog') || label.startsWith('freebay')) {
    check(metrics.blogLogoText.trim() === 'MV', `${label}: blog MV mark is not inside the search form`)
    check((metrics.blogLogo?.width ?? 0) <= 32, `${label}: blog MV mark is not the compact search-form logo`)
    check(metrics.brandLinks === 0, `${label}: blog has a duplicate MV mark beside the hamburger`)
  } else {
    check(metrics.brandText.includes('MV'), `${label}: home brand link is missing the MV mark`)
    check(metrics.brandSvgs === 0, `${label}: home brand link contains an overlaid SVG`)
  }
  check(metrics.header?.right <= metrics.viewport + 1, `${label}: header reaches beyond viewport`)
}

async function checkVisibleCopy(page, label) {
  const copy = await page.evaluate(() => {
    const clone = globalThis.document.body.cloneNode(true)
    clone.querySelectorAll('script,style,pre,code').forEach((node) => node.remove())
    return clone.textContent ?? ''
  })
  const rawKeys = copy.match(/\b(?:home|projects|systems|about|writing|contact|blog|freebay|freebayExtra|nav|header|footer|resume|notFound|language|brand|theme)\.[a-z][\w.]*/g) ?? []
  check(rawKeys.length === 0, `${label}: raw dotted translation key is visible (${[...new Set(rawKeys)].join(', ')})`)
  check(!/\babout\.(?:timeline|focus)\.[a-z][\w.]*/.test(copy), `${label}: raw About timeline/focus translation key is visible`)
}

async function checkExternalLinks(page, label) {
  const external = page.locator('a[href^="http"]')
  const count = await external.count()
  check(count > 0, `${label}: no external links rendered`)
  for (let index = 0; index < count; index += 1) {
    const link = external.nth(index)
    check(await link.getAttribute('target') === '_blank', `${label}: external link is missing target=_blank`)
    check((await link.getAttribute('rel') ?? '').split(/\s+/).includes('noopener') && (await link.getAttribute('rel') ?? '').split(/\s+/).includes('noreferrer'), `${label}: external link is missing noopener noreferrer`)
  }
  check(await external.locator('svg').count() > 0, `${label}: external link has no visible external-link SVG`)
}

async function checkHome(browser, width, locale, theme) {
  const { page, context } = await openPage(browser, '/', width, locale, theme)
  const label = `home ${width}px ${locale}/${theme}`
  await page.getByRole('heading', { level: 1 }).first().waitFor()
  await checkLayout(page, label)
  await checkHeader(page, label)
  await checkVisibleCopy(page, label)
  const aboutCopy = await page.locator('#about').innerText()
  check(aboutCopy.includes(locale === 'en' ? 'Software Engineering Intern · QQTech' : 'Estagiário de Engenharia de Software · QQTech'), `${label}: QQTech title is not translated`)
  check(aboutCopy.includes('Unisinos'), `${label}: Unisinos entry is missing or untranslated`)
  check(await page.locator('html').getAttribute('lang') === locale, `${label}: html lang is wrong`)
  if (width <= 375) {
    const headerBottom = await page.locator('header').evaluate((node) => node.getBoundingClientRect().bottom)
    const homeTop = await page.locator('main > section h1').first().evaluate((node) => node.getBoundingClientRect().top)
    check(homeTop >= headerBottom - 1, `${label}: header overlaps the home content`)
  }
  if (width === 1440 && locale === 'en' && theme === 'light') await page.screenshot({ path: resolve(artifactDir, 'home-desktop-header.png') })
  if (width === 1440 && locale === 'en' && theme === 'light') {
    await page.goto(`${baseUrl}/#about`, { waitUntil: 'domcontentloaded' })
    await page.locator('#about').waitFor()
    await page.screenshot({ path: resolve(artifactDir, 'about-en-timeline.png') })
  }
  if (width === 320 && locale === 'pt-BR' && theme === 'dark') await page.screenshot({ path: resolve(artifactDir, 'header-mobile.png') })

  const select = page.locator('#locale-select')
  await select.selectOption(locale === 'en' ? 'pt-BR' : 'en')
  const switchedLocale = locale === 'en' ? 'pt-BR' : 'en'
  check(await page.locator('html').getAttribute('lang') === switchedLocale, `${label}: language switch did not update html lang`)
  check((await page.getByRole('heading', { level: 1 }).first().innerText()).includes(switchedLocale === 'en' ? 'Full Stack Developer' : 'Desenvolvedor Full Stack'), `${label}: language switch left stale visible copy`)

  if (width === 320 && locale === 'en' && theme === 'light') {
    await page.evaluate(() => { globalThis.document.documentElement.style.fontSize = '200%' })
    await checkLayout(page, `${label} at 200% root text size`)
  }
  await context.close()
}

async function checkBlog(browser, width, locale, theme) {
  const { page, context } = await openPage(browser, '/blog', width, locale, theme)
  const label = `blog ${width}px ${locale}/${theme}`
  await page.getByRole('heading', { level: 1 }).first().waitFor()
  await checkLayout(page, label)
  await checkHeader(page, label)
  await checkVisibleCopy(page, label)
  await checkExternalLinks(page, label)
  if (locale === 'en' && theme === 'light') await page.screenshot({ path: resolve(artifactDir, `blog-${width}.png`) })
  const search = page.locator('#blog-search')
  check(await search.isVisible(), `${label}: search is not visible`)
  if (width <= 375) check((await search.boundingBox())?.width >= width - 24, `${label}: mobile search is not full width`)
  await page.keyboard.press('Control+k')
  check(await page.evaluate(() => globalThis.document.activeElement?.id === 'blog-search'), `${label}: Ctrl+K did not focus search`)
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' })
  await page.locator('main > section h1').first().waitFor()
  await page.keyboard.press('Control+k')
  check(await page.evaluate(() => globalThis.document.activeElement?.id !== 'blog-search'), `${label}: home intercepted Ctrl+K`)
  await page.goto(`${baseUrl}/blog`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /navigation|navegação/i }).click()
  const dialog = page.locator('dialog')
  check(await dialog.isVisible(), `${label}: navigation drawer did not open`)
  await page.keyboard.press('Escape')
  check(!(await dialog.getAttribute('open')), `${label}: Escape did not close navigation drawer`)
  await context.close()
}

async function checkArticle(browser, locale, theme) {
  const { page, context } = await openPage(browser, '/blog', 375, locale, theme)
  const articleLink = page.locator('a[href^="/blog/"]').first()
  const href = await articleLink.getAttribute('href')
  check(Boolean(href), `article ${locale}/${theme}: listing has no article link`)
  await page.goto(`${baseUrl}${href}`, { waitUntil: 'domcontentloaded' })
  await page.locator('[data-blog-article]').waitFor()
  await checkLayout(page, `article ${locale}/${theme}`)
  await checkVisibleCopy(page, `article ${locale}/${theme}`)
  await checkExternalLinks(page, `article ${locale}/${theme}`)
  const headingIds = await page.locator('[data-blog-article] h2[id], [data-blog-article] h3[id]').evaluateAll((nodes) => nodes.map((node) => node.id))
  check(headingIds.length > 0 && headingIds.every(Boolean), `article ${locale}/${theme}: canonical heading ids missing`)
  const firstHeadingHref = `#${headingIds[0]}`
  await page.goto(`${baseUrl}${href}${firstHeadingHref}`, { waitUntil: 'domcontentloaded' })
  await page.locator(`[data-blog-article] #${headingIds[0]}`).waitFor()
  try {
    await page.waitForFunction((id) => {
      const target = globalThis.document.querySelector(`[data-blog-article] #${id}`)
      const headerBottom = globalThis.document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
      if (!target) return false
      const top = target.getBoundingClientRect().top
      return top >= headerBottom - 2 && top <= headerBottom + 80
    }, headingIds[0], { timeout: 5000 })
    check(true, `article ${locale}/${theme}: hash heading is not scrolled below header offset`)
  } catch {
    check(false, `article ${locale}/${theme}: hash heading is not scrolled below header offset`)
  }
  await page.goto(`${baseUrl}${href}`, { waitUntil: 'domcontentloaded' })
  await page.locator('[data-blog-article]').waitFor()
  await page.locator(`a[href$="${firstHeadingHref}"]`).first().click()
  await page.locator(`[data-blog-article] #${headingIds[0]}`).waitFor()
  try {
    await page.waitForFunction((id) => {
      const target = globalThis.document.querySelector(`[data-blog-article] #${id}`)
      const headerBottom = globalThis.document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
      if (!target) return false
      const top = target.getBoundingClientRect().top
      return top >= headerBottom - 2 && top <= headerBottom + 80
    }, headingIds[0], { timeout: 5000 })
    check(true, `article ${locale}/${theme}: clicked heading is not scrolled below header offset`)
  } catch {
    check(false, `article ${locale}/${theme}: clicked heading is not scrolled below header offset`)
  }
  await page.goBack()
  await page.goForward()
  check(new globalThis.URL(page.url()).hash === firstHeadingHref, `article ${locale}/${theme}: back/forward lost heading fragment`)
  await page.goto(`${baseUrl}${href}`, { waitUntil: 'domcontentloaded' })
  await page.locator('[data-blog-article]').waitFor()
  const demoHref = await page.locator('a[href$="#demo"]').first().getAttribute('href')
  check(Boolean(demoHref), `article ${locale}/${theme}: accessible demo link missing`)
  await page.goto(`${baseUrl}${demoHref}`, { waitUntil: 'domcontentloaded' })
  await page.locator('#demo').waitFor()
  check(await page.locator('#demo').isVisible(), `article ${locale}/${theme}: direct demo hash did not resolve`)
  await context.close()
}

async function checkResume(browser, locale, theme) {
  const { page, context } = await openPage(browser, `/cv/${locale}`, 768, locale, theme)
  const label = `resume ${locale}/${theme}`
  await page.locator('[data-testid="resume-ready"]').waitFor()
  check(await page.locator('header.header-enter').count() === 0 && await page.locator('footer').count() === 0, `${label}: site chrome rendered on CV route`)
  check(await page.locator('html').getAttribute('lang') === locale, `${label}: CV html lang is wrong`)
  await checkLayout(page, label)
  const pdfLink = page.locator('a[href$=".pdf"]')
  check(await pdfLink.count() === 1, `${label}: expected exactly one PDF link`)
  check(await pdfLink.getAttribute('download') === null, `${label}: CV PDF link has an automatic download attribute`)
  check(await pdfLink.getAttribute('target') === '_blank', `${label}: CV PDF link is not target=_blank`)
  check((await pdfLink.getAttribute('rel') ?? '').split(/\s+/).includes('noopener') && (await pdfLink.getAttribute('rel') ?? '').split(/\s+/).includes('noreferrer'), `${label}: CV PDF link is missing noopener noreferrer`)
  const pdf = await pdfLink.getAttribute('href')
  const response = await page.request.get(`${baseUrl}${pdf}`)
  const body = await response.body()
  check(response.status() === 200 && response.headers()['content-type']?.includes('application/pdf'), `${label}: download is not an HTTP 200 PDF`)
  check(body.subarray(0, 5).toString() === '%PDF-' && body.length > 1000, `${label}: download is not a real PDF payload`)
  const pageCount = (body.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length
  check(pageCount === 1, `${label}: PDF has ${pageCount} pages; expected exactly 1`)
  const summary = await page.locator('.resume__section').first().innerText()
  check(!/\b(?:junior|seeking)\b/i.test(summary), `${label}: résumé summary still contains junior/seeking language`)
  if (theme === 'light') {
    await page.screenshot({ path: resolve(artifactDir, `cv-${locale}-screen.png`), fullPage: true })
    await page.emulateMedia({ media: 'print' })
    await page.screenshot({ path: resolve(artifactDir, `cv-${locale}-print.png`), fullPage: true })
  }
  await context.close()
}

async function checkFreebay(browser, locale, theme) {
  const { page, context } = await openPage(browser, '/projects/freebay', 375, locale, theme)
  const label = `freebay 375px ${locale}/${theme}`
  await page.getByRole('heading', { level: 1 }).first().waitFor()
  await checkLayout(page, label)
  await checkHeader(page, label)
  await checkVisibleCopy(page, label)
  await checkExternalLinks(page, label)
  check(await page.locator('[data-testid="case-article"]').count() === 1, `${label}: Freebay route did not render the case study article`)
  await context.close()
}

await mkdir(artifactDir, { recursive: true })
const server = await createServer({ root, server: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' })
await server.listen()
const address = server.httpServer?.address()
if (!address || typeof address === 'string') throw new Error('Vite did not expose a TCP listening port')
const baseUrl = `http://127.0.0.1:${address.port}`
let browser
try {
  browser = await chromium.launch()
  for (const locale of locales) for (const theme of themes) for (const width of widths) await checkHome(browser, width, locale, theme)
  for (const locale of locales) for (const theme of themes) {
    await checkBlog(browser, 375, locale, theme)
    await checkBlog(browser, 1440, locale, theme)
    await checkArticle(browser, locale, theme)
    await checkFreebay(browser, locale, theme)
    await checkResume(browser, locale, theme)
  }
} finally {
  await browser?.close()
  await server.close()
}

await writeFile(resolve(artifactDir, 'summary.json'), JSON.stringify({ baseUrl, checks, failures }, null, 2))
globalThis.console.log(`Portfolio smoke: ${checks - failures.length} passed, ${failures.length} failed (${checks} checks).`)
globalThis.console.log(`Observed app: ${baseUrl}`)
globalThis.console.log(`Artifacts: ${artifactDir}`)
if (failures.length) {
  globalThis.console.error(failures.map((failure) => `- ${failure}`).join('\n'))
  globalThis.process.exitCode = 1
}
