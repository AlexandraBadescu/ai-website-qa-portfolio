// © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
// Builds the fictional sample CVs used to demonstrate cv-checks.py.
// sample-cv.pdf: 2 balanced pages, no contact details (should PASS the public checks)
// bad-cv.pdf: contact details, and a page 2 that is empty except for a footer (should FAIL)
const { chromium } = require('playwright');
const path = require('path');

const roles = [
  ['QA Engineer', 'Example Retail Ltd', '2021 – present', [
    'Maintain API and end-to-end regression suites for the checkout and account areas.',
    'Coordinate releases for two product teams and present test evidence at go/no-go meetings.',
    'Introduced exploratory testing charters for new features, agreed with the product owner.',
    'Reduced flaky end-to-end tests by isolating test data per run.',
    'Run accessibility checks before each release and raise issues with clear reproduction steps.',
    'Pair with developers on test design during refinement, so edge cases are agreed before build.',
    'Keep a shared dashboard of open bugs by age and severity for the weekly team review.']],
  ['Junior QA Engineer', 'Sample Logistics Co', '2019 – 2021', [
    'Wrote manual test cases from acceptance criteria and kept them up to date.',
    'Automated smoke tests for the delivery tracking API.',
    'Triaged incoming bugs with developers each week.',
    'Supported user acceptance testing with the operations team.']],
  ['Customer Support Specialist', 'Placeholder Telecom', '2016 – 2019', [
    'Resolved customer issues by phone and chat, and logged recurring problems for the product team.',
    'Wrote help-centre articles for common questions.',
    'Trained new starters on the support tools.']],
];
const skills = ['API testing with Postman', 'End-to-end testing with Playwright', 'Exploratory testing', 'Accessibility checks (WCAG 2.2 AA)', 'CI pipelines', 'Bug triage and reporting', 'Agile and Scrum'];

function cv({ withContact, emptySecondPage }) {
  const css = `body{font:10.5pt/1.5 Arial,sans-serif;color:#1d2430;margin:0}h1{font-size:20pt;margin:0}h2{font-size:12pt;border-bottom:1px solid #1f5fbf;color:#1f5fbf;margin:18px 0 6px}
  .role{margin:10px 0 4px;font-weight:bold}li{margin:3px 0}.page2{break-before:page}.footer{position:absolute;bottom:0;font-size:9pt;color:#666}`;
  const contact = withContact ? 'London · jordan.example@example.com · +44 7700 900123' : 'London · Email and phone available on LinkedIn · linkedin.com/in/jordan-example';
  const exp = roles.map(([t, c, d, b]) => `<p class="role">${t} | ${c} | ${d}</p><ul>${b.map(x => `<li>${x}</li>`).join('')}</ul>`).join('');
  const summary = '<p>Fictional QA engineer with seven years in software testing and customer-facing work. Tests APIs and web journeys, coordinates releases, and turns findings into clear decisions for the team. Everything in this CV is made up so the checks can be demonstrated.</p>';
  const achievements = '<ul><li>Cut a regression run from two hours to forty minutes by running suites in parallel.</li><li>Caught a pricing error before release by testing against the source price list.</li><li>Helped a team adopt exploratory testing charters for every new feature.</li></ul>';
  const page1 = `<h1>JORDAN EXAMPLE</h1><p>QA Engineer | API and end-to-end testing | Release quality</p><p>${contact}</p><h2>SUMMARY</h2>${summary}<h2>KEY ACHIEVEMENTS</h2>${achievements}<h2>EXPERIENCE</h2>${exp}`;
  const page2 = emptySecondPage
    ? `<div class="page2" style="position:relative;height:260mm"><p class="footer">Jordan Example · Fictional CV · Page 2</p></div>`
    : `<div class="page2"><h2>PROJECTS</h2><ul>${Array.from({ length: 6 }, (_, i) => `<li>Fictional side project ${i + 1}: a small test-automation demo with a README, CI run and a short write-up of what it checks and why.</li>`).join('')}</ul>
       <h2>SKILLS</h2><ul>${skills.map(s => `<li>${s}</li>`).join('')}</ul>
       <h2>EARLIER CAREER</h2><p>Retail and hospitality roles before moving into customer support and then software testing, which built a habit of noticing what confuses people.</p>
       <h2>VOLUNTEERING</h2><ul><li>Mentors new testers at a fictional local meetup.</li><li>Reviews accessibility of a fictional charity website each quarter.</li></ul>
       <h2>EDUCATION AND CERTIFICATIONS</h2><p>BSc (Hons), Example University · ISTQB Certified Tester, Foundation Level</p><p>Languages: English (native), Spanish (conversational)</p>
       <h2>INTERESTS</h2><p>Board games, long-distance walking, and finding the edge case in every set of rules.</p></div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${page1}${page2}</body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [file, opts] of [['sample-site/cv/sample-cv.pdf', {}], ['bad-cv.pdf', { withContact: true, emptySecondPage: true }]]) {
    await page.setContent(cv(opts));
    await page.pdf({ path: path.join(__dirname, '..', file), format: 'A4', margin: { top: '16mm', bottom: '16mm', left: '18mm', right: '18mm' } });
    console.log('wrote', file);
  }
  await browser.close();
})();
