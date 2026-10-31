#!/usr/bin/env node
// © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
// Pre-publish quality gate for a static site.
//
// It serves a local folder the way a static host would, crawls every internal page
// from the start page, then checks:
//   1. Links: every internal link resolves, whether absolute (/notes/a), relative
//      (../notes/a) or extensionless (/notes/a served from notes/a.html), and every
//      #anchor exists on its target page, including anchors on other pages.
//   2. Accessibility: WCAG 2.2 Level AA rules in axe-core, with collapsible
//      <details> sections expanded so hidden content is tested too.
//   3. Layout: no horizontal scrolling, measured both before and after expanding
//      collapsible sections.
//   4. Errors: no console or page errors.
// Checks 2-4 run at every width in WIDTHS, in light and dark mode.
//
// Usage:  node checks/site-checks.js <site-folder> [--report report.json] [extra pages ...]
// Example: node checks/site-checks.js examples/sample-site
// Environment: A11Y_TAGS to change the standard, e.g. wcag2a,wcag2aa,wcag21a,wcag21aa (WCAG 2.1 AA).
// Exit code: 1 if anything fails, so it can run in CI.
//
// What this does NOT cover: automated rules find only part of WCAG issues (see the
// manual checklist in the README), external links are not requested, and pages
// that nothing links to are only tested if listed on the command line.

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const argv = process.argv.slice(2);
const reportIndex = argv.indexOf('--report');
const reportFile = reportIndex >= 0 ? argv.splice(reportIndex, 2)[1] : null;
const root = path.resolve(argv[0] || '.');
const extraPages = argv.slice(1);

if (!argv[0] || !fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`FAIL site folder not found: ${root}\nUsage: node checks/site-checks.js <site-folder> [--report report.json] [extra pages ...]`);
  process.exit(1);
}

// 280/344: folding-phone cover screens · 390: phone · 690: unfolded foldable
// 768: tablet portrait · 860: narrow laptop/tablet landscape (see defect D09) · 1024 · 1280
const WIDTHS = [280, 344, 390, 690, 768, 860, 1024, 1280];
const SCHEMES = ['light', 'dark'];
const A11Y_TAGS = (process.env.A11Y_TAGS || 'wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa').split(',');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2' };
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const { resolveFile: resolveIn } = require('./lib/static-resolve');
const resolveFile = urlPath => resolveIn(root, urlPath);

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url);
  if (!file) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(0, async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const report = { standard: A11Y_TAGS, widths: WIDTHS, schemes: SCHEMES, pages: [], brokenLinks: [], results: [] };
  console.log(`Site: ${root}\nAccessibility standard: ${A11Y_TAGS.join(', ')}\n`);

  // 1. Crawl internal pages and collect every internal link.
  const crawlPage = await browser.newPage();
  const queue = ['/', ...extraPages];
  const seen = new Set();
  const links = []; // { from, href, target, hash }
  while (queue.length) {
    const pagePath = queue.shift();
    if (seen.has(pagePath)) continue;
    seen.add(pagePath);
    const response = await crawlPage.goto(base + pagePath);
    if (!response || response.status() !== 200 || !(response.headers()['content-type'] || '').includes('text/html')) continue;
    report.pages.push(pagePath);
    const hrefs = await crawlPage.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
    for (const href of hrefs) {
      if (/^(mailto|tel|javascript):/i.test(href)) continue;
      const url = new URL(href, base + pagePath);
      if (url.origin !== base) continue; // external links are not requested
      links.push({ from: pagePath, href, target: url.pathname, hash: decodeURIComponent(url.hash.slice(1)) });
      const file = resolveFile(url.pathname);
      if (file && file.endsWith('.html')) queue.push(url.pathname);
    }
  }

  // 2. Check every link target exists, and every #anchor exists on its target page.
  const anchorCache = new Map();
  for (const link of links) {
    if (!resolveFile(link.target)) { report.brokenLinks.push(`${link.from} → ${link.href} (no such page or file)`); continue; }
    if (!link.hash) continue;
    if (!anchorCache.has(link.target)) {
      await crawlPage.goto(base + link.target);
      anchorCache.set(link.target, new Set(await crawlPage.evaluate(() =>
        [...document.querySelectorAll('[id], a[name]')].map(el => el.id || el.getAttribute('name')))));
    }
    if (!anchorCache.get(link.target).has(link.hash)) report.brokenLinks.push(`${link.from} → ${link.href} (no #${link.hash} on ${link.target})`);
  }
  await crawlPage.close();
  if (!report.pages.includes('/')) report.brokenLinks.push('start page / did not load (is there an index.html?)');
  if (!report.pages.length) {
    console.log('FAIL no pages found, so nothing was tested. A gate that tests nothing must not pass.');
    await browser.close(); server.close(); process.exit(1);
  }

  // 3. Layout, accessibility and errors on every page, width and colour scheme.
  for (const scheme of SCHEMES) {
    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      for (const pagePath of report.pages) {
        errors.length = 0;
        await page.goto(base + pagePath);
        const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        const before = await overflow();
        await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
        const after = await overflow();
        await page.addScriptTag({ content: axeSource });
        const violations = await page.evaluate(async tags =>
          (await axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] }))
            .violations.map(v => `${v.id} (${v.nodes.length})`), A11Y_TAGS);

        const problems = [];
        if (before > 0) problems.push(`horizontal scroll ${before}px`);
        if (after > 0 && after !== before) problems.push(`horizontal scroll ${after}px once sections are expanded`);
        if (violations.length) problems.push(`WCAG: ${violations.join(', ')}`);
        if (errors.length) problems.push(`errors: ${errors.join(' | ')}`);
        const label = `${scheme.padEnd(5)} ${String(width).padStart(4)}px ${pagePath}`;
        console.log(problems.length ? `FAIL ${label}  ${problems.join('; ')}` : `pass ${label}`);
        report.results.push({ scheme, width, page: pagePath, pass: !problems.length, problems });
      }
      await context.close();
    }
  }

  await browser.close();
  server.close();
  const failed = report.results.filter(r => !r.pass).length;
  console.log(`\nPages found: ${report.pages.join(', ')}`);
  console.log(`Links checked: ${links.length}`);
  if (report.brokenLinks.length) console.log('Broken links:\n  ' + report.brokenLinks.join('\n  '));
  console.log(`\n${report.results.length - failed}/${report.results.length} page checks passed, ${report.brokenLinks.length} broken links`);
  report.summary = { checks: report.results.length, failed, links: links.length, brokenLinks: report.brokenLinks.length };
  if (reportFile) fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  process.exit(failed || report.brokenLinks.length ? 1 : 0);
});
