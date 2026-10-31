# Bug log

**In plain words:** every problem found while building the website, and while testing the checks themselves. Each one is written up with the same [bug template](bug-template.md): what went wrong, what should have happened, how much it mattered and what fixed it.

- **Website bugs (D01–D10):** 10 issues investigated. 8 were real bugs, and 2 turned out not to be bugs.
- **Bugs in the checks (T01–T05):** 5 bugs, found by testing the quality gate itself.

## Summary

| ID | Title | Affected users | Severity | **Service impact** | Points | Status |
|---|---|---|---|---|---|---|
| D01 | Phone menu hides most sections off-screen | Very large | Medium | **Medium** | 2 | Fixed |
| D02 | Menu labels cut off on folding-phone cover screens | Low | Low | **Low** | 1 | Fixed |
| D03 | Downloadable CV has a half-empty second page | Large | Low | **Low** | 1 | Fixed |
| D04 | Contact buttons look unanchored next to the text | Very large | Low | **Medium** | 2 | Fixed |
| D05 | Review reported missing articles and CV download | — | — | Not rated | 0 | Not a defect |
| D06 | Lighthouse reported slow, unused JavaScript | — | — | Not rated | 0 | Not a defect |
| D07 | Homepage intro line missing its styling | Very large | Low | **Medium** | 2 | Fixed |
| D08 | Homepage headline unreadable in dark mode | Large | High | **High** | 4 | Fixed |
| D09 | Menu spills out of the header on some tablets | Medium | Low | **Low** | 1 | Fixed |
| D10 | AI summary file causes a browser warning | Low | Low | **Low** | 1 | Fixed |
| T01 | Checks pass when there was nothing to test | Large | Very high | **Very high** | 8 | Fixed |
| T02 | Automated pipeline would fail on its first run | Very large | Medium | **Medium** | 2 | Fixed |
| T03 | Test server could serve files from a neighbouring folder | Low | Medium | **Low** | 1 | Fixed |
| T04 | Missing CV file shows a crash instead of a message | Medium | Low | **Low** | 1 | Fixed |
| T05 | Long reference numbers flagged as phone numbers | Medium | Medium | **Low** | 1 | Fixed |

Service impact = severity × affected users, read from the [matrix](bug-template.md#matrix). Points: Very high 8, High 4, Medium 2, Low 1.

**Total service impact retired:** 14 points of website bugs and 13 points of bugs in the checks. **Open now: 0.**

---

## Website bugs

### D01: Phone menu hides most sections off-screen

**Description**
On phones, the top menu showed only the first few sections. The rest were hidden past the right edge of the screen, with no sign that you could swipe.

**Expected behaviour**
All eight menu items are visible on a phone without swiping.

**Actual behaviour**
The menu was one sideways-scrolling strip. "Approach", "Kind words", "Notes", "Skills" and "Contact" were off-screen.

**Where and how to reproduce**
- Environment: any phone, or a browser narrower than 720px, in light or dark mode
- Steps: 1. Open the site on a phone. 2. Look at the menu at the top.

**Service impact**
- Affected users: **Very large**
- Severity: **Medium**
- Impact reasoning: Every phone visitor, which is likely most visitors arriving from LinkedIn. Most sections, including Contact, couldn't be reached from the menu. Scrolling the page still reached everything, so the workaround rule caps severity at Medium.
- **Service impact: Medium** (2 points)

**Notes**
- Root cause: the phone layout set the menu to scroll sideways (`overflow-x: auto`) instead of wrapping.
- Fix applied: below 600px the menu becomes two rows of four.
- Prevention: NR-S08 and the full width check in `site-checks.js`.
- Evidence: *after screenshot withheld pending public privacy review*. Found by the owner on her own phone.

**Status:** Fixed and verified

### D02: Menu labels cut off on folding-phone cover screens

**Description**
The D01 fix worked on normal phones, but on the narrow outer screen of some folding phones, two menu labels were cut off. On unfolded screens the buttons stretched oddly wide.

**Expected behaviour**
Every label is fully readable, and buttons are a sensible size, at every screen width.

**Actual behaviour**
At 280px wide, "Experience" and "Kind words" were clipped. At 690px, the four columns stretched into very wide buttons.

**Where and how to reproduce**
- Environment: 280px (older Galaxy Fold cover screen) and 690px (unfolded Fold)
- Steps: 1. Open the site at 280px wide. 2. Read the menu labels.

**Service impact**
- Affected users: **Low**
- Severity: **Low**
- Impact reasoning: Only older folding phones' cover screens (under 1%). The links still worked; only the labels were clipped.
- **Service impact: Low** (1 point)

**Notes**
- Root cause: the D01 fix was only checked at standard phone widths, so this is a regression.
- Fix applied: three columns at 340px and below, and a natural single row between 600 and 720px.
- Prevention: folding-phone widths (280, 344 and 690px) are now part of every check.
- Evidence: *after, all widths screenshot withheld pending public privacy review*

**Status:** Fixed and verified

### D03: Downloadable CV has a half-empty second page

**Description**
The CV visitors can download looked unfinished: the first page was crammed, and the second was more than half blank.

**Expected behaviour**
A two-page CV that looks deliberately laid out, with both pages well filled and no role split awkwardly across the break.

**Actual behaviour**
Page 1 was 94% full and page 2 was 42% full.

**Where and how to reproduce**
- Environment: the PDF linked from the Contact section
- Steps: 1. Download the CV. 2. View both pages.

**Service impact**
- Affected users: **Large**
- Severity: **Low**
- Impact reasoning: People who download the CV are a small segment (Medium), raised one level because they're recruiters, a high-value group. The content was correct; only the layout suffered.
- **Service impact: Low** (1 point)

**Notes**
- Root cause: tight spacing on page 1, and no planned page break.
- Fix applied: slightly larger text and spacing, and a page break between roles. When a later content change unbalanced the pages again, they were rebalanced and a "Selected writing" section was added.
- Prevention: `cv-checks.py` fails a page with too little text or a large blank gap (NR-C07, NR-C08).
- Evidence: *after screenshot withheld pending public privacy review*

**Status:** Fixed and verified

### D04: Contact buttons look unanchored next to the text

**Description**
Once more text was added to the Contact section, the buttons sat low and on their own, not lined up with anything.

**Expected behaviour**
The text and the buttons line up and read as one section.

**Actual behaviour**
The buttons floated next to the second and third paragraphs, with empty space above them.

**Where and how to reproduce**
- Environment: desktop, 1280px wide
- Steps: 1. Scroll to the Contact section.

**Service impact**
- Affected users: **Very large**
- Severity: **Low**
- Impact reasoning: Everyone who reaches Contact. Cosmetic only; everything still worked.
- **Service impact: Medium** (2 points)

**Notes**
- Root cause: the layout aligned both columns to the bottom, which looked fine with short text but not with long text.
- Fix applied: the heading spans the full width, both columns start at the first paragraph, and the buttons sit together in a card.
- Evidence: *before screenshot withheld pending public privacy review* · *after screenshot withheld pending public privacy review*

**Status:** Fixed and verified

### D05: Review reported missing articles and CV download

**Description**
An external review said the homepage listed 12 "Coming soon" articles and had no CV download.

**Expected behaviour**
The review describes the site as it actually is.

**Actual behaviour**
The live site already had both. The reviewer's tool had read an old, cached copy from before the latest release.

**Service impact**
- Not a defect, so it isn't rated and scores no points.

**Notes**
- Lesson: before triaging a report, confirm which version and environment it came from.

**Status:** Not a defect: the report was based on a stale cached copy

### D06: Lighthouse reported slow, unused JavaScript

**Description**
A Lighthouse performance audit scored 76 and reported 722 KiB of unused JavaScript.

**Expected behaviour**
The audit measures only the site.

**Actual behaviour**
The site has no JavaScript, and its security settings block scripts. The JavaScript belonged to browser extensions in the tester's own browser.

**Service impact**
- Not a defect, so it isn't rated and scores no points.

**Notes**
- Resolution: run Lighthouse in an incognito window, where extensions are off. Earlier runs scored 99.
- Evidence: *report with extensions screenshot withheld pending public privacy review*

**Status:** Not a defect: the result was distorted by browser extensions

### D07: Homepage intro line missing its styling

**Description**
The first line of the homepage introduction was meant to be larger and bolder, but it looked like ordinary text.

**Expected behaviour**
The intro line stands out from the paragraph below it.

**Actual behaviour**
It looked the same as the rest of the text.

**Service impact**
- Affected users: **Very large**
- Severity: **Low**
- Impact reasoning: Every visitor. Cosmetic only.
- **Service impact: Medium** (2 points)

**Notes**
- Root cause: the style targeted "the first paragraph", but a small label above the intro was technically the first paragraph (`p:first-of-type`).
- Fix applied: a dedicated class on the intro line.

**Status:** Fixed and verified

### D08: Homepage headline unreadable in dark mode

**Description**
For visitors whose device uses dark mode, the highlighted part of the homepage headline was barely visible against the dark background.

**Expected behaviour**
All text meets WCAG AA contrast (at least 4.5:1) in both light and dark mode.

**Actual behaviour**
The italic emphasis in the headline had too little contrast in dark mode.

**Where and how to reproduce**
- Environment: any device set to dark mode
- Steps: 1. Turn on dark mode. 2. Open the homepage. 3. Read the headline.

**Service impact**
- Affected users: **Large**
- Severity: **High**
- Impact reasoning: Visitors in dark mode (an estimated 10–25%). It fails WCAG AA contrast, which counts as a compliance risk, so the workaround cap doesn't apply. The key message was hard to read.
- **Service impact: High** (4 points)

**Notes**
- Root cause: the dark theme reused a colour chosen for the light background.
- Fix applied: a lighter accent colour in the dark theme.
- Prevention: accessibility checks run in both modes. NR-S13 is a permanent regression test.

**Status:** Fixed and verified

### D09: Menu spills out of the header on some tablets

**Description**
Around 860px wide, for example some tablets in landscape, the menu didn't fit next to the name and pushed past the edge of the header.

**Expected behaviour**
The header fits the screen at every width.

**Actual behaviour**
The menu overflowed the header.

**Where and how to reproduce**
- Environment: about 860px wide
- Steps: 1. Open the site at 860px. 2. Look at the header.

**Service impact**
- Affected users: **Medium**
- Severity: **Low**
- Impact reasoning: Tablet and narrow-laptop visitors (1–10%). It looked broken, but every link still worked.
- **Service impact: Low** (1 point)

**Notes**
- Root cause: no layout change between phone and desktop sizes.
- Fix applied: at that width, the name now sits above the menu.
- Prevention: 860px is part of every check, and NR-S10 is a permanent regression test.

**Status:** Fixed and verified

### D10: AI summary file causes a browser warning

**Description**
The plain-text summary file for AI tools (`llms.txt`) triggered a security warning in the browser console.

**Expected behaviour**
The file is served as plain text, with no warnings.

**Actual behaviour**
The browser treated it as a web page and flagged it against the site's security policy.

**Service impact**
- Affected users: **Low**
- Severity: **Low**
- Impact reasoning: Only someone opening the file with developer tools open. No visible effect.
- **Service impact: Low** (1 point)

**Notes**
- Fix applied: the hosting settings now serve the file as `text/plain`.

**Status:** Fixed and verified

---

## Bugs in the checks

These were found by testing the quality gate itself: a clean-room install, edge cases, negative tests and positive controls. The "users" here are the people running the checks.

### T01: Checks pass when there was nothing to test

**Description**
If the folder name was mistyped, or the site had no home page, the checks reported "0/0 passed" and finished successfully. A broken site could have been published on a green result.

**Expected behaviour**
The checks fail if the folder doesn't exist, if the home page doesn't load, or if no pages were tested.

**Actual behaviour**
They reported "0/0 page checks passed" and exited with success (exit code 0).

**Where and how to reproduce**
- Steps: 1. Run `node checks/site-checks.js /no/such/folder`. 2. Check the result and the exit code.

**Service impact**
- Affected users: **Large**
- Severity: **Very high**
- Impact reasoning: Anyone whose path is mistyped, locally or in CI, which would affect every run until noticed. A false "pass" could let a broken site, or one exposing private data, be published.
- **Service impact: Very high** (8 points)

**Notes**
- Root cause: the pass rule was "no failures", and with nothing tested there were no failures.
- Fix applied: the folder must exist, the home page must load, and at least one page must be tested.
- Prevention: NR-S01 and NR-S02.

**Status:** Fixed and verified

### T02: Automated pipeline would fail on its first run

**Description**
One step in the GitHub Actions pipeline, the one that checks the Gherkin files are valid, couldn't load the tool it needed. It would have failed the first time the repo was pushed.

**Expected behaviour**
Every pipeline step works on a clean machine.

**Actual behaviour**
`Cannot find module '@cucumber/gherkin'`

**Service impact**
- Affected users: **Very large**
- Severity: **Medium**
- Impact reasoning: Every pipeline run. The pipeline would go red and block work, but it couldn't give a false pass. Running the checks locally was a safe workaround, so severity is capped at Medium.
- **Service impact: Medium** (2 points)

**Notes**
- Root cause: `npx -p` makes a package's commands available, but not the package itself for `require()`. An earlier check had only confirmed that the workflow file was well-formed, not that its steps ran.
- Fix applied: the parser is a pinned dependency, and validation is its own script, `checks/validate-specs.js`.
- Prevention: every pipeline step was run locally in order. PC-07 and NR-G01 cover the validator.

**Status:** Fixed and verified

### T03: Test server could serve files from a neighbouring folder

**Description**
The small web server the checks start on your computer was meant to serve only the site folder. A request for `../site-secret/` would have been served if a folder with a similar name sat next to it.

**Expected behaviour**
Nothing outside the site folder is ever served.

**Actual behaviour**
`site-secret/` counted as inside `site/`, because only the start of the path was compared.

**Service impact**
- Affected users: **Low**
- Severity: **Medium**
- Impact reasoning: It needs a neighbouring folder with the same name prefix and a crafted request. It's local only and never public, but files outside the site could be exposed to the test browser.
- **Service impact: Low** (1 point)

**Notes**
- Root cause: a prefix check (`startsWith(root)`) without the folder separator.
- Fix applied: the path must start with the site folder plus a separator. The logic now lives in `checks/lib/static-resolve.js` and is unit-tested.
- Prevention: NR-S19 also covers URL-encoded `..` and malformed URLs.

**Status:** Fixed and verified

### T04: Missing CV file shows a crash instead of a message

**Description**
Running the CV check on a file that doesn't exist printed a Python error trace instead of a clear message.

**Expected behaviour**
"FAIL file not found: …", with a failure exit code.

**Actual behaviour**
A `CalledProcessError` traceback. It did still exit with a failure code.

**Service impact**
- Affected users: **Medium**
- Severity: **Low**
- Impact reasoning: Anyone who mistypes a CV path. It still failed correctly, just with an unhelpful message.
- **Service impact: Low** (1 point)

**Notes**
- Fix applied: the script checks the file exists first. The same fix stopped empty pages reporting a confusing "100% blank gap".
- Prevention: NR-C01.

**Status:** Fixed and verified

### T05: Long reference numbers flagged as phone numbers

**Description**
A CV with a long reference number, such as a 13-digit ID, failed the "no phone number" check even though it contained no phone number.

**Expected behaviour**
Only things that look like phone numbers are flagged: numbers starting with `0` or `+`, or written with spaces or brackets.

**Actual behaviour**
`possible phone number found in a public CV: 1234567890123`

**Service impact**
- Affected users: **Medium**
- Severity: **Medium**
- Impact reasoning: CVs that contain long reference or ID numbers. A false alarm that blocks publishing until someone overrides it, and the override is a workaround.
- **Service impact: Low** (1 point)

**Notes**
- Root cause: the pattern accepted any run of 10–13 digits.
- Fix applied: a bare run of digits must start like a phone number. Real numbers are still caught: `07700 900123`, `07700900123`, `+447700900123`, `020 7946 0958` and `+44 (0)20 7946 0958`.
- Found by: positive control PC-05, which exists to catch false alarms like this.

**Status:** Fixed and verified

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
