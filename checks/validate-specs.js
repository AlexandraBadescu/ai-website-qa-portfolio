#!/usr/bin/env node
// © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
// Checks that every acceptance specification in features/ is valid Gherkin, and counts
// its scenarios. It does NOT execute them: there are no step definitions (see README).
// Usage: node checks/validate-specs.js [features-folder]
const fs = require('fs');
const path = require('path');
const { AstBuilder, GherkinClassicTokenMatcher, Parser, compile } = require('@cucumber/gherkin');
const { IdGenerator } = require('@cucumber/messages');

const dir = path.resolve(process.argv[2] || path.join(__dirname, '..', 'features'));
let failed = false;
for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.feature'))) {
  try {
    const doc = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher())
      .parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    console.log(`pass ${file}: ${compile(doc, file, IdGenerator.uuid()).length} scenarios`);
  } catch (error) {
    failed = true;
    console.log(`FAIL ${file}: ${error.message}`);
  }
}
process.exit(failed ? 1 : 0);
