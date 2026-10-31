#!/usr/bin/env node
// © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
// Builds the test fixtures in tests/fixtures/. Run: node tests/fixtures/build.js
// Every negative site fixture is the valid base page (PC-01) plus exactly ONE defect,
// so a test can only pass if the gate reports that defect and nothing else.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const here = __dirname;
const SITE = path.join(here, 'site');
const CV = path.join(here, 'cv');
const SPECS = path.join(here, 'specs');
fs.rmSync(SITE, { recursive: true, force: true });
fs.rmSync(CV, { recursive: true, force: true });
fs.rmSync(SPECS, { recursive: true, force: true });

// 1x1 transparent PNG, so image tests don't also cause a 404 console error.
const PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const BASE_CSS = `*{box-sizing:border-box}body{margin:0;font:16px/1.6 system-ui,sans-serif;background:#fff;color:#1d2430}
main{max-width:720px;margin:0 auto;padding:24px 16px}a{color:#1f4fa0}
@media (prefers-color-scheme: dark){body{background:#12161d;color:#eef2f7}a{color:#9cc0ff}}`;

function page({ title = 'Base page', body = '', css = '', lang = 'en', script = '' } = {}) {
  return `<!doctype html>
<html${lang ? ` lang="${lang}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${BASE_CSS}${css}</style>
</head>
<body>
<main>
<h1 id="top">${title}</h1>
<p>A minimal, valid page used as the base for every site fixture.</p>
${body}
</main>
${script}
</body>
</html>
`;
}

function site(id, files) {
  for (const [file, content] of Object.entries(files)) {
    const target = path.join(SITE, id, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

const note = (body = '') => page({ title: 'A note', body: `<p><a href="/">Home</a></p>${body}` });

// ---------- Positive controls ----------
site('PC-01-valid-base', { 'index.html': page() });
site('PC-03-external-links', { 'index.html': page({ body: `<p><a href="https://example.com/">External</a> · <a href="mailto:someone@example.com">Email</a> · <a href="tel:+441234567890">Phone</a></p>` }) });

// ---------- Negative site fixtures: one defect each ----------
site('NR-S02-no-start-page', { 'about.html': page({ title: 'About' }) });
site('NR-S03-anchor-same-page', { 'index.html': page({ body: `<p><a href="#nowhere">Jump</a></p>` }) });
site('NR-S04-anchor-other-page', {
  'index.html': page({ body: `<p><a href="/notes/a#nowhere">Note section</a></p>` }),
  'notes/a.html': note(),
});
site('NR-S05-extensionless-missing', { 'index.html': page({ body: `<p><a href="/notes/missing">Note</a></p>` }) });
site('NR-S06-relative-missing', {
  'index.html': page({ body: `<p><a href="notes/a.html">Note</a></p>` }),
  'notes/a.html': note(`<p><a href="../missing.html">Missing</a></p>`),
});
site('NR-S07-missing-file', { 'index.html': page({ body: `<p><a href="cv/missing.pdf">Download CV</a></p>` }) });
site('NR-S08-overflow-on-load', { 'index.html': page({ body: `<div style="width:600px">This block is wider than a phone screen.</div>` }) });
site('NR-S09-overflow-when-expanded', { 'index.html': page({ body: `<details><summary>More</summary><pre style="white-space:pre;margin:0">this-line-is-deliberately-long-and-unbroken-so-it-overflows-every-screen-up-to-1280px-wide-but-only-when-the-section-is-open-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</pre></details>` }) });
site('NR-S10-overflow-at-860', { 'index.html': page({ css: '@media (min-width:840px) and (max-width:880px){.wide{width:1100px}}', body: `<div class="wide">Only too wide around 860px.</div>` }) });
site('NR-S11-image-alt', { 'index.html': page({ body: `<p><img src="${PIXEL}" width="40" height="40"></p>` }) });
site('NR-S12-contrast', { 'index.html': page({ css: '.faint{color:#9a9a9a}@media (prefers-color-scheme: dark){.faint{color:#4a4f57}}', body: `<p class="faint">Low-contrast text in both colour schemes.</p>` }) });
site('NR-S13-contrast-dark-only', { 'index.html': page({ css: '@media (prefers-color-scheme: dark){.dim{color:#3a3f47}}', body: `<p class="dim">Readable in light mode, too dark in dark mode.</p>` }) });
site('NR-S14-no-lang', { 'index.html': page({ lang: '' }) });
site('NR-S15-link-name', { 'index.html': page({ body: `<p><a href="#top"></a></p>` }) });
site('NR-S16-hidden-in-details', { 'index.html': page({ body: `<details><summary>More</summary><img src="${PIXEL}" width="40" height="40"></details>` }) });
site('NR-S17-target-size', { 'index.html': page({ css: '.t{display:inline-block;width:12px;height:12px;background:#1f4fa0;vertical-align:middle}', body: `<p><a class="t" href="#top" aria-label="One"></a><a class="t" href="#top" aria-label="Two"></a><a class="t" href="#top" aria-label="Three"></a></p>` }) });
site('NR-S18-js-error', { 'index.html': page({ script: `<script>throw new Error('deliberate test error')</script>` }) });
site('NR-S20-defect-on-linked-page', {
  'index.html': page({ body: `<p><a href="/notes/a">Read the note</a></p>` }),
  'notes/a.html': note(`<p><img src="${PIXEL}" width="40" height="40"></p>`),
});
// NR-S19 (path traversal) uses a sibling folder with the same prefix as the site folder.
site('NR-S19-traversal/site', { 'index.html': page() });
site('NR-S19-traversal/site-secret', { 'secret.txt': 'must never be served\n' });

// ---------- Specs ----------
fs.mkdirSync(path.join(SPECS, 'NR-G01-invalid'), { recursive: true });
fs.writeFileSync(path.join(SPECS, 'NR-G01-invalid', 'broken.feature'), 'Feature: Broken\n  Scenario: Missing keyword\n    Given a step\n    this line is not a Gherkin step\n');

// ---------- CVs ----------
const ROLE = '<p><b>QA Engineer | Example Ltd | 2021 – present</b></p><ul>' +
  ['Maintain API and end-to-end regression suites for the main customer journeys.', 'Coordinate releases for two teams with test evidence at go/no-go.', 'Run accessibility checks before each release and raise clear, reproducible issues.', 'Pair with developers on test design during refinement.']
    .map(x => `<li>${x}</li>`).join('') + '</ul>';
const FILL = Array.from({ length: 6 }, () => ROLE).join('');
const css = 'body{font:10.5pt/1.5 Arial,sans-serif;color:#1d2430;margin:0}h1{font-size:18pt;margin:0}h2{font-size:12pt;color:#1f4fa0;border-bottom:1px solid #1f4fa0;margin:14px 0 6px}li{margin:2px 0}.b{break-before:page}';
const header = contact => `<h1>SAM PLACEHOLDER</h1><p>QA Engineer · London · ${contact}</p>`;
const cvPage = (contact = 'Email and phone available on LinkedIn', extra = '') => `<html><body><style>${css}</style>${header(contact)}<h2>EXPERIENCE</h2>${FILL}<div class="b"><h2>MORE EXPERIENCE</h2>${extra}${FILL}</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const tab = await browser.newPage();
  fs.mkdirSync(CV, { recursive: true });
  const pdf = async (name, html) => {
    await tab.setContent(html);
    await tab.pdf({ path: path.join(CV, name), format: 'A4', margin: { top: '16mm', bottom: '16mm', left: '18mm', right: '18mm' } });
  };
  await pdf('PC-04-valid.pdf', cvPage());
  await pdf('PC-05-numbers-not-phones.pdf', cvPage('Email and phone available on LinkedIn', '<p>2019 – 2021 · 2025-2026 · cut 400 to 50 minutes · 87.5% faster · ref 1234567890123 · ISO 27001 · 16 environments</p>'));
  await pdf('PC-06-application.pdf', cvPage('sam.placeholder@example.com · 07700 900123'));
  await pdf('NR-C02-email.pdf', cvPage('sam.placeholder@example.com'));
  await pdf('NR-C03-uk-mobile.pdf', cvPage('07700 900123'));
  await pdf('NR-C04-intl-landline.pdf', cvPage('+44 (0)20 7946 0958'));
  await pdf('NR-C05-three-pages.pdf', `<html><body><style>${css}</style>${header('Email and phone available on LinkedIn')}<h2>EXPERIENCE</h2>${FILL}<div class="b">${FILL}</div><div class="b">${FILL}</div></body></html>`);
  await pdf('NR-C06-one-page.pdf', `<html><body><style>${css}</style>${header('Email and phone available on LinkedIn')}<h2>EXPERIENCE</h2>${FILL}</body></html>`);
  await pdf('NR-C07-footer-only-page.pdf', `<html><body><style>${css}</style>${header('Email and phone available on LinkedIn')}<h2>EXPERIENCE</h2>${FILL}<div class="b" style="position:relative;height:262mm"><p style="position:absolute;bottom:0;margin:0;font-size:9pt">Sam Placeholder · Page 2</p></div></body></html>`);
  await pdf('NR-C08-blank-gap.pdf', `<html><body><style>${css}</style>${header('Email and phone available on LinkedIn')}<h2>EXPERIENCE</h2>${FILL}<div class="b">${ROLE}${ROLE}<div style="height:110mm"></div>${ROLE}</div></body></html>`);
  // NR-C09: text rendered as an image (so nothing is extractable).
  await tab.setViewportSize({ width: 794, height: 1123 });
  await tab.setContent(`<html><body style="margin:40px;font:15px/1.6 Arial">${FILL}</body></html>`);
  const shot = (await tab.screenshot({ fullPage: false })).toString('base64');
  await pdf('NR-C09-image-only.pdf', `<html><body style="margin:0"><img src="data:image/png;base64,${shot}" style="width:100%"><div class="b"></div><img src="data:image/png;base64,${shot}" style="width:100%;break-before:page"></body></html>`);
  await pdf('NR-C10-allow-contact-still-fails.pdf', `<html><body><style>${css}</style>${header('sam.placeholder@example.com · 07700 900123')}<h2>EXPERIENCE</h2>${FILL}<div class="b" style="position:relative;height:262mm"><p style="position:absolute;bottom:0;margin:0;font-size:9pt">Page 2</p></div></body></html>`);
  await browser.close();
  console.log('Fixtures built in', path.relative(process.cwd(), here));
})();
