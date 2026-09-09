import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createServer } from 'vite'

const root = resolve(import.meta.dirname, '..')
const outputDir = resolve(root, 'public/cv')
// Chromium's generated PDF page objects are sufficient for this one-page invariant.
const countPdfPages = (pdf) => [...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length

const waitForAnimations = () => globalThis.document.fonts.ready.then(() => new Promise((resolvePromise) => {
  const settle = () => {
    if (globalThis.document.getAnimations().every((animation) => animation.playState === 'finished' || animation.effect?.getComputedTiming().iterations === Infinity)) resolvePromise()
    else globalThis.requestAnimationFrame(settle)
  }
  settle()
}))

const validateResume = async (page) => {
  const validation = await page.locator('[data-testid="resume-ready"]').evaluate((resume) => {
    const textElements = [...resume.querySelectorAll('*')].filter((element) => element.textContent?.trim())
    const fonts = [...new Set(textElements.map((element) => globalThis.getComputedStyle(element).fontFamily))]
    const svgAlignment = [...resume.querySelectorAll('a svg')].map((svg) => {
      const link = svg.closest('a')
      const textNodes = []
      const walker = globalThis.document.createTreeWalker(link, globalThis.NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) if (walker.currentNode.textContent?.trim()) textNodes.push(walker.currentNode)
      const textBox = textNodes.reduce((box, node) => {
        const range = new globalThis.Range()
        range.selectNodeContents(node)
        const bounds = range.getBoundingClientRect()
        if (!bounds.height) return box
        return { top: Math.min(box.top, bounds.top), bottom: Math.max(box.bottom, bounds.bottom) }
      }, { top: Infinity, bottom: -Infinity })
      const svgBox = svg.getBoundingClientRect()
      if (!svgBox.height) return 0
      return Math.abs((svgBox.top + svgBox.bottom) / 2 - (textBox.top + textBox.bottom) / 2)
    })
    const lastSection = resume.querySelector('.resume__section:last-child')
    const resumeBox = resume.getBoundingClientRect()
    const lastSectionBox = lastSection?.getBoundingClientRect()
    return {
      fitsA4: Boolean(lastSectionBox && lastSectionBox.bottom <= resumeBox.bottom + 0.5),
      scrollWidth: resume.scrollWidth,
      clientWidth: resume.clientWidth,
      fonts,
      svgAlignment,
    }
  })
  if (!validation.fitsA4 || validation.scrollWidth > validation.clientWidth) throw new Error(`${page.url()} résumé content overflows the A4 page`)
  if (validation.fonts.length !== 1) throw new Error(`${page.url()} résumé uses multiple text fonts: ${validation.fonts.join(', ')}`)
  if (!validation.svgAlignment.every((delta) => Number.isFinite(delta) && delta <= 4.5)) throw new Error(`${page.url()} résumé has an SVG misaligned with its link text: ${JSON.stringify(validation.svgAlignment)}`)
}

await mkdir(outputDir, { recursive: true })
const server = await createServer({ root, server: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' })
await server.listen()
const address = server.httpServer?.address()
if (!address || typeof address === 'string') throw new Error('Vite did not expose a TCP listening port')
const baseUrl = `http://127.0.0.1:${address.port}`
let browser

try {
  browser = await chromium.launch()

  for (const locale of ['en', 'pt-BR']) {
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 } })
    try {
      await page.goto(`${baseUrl}/cv/${locale}`, { waitUntil: 'networkidle' })
      await page.getByTestId('resume-ready').waitFor()
      await page.evaluate(waitForAnimations)
      await page.emulateMedia({ media: 'print' })
      await validateResume(page)
      const pdf = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true, tagged: true })
      const pageCount = countPdfPages(pdf)
      if (pageCount !== 1) throw new Error(`${page.url()} résumé PDF has ${pageCount} pages; expected exactly 1`)
      await writeFile(resolve(outputDir, `Marlon-Vargas-${locale}.pdf`), pdf)
    } finally {
      await page.close()
    }
  }
} finally {
  await browser?.close()
  await server.close()
}

globalThis.console.log('Generated English and Portuguese résumé PDFs in public/cv/.')
