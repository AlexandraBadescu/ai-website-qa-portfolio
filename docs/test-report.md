# Test report

**In plain words:** on 30 October 2026, the files deployed to the live website, and its downloadable CV, passed every automated check in a local run. GitHub Actions runs the checks' own tests on every push, against fictional test sites, not the real site. The checks were themselves tested against 38 requirements, and every one behaved as required. While testing the checks, I found and fixed 5 bugs in them, including one that would have let them pass without testing anything. The limits of what was proven are listed at the end.

| | |
|---|---|
| **Run date** | 30 October 2026 |
| **Project version** | 1.2.0 |
| **What was tested** | The production build of [alexandrabadescu.com](https://alexandrabadescu.com): the exact files deployed to Netlify at 19:45 on 30 October 2026 (SHA-256 starting `3f08d68bbc16`), plus the quality gate itself |
| **Tools** | Playwright 1.63.0 (Chromium), axe-core 4.10.2, Node 20 for this run (CI now runs Node 22 and 24), Python 3.12, poppler-utils |
| **Accessibility standard** | WCAG 2.2 Level AA |
| **Screen sizes** | 280, 344, 390, 690, 768, 860, 1024 and 1280px, each in light and dark mode |

## 1. The website

| What | Result |
|---|---|
| Site checks on the real site | ✅ **64/64 passed**: 4 pages × 8 widths × 2 colour modes. **49** internal links and anchors checked, **0** broken. |
| CV checks on the real public CV | ✅ **Passed**: 2 pages; text covers 90% and 83% of the page height; no large gaps; no email or phone; 915 words of extractable text. |
| Open bugs | **0**. 27 service impact points of bugs were found and fixed (see the [bug log](defects.md#summary)). |

## 2. The quality gate (testing the tests)

| What | Result |
|---|---|
| Requirement-based tests (`npm test`) | ✅ **38/38** behaved as required: 31 negative tests and 7 positive controls |
| Traceability | ✅ **38** requirements and **38** tests, with none untested and none orphaned. See the [traceability matrix](traceability.md). |
| Traceability check, tested itself | ✅ Removing a test, or adding one with no requirement, makes `npm test` fail |
| Acceptance specifications | ✅ 2 feature files, 59 scenarios, all valid Gherkin |
| Integration example (`examples/broken-site`, 6 defects at once) | ✅ Failed as expected, with all 6 defects reported |

**What "behaved as required" means:**
- A negative test passes only if the check fails with **exactly** the expected failure type, with nothing missing and nothing extra.
- Where it matters, the failure must also appear only on the expected screen widths, colour modes or pages. For example, NR-S13 must fail in dark mode only, and NR-S10 at 860px only.

## 3. Clean-room test

The project was unzipped into an empty folder and set up only as the README says, with nothing carried over from my own machine.

- `npm ci` installed exact versions, with 0 known vulnerabilities.
- `npm test`, and every README command, gave the documented result.
- Every CI step that runs a command was executed in order, and all passed.
- Every link between the documents resolves.

## 4. Continuous integration (GitHub Actions)

CI runs the requirement-based tests and the integration example (sample site must pass, broken site must fail) on every push and pull request. It doesn't check the real website's files; that's the job of the [release workflow](release-evidence.md), which isn't connected to the website's build yet.

In this repository, the first run, on 31 October 2026, passed in about 6 minutes: the commit email audit, **38/38** tests behaving as required, the integration example, and the results upload.

### Update: version 1.3.0, 31 October 2026

Changes to the checks themselves, so the full suite was run again:

- The site checks now run four width and colour-mode combinations at a time, with output in a fixed order. Three runs on the broken example site gave byte-identical output.
- Accessibility failures in the JSON report now include the axe rule, impact, help link and affected elements.
- The local test server only listens on 127.0.0.1.
- The project now requires Node 22 or later, and CI runs on Node 22 and 24.
- The release workflow has a dry run on the fictional sample site, including a negative test that a wrong hash is rejected. Its steps were run locally in order, and all passed.

Result locally on Node 22: **38/38** behaved as required, in 1 minute 21 seconds (down from 1 minute 59). The integration example behaved as expected.

## 5. Bugs found in the checks

All five are written up in full in the [bug log](defects.md#bugs-in-the-checks), with the service impact model.

| ID | In plain words | Service impact | Found by |
|---|---|---|---|
| T01 | The checks passed when there was nothing to test, for example with a mistyped folder | **Very high** | Clean-room edge-case testing |
| T02 | The CI pipeline would have failed on its very first run | Medium | Running each CI step locally |
| T03 | The local test server could serve files from a neighbouring folder | Low | Edge-case testing |
| T04 | A missing CV file showed a crash instead of a message | Low | Edge-case testing |
| T05 | Long reference numbers were flagged as phone numbers | Low | Positive control PC-05 |

**Lesson:** T01–T03 all passed every normal test. Only negative tests and edge cases exposed them, and T05 only showed up because a positive control looked for false alarms.

## 6. Assistant behaviour (verified by review, not automation)

| Rule | Evidence | Result |
|---|---|---|
| Never invent facts or upgrade wording | [Fabrication review](fabrication-review.md): one run with fictional input | 0 unsupported claims, 1 minor rewording flagged. **Signed off by me on 1 November 2026.** |
| Never publish without an explicit "go" | Release history for this project | Followed in every release. This is a process record, not an automated test. |

## Outstanding limitations

1. **Automated accessibility checks cover only part of WCAG 2.2 AA.** The manual checks (keyboard, focus, zoom, text spacing, screen reader) weren't repeated for this report.
2. **The checks ran on the deployed files, not by crawling the live URL.** The live stylesheet was spot-checked in a browser after deploy.
3. **External links aren't checked**, for example LinkedIn. Pages nothing links to are only tested if listed.
4. **The CV checks use heuristics.** Page fill doesn't judge design, extractable text doesn't prove ATS compatibility, and contact detection is pattern-based.
5. **The fabrication review is a single run**, pre-filled by the same assistant that produced the output. I reviewed it independently and signed it off on 1 November 2026. It still needs more runs with [harder inputs](../evals/README.md).
6. **Only Chromium is automated.** Safari and Firefox were checked by hand on real devices.
7. **Dark-mode share of users is an estimate.** D08's rating assumes 10–25% of visitors use dark mode. No analytics are collected, by design.

## How to reproduce

```bash
npm ci && npx playwright install chromium && pip install -r requirements.txt
npm run test:report                                   # all tests, plus a new traceability matrix
node checks/site-checks.js path/to/site --report site-report.json
python3 -B checks/cv-checks.py path/to/cv.pdf
```

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
