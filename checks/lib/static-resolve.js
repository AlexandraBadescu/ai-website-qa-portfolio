// © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
// Resolves a URL path to a file inside `root` the way static hosts do:
// exact file, then .html, then /index.html. Returns null for anything outside root,
// including a sibling folder that shares a name prefix (root "site" vs "site-secret").
const fs = require('fs');
const path = require('path');

function resolveFile(root, urlPath) {
  let clean;
  try { clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]); } catch { return null; }
  const candidates = clean.endsWith('/') ? [clean + 'index.html'] : [clean, clean + '.html', clean + '/index.html'];
  for (const candidate of candidates) {
    const file = path.join(root, candidate);
    const inside = file === root || file.startsWith(root + path.sep);
    if (inside && fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

module.exports = { resolveFile };
