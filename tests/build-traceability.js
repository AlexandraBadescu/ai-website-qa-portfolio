#!/usr/bin/env node
// © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
// Generates docs/traceability.md from the requirements, the test cases and the latest results.
// Usage: node tests/run-tests.js --report reports/test-results.json && node tests/build-traceability.js
const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '..');
const reqDoc = fs.readFileSync(path.join(repo, 'docs/quality-gate-requirements.md'), 'utf8');
const { cases } = JSON.parse(fs.readFileSync(path.join(__dirname, 'cases.json'), 'utf8'));
const resultsFile = path.join(repo, 'reports/test-results.json');
const results = fs.existsSync(resultsFile) ? JSON.parse(fs.readFileSync(resultsFile, 'utf8')) : null;
const resultById = new Map((results ? results.results : []).map(r => [r.id, r]));

// Requirement rows look like: | NR-S03 | a link points to ... | `broken-link` |   or   | PC-01 | a minimal ... |
const requirements = [...reqDoc.matchAll(/^\| (NR-[SCG]\d{2}|PC-\d{2}) \| (.+?) \|(?: (.+?) \|)?$/gm)]
  .map(m => ({ id: m[1], text: m[2].replace(/…/g, '').trim(), expected: (m[3] || '').trim() }));

const group = id => id.startsWith('NR-S') ? 'Site checks' : id.startsWith('NR-C') ? 'CV checks' : id.startsWith('NR-G') ? 'Acceptance specifications' : 'Positive controls';
const order = ['Site checks', 'CV checks', 'Acceptance specifications', 'Positive controls'];

let out = `# Traceability matrix

**In plain words:** every requirement for the quality gate, the test that proves it, and whether that test passed on the last run. If a requirement had no test, or a test had no requirement, \`npm test\` would fail.

- **Generated:** ${results ? results.date.slice(0, 10) : 'not yet run'} by \`tests/build-traceability.js\`. Don't edit by hand.
- **Requirements:** [quality-gate-requirements.md](quality-gate-requirements.md) · **Test cases:** [tests/cases.json](../tests/cases.json) · **Acceptance specification:** [features/quality-gate.feature](../features/quality-gate.feature)
- **Last run:** ${results ? `${results.results.filter(r => r.pass).length}/${results.results.length} tests behaved as required` : 'no results yet'}

A negative test (NR) passes when the check **fails with exactly the expected failure type, and nothing else**. A positive control (PC) passes when the check **passes with no failures**.
`;

for (const g of order) {
  const rows = requirements.filter(r => group(r.id) === g);
  if (!rows.length) continue;
  out += `\n## ${g}\n\n| Requirement | ${g === 'Positive controls' ? 'Must pass when' : 'Must fail when'} | Test fixture | Expected | Last result |\n|---|---|---|---|---|\n`;
  for (const r of rows) {
    const c = cases.find(x => x.id === r.id);
    const res = resultById.get(r.id);
    const fixture = c ? `\`${c.target}\`${c.args ? ` \`${c.args.join(' ')}\`` : ''}` : '**no test**';
    const expected = c ? (c.exit === 0 && !c.types.length ? 'pass' : `exit ${c.exit}, ${c.types.map(t => '`' + t + '`').join(', ')}`) : '';
    const status = !c ? '❌ untested' : !res ? 'not run' : res.pass ? '✅ pass' : `❌ ${res.problems.join('; ')}`;
    out += `| ${r.id} | ${r.text} | ${fixture} | ${expected} | ${status} |\n`;
  }
}
out += `\n---\n\n© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).\n`;
fs.writeFileSync(path.join(repo, 'docs/traceability.md'), out);
console.log(`docs/traceability.md: ${requirements.length} requirements`);
