#!/usr/bin/env node
// © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
// Runs every case in tests/cases.json and checks that the gate behaves as required:
//   - the exit code matches
//   - the failure TYPES reported match the expected set exactly (nothing missing, nothing extra)
//   - where specified, failures appear only on the expected widths, colour schemes or pages
//   - where specified, the output contains the expected message
// Usage: node tests/run-tests.js [--only NR-S08,NR-C02] [--report reports/test-results.json]
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const repo = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const opt = name => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
const only = opt('--only') ? new Set(opt('--only').split(',')) : null;
const reportFile = opt('--report');
const { cases } = JSON.parse(fs.readFileSync(path.join(__dirname, 'cases.json'), 'utf8'));

// Map tool output to failure types.
function siteTypes(stdout, report) {
  const found = new Map(); // type -> { widths:Set, schemes:Set, pages:Set }
  const add = (type, r) => {
    if (!found.has(type)) found.set(type, { widths: new Set(), schemes: new Set(), pages: new Set() });
    if (r) { const f = found.get(type); f.widths.add(r.width); f.schemes.add(r.scheme); f.pages.add(r.page.replace(/\.html$/, '')); }
  };
  if (/site folder not found/.test(stdout)) add('no-site');
  if (/no pages found/.test(stdout)) add('no-pages');
  if (report) {
    for (const link of report.brokenLinks) add(link.startsWith('start page') ? 'no-start-page' : 'broken-link');
    for (const r of report.results) for (const problem of r.problems) {
      if (problem.startsWith('horizontal scroll') && problem.includes('once sections are expanded')) add('overflow-expanded', r);
      else if (problem.startsWith('horizontal scroll')) add('overflow', r);
      else if (problem.startsWith('WCAG: ')) for (const rule of problem.slice(6).split(', ')) add('wcag:' + rule.replace(/ \(\d+\)$/, ''), r);
      else if (problem.startsWith('errors: ')) add('console-error', r);
      else add('unknown', r);
    }
  }
  return found;
}

function cvTypes(stdout) {
  const found = new Map();
  for (const line of stdout.split('\n').filter(l => l.startsWith('FAIL '))) {
    const type = /file not found/.test(line) ? 'not-found'
      : /email address/.test(line) ? 'email'
      : /phone number/.test(line) ? 'phone'
      : /pages, expected/.test(line) ? 'page-count'
      : /text covers only/.test(line) ? 'coverage'
      : /blank gap/.test(line) ? 'gap'
      : /extractable text/.test(line) ? 'no-text' : 'unknown';
    found.set(type, {});
  }
  return found;
}

function run(c) {
  const target = path.join(repo, c.target);
  if (c.kind === 'site') {
    const reportPath = path.join(os.tmpdir(), `gate-${c.id}-${process.pid}.json`);
    fs.rmSync(reportPath, { force: true });
    const r = spawnSync(process.execPath, [path.join(repo, 'checks/site-checks.js'), target, '--report', reportPath, ...(c.args || [])], { encoding: 'utf8' });
    const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : null;
    return { exit: r.status, out: r.stdout + r.stderr, types: siteTypes(r.stdout + r.stderr, report) };
  }
  if (c.kind === 'cv') {
    const r = spawnSync('python3', ['-B', path.join(repo, 'checks/cv-checks.py'), target, ...(c.args || [])], { encoding: 'utf8' });
    return { exit: r.status, out: r.stdout + r.stderr, types: cvTypes(r.stdout) };
  }
  if (c.kind === 'specs') {
    const r = spawnSync(process.execPath, [path.join(repo, 'checks/validate-specs.js'), target], { encoding: 'utf8' });
    const types = new Map(/^FAIL /m.test(r.stdout) ? [['invalid-spec', {}]] : []);
    return { exit: r.status, out: r.stdout + r.stderr, types };
  }
  if (c.kind === 'unit') {
    const r = spawnSync(process.execPath, [target], { encoding: 'utf8' });
    return { exit: r.status, out: r.stdout + r.stderr, types: new Map(/^FAIL /m.test(r.stdout) ? [['unit-failure', {}]] : []) };
  }
  throw new Error(`unknown kind ${c.kind}`);
}

// Traceability: every requirement must have a test, and every test must trace to a requirement.
const requirementsDoc = fs.readFileSync(path.join(repo, 'docs/quality-gate-requirements.md'), 'utf8');
const requirementIds = new Set([...requirementsDoc.matchAll(/^\| (NR-[SCG]\d{2}|PC-\d{2}) \|/gm)].map(m => m[1]));
const caseIds = new Set(cases.map(c => c.id));
const untested = [...requirementIds].filter(id => !caseIds.has(id));
const orphaned = [...caseIds].filter(id => !requirementIds.has(id));
if (!only) {
  console.log(`Traceability: ${requirementIds.size} requirements, ${caseIds.size} tests`);
  if (untested.length) console.log(`FAIL  requirements with no test: ${untested.join(', ')}`);
  if (orphaned.length) console.log(`FAIL  tests with no requirement: ${orphaned.join(', ')}`);
  console.log('');
}

const results = [];
for (const c of cases.filter(c => !only || only.has(c.id))) {
  const actual = run(c);
  const problems = [];
  if (actual.exit !== c.exit) problems.push(`exit ${actual.exit}, expected ${c.exit}`);
  const got = [...actual.types.keys()].sort();
  const want = [...c.types].sort();
  const missing = want.filter(t => !got.includes(t));
  const extra = got.filter(t => !want.includes(t));
  if (missing.length) problems.push(`missing: ${missing.join(', ')}`);
  if (extra.length) problems.push(`unexpected: ${extra.join(', ')}`);
  for (const [type, where] of Object.entries(c.where || {})) {
    const seen = actual.types.get(type);
    if (!seen) continue;
    for (const key of ['widths', 'schemes', 'pages']) {
      if (!where[key]) continue;
      const a = [...seen[key]].map(String).sort().join(',');
      const e = where[key].map(String).sort().join(',');
      if (a !== e) problems.push(`${type} ${key}: got ${a || 'none'}, expected ${e}`);
    }
  }
  if (c.message && !actual.out.includes(c.message)) problems.push(`output doesn't mention "${c.message}"`);
  const pass = problems.length === 0;
  console.log(`${pass ? 'pass' : 'FAIL'}  ${c.id.padEnd(7)} ${pass ? `exit ${actual.exit}${got.length ? ', ' + got.join(', ') : ''}` : problems.join('; ')}`);
  results.push({ id: c.id, pass, exit: actual.exit, types: got, problems });
}

const traceFailures = only ? 0 : untested.length + orphaned.length;
const failed = results.filter(r => !r.pass).length + traceFailures;
console.log(`\n${results.filter(r => r.pass).length}/${results.length} tests behaved as required${traceFailures ? `, ${traceFailures} traceability gap(s)` : ''}`);
if (reportFile) {
  fs.mkdirSync(path.dirname(path.resolve(reportFile)), { recursive: true });
  fs.writeFileSync(reportFile, JSON.stringify({ date: new Date().toISOString(), traceability: { requirements: [...requirementIds], untested, orphaned }, results }, null, 2));
}
process.exit(failed ? 1 : 0);
