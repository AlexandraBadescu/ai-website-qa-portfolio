// © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
// NR-S19: the local test server must never serve a file outside the site folder.
const assert = require('assert');
const path = require('path');
const { resolveFile } = require('../../checks/lib/static-resolve');

const root = path.resolve(__dirname, '../fixtures/site/NR-S19-traversal/site');
const cases = [
  ['/', true, 'start page resolves'],
  ['/index.html', true, 'file inside the folder resolves'],
  ['/../site-secret/secret.txt', false, 'sibling folder sharing the name prefix is refused'],
  ['/%2e%2e/site-secret/secret.txt', false, 'URL-encoded ../ is refused'],
  ['/../../../../etc/hostname', false, 'deep traversal is refused'],
  ['/%E0%A4%A', false, 'malformed URL encoding is refused, not crashed on'],
];
let failed = 0;
for (const [url, shouldResolve, label] of cases) {
  const resolved = resolveFile(root, url);
  try {
    assert.strictEqual(Boolean(resolved), shouldResolve);
    if (resolved) assert.ok(resolved.startsWith(root + path.sep));
    console.log(`pass ${label}`);
  } catch {
    failed++;
    console.log(`FAIL ${label}: ${url} resolved to ${resolved}`);
  }
}
process.exit(failed ? 1 : 0);
