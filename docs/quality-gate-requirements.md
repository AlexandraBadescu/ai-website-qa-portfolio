# User story: a quality gate you can trust

**In plain words:** automated checks are only useful if they actually catch problems. This page lists every problem the checks must catch, and every valid input they must let through. Each item has its own test. See the [traceability matrix](traceability.md) for the results.

**As the** site owner
**I want** the pre-publish checks to fail on every kind of defect they claim to catch, and to fail for the right reason
**So that** a green result actually means the site and CV are fit to publish, rather than just meaning nothing was checked.

### What

Negative requirements for the checks in `checks/`. Each one names a defect the gate must catch. Each is proven by a test against a fixture that contains **exactly that one defect**, so a test can't pass because of some other failure. Positive controls prove the gate doesn't fail on valid input, so it isn't simply failing everything.

### Why

- A check that has never been seen to fail proves nothing. Testing the checks found a gate that reported "0/0 passed" on a mistyped folder (defect T01 in the [test report](test-report.md)).
- If a test only asserts "the command failed", it passes for the wrong reason whenever something else breaks. Each test here asserts the **exact set** of failure types, and where it matters, the exact widths, colour schemes and pages.
- Defects already found on the real site (D08 dark-mode contrast, D09 tablet overflow) are pinned as regression tests, so they can't come back unnoticed.

### Acceptance criteria

1. Every negative requirement below has at least one automated test, listed in the [traceability matrix](traceability.md).
2. Each negative test passes only if:
   - the check exits with a failure code
   - the failure types reported **exactly match** the expected set: nothing missing and nothing extra
   - any expected context (width, colour scheme, page) matches exactly
3. Every negative fixture is built from the same valid base page as positive control PC-01, so any extra failure shows up as a mismatch.
4. Positive controls pass with exit code 0 and no failures reported.
5. The whole suite runs with one command (`npm test`) and in CI on every push, and fails if any test doesn't behave as expected.

---

## Negative requirements

### Site checks (`site-checks.js`)

| ID | The gate must fail when… | Expected failure type |
|---|---|---|
| NR-S01 | the site folder doesn't exist | `no-site` |
| NR-S02 | the site has no start page (`index.html`) | `no-pages` |
| NR-S03 | a link points to an anchor that doesn't exist on the same page | `broken-link` |
| NR-S04 | a link points to an anchor that doesn't exist on **another** page | `broken-link` |
| NR-S05 | an extensionless link (`/notes/x`) points to a page that doesn't exist | `broken-link` |
| NR-S06 | a relative link (`../x.html`) points to a page that doesn't exist | `broken-link` |
| NR-S07 | a link points to a file (e.g. a CV PDF) that doesn't exist | `broken-link` |
| NR-S08 | a page scrolls sideways on narrow screens as soon as it loads | `overflow` at 280, 344 and 390px only |
| NR-S09 | a page scrolls sideways only once a collapsible section is expanded | `overflow-expanded` |
| NR-S10 | a page scrolls sideways only around 860px (regression for D09) | `overflow` at 860px only |
| NR-S11 | an image has no text alternative (WCAG 1.1.1) | `wcag:image-alt` |
| NR-S12 | text contrast is below WCAG AA in both colour schemes (1.4.3) | `wcag:color-contrast` |
| NR-S13 | text contrast fails **only in dark mode** (regression for D08) | `wcag:color-contrast` in dark only |
| NR-S14 | the page language isn't declared (3.1.1) | `wcag:html-has-lang` |
| NR-S15 | a link has no accessible name (2.4.4, 4.1.2) | `wcag:link-name` |
| NR-S16 | a WCAG failure is hidden inside a collapsed section | `wcag:image-alt` |
| NR-S17 | touch targets are smaller than 24 × 24px with no spacing (WCAG 2.2, 2.5.8) | `wcag:target-size` |
| NR-S18 | the page throws a JavaScript error | `console-error` |
| NR-S19 | the test server is asked for a file outside the site folder, including a sibling folder with the same name prefix | request refused (unit test) |
| NR-S20 | a defect is on a page reached only by following a link | `wcag:image-alt` on that page only |

### CV checks (`cv-checks.py`)

| ID | The gate must fail when… | Expected failure type |
|---|---|---|
| NR-C01 | the PDF file doesn't exist | `not-found` |
| NR-C02 | a public CV contains an email address | `email` |
| NR-C03 | a public CV contains a UK mobile number | `phone` |
| NR-C04 | a public CV contains an international landline number, e.g. `+44 (0)20 …` | `phone` |
| NR-C05 | the CV has more pages than expected | `page-count` |
| NR-C06 | the CV has fewer pages than expected | `page-count` |
| NR-C07 | a page is empty except for a footer | `coverage` |
| NR-C08 | a page has a large blank gap in the middle | `gap` |
| NR-C09 | the text is an image, with nothing extractable | `no-text` |
| NR-C10 | `--allow-contact` is used: it must still report the other failures | `coverage` (and not `email` or `phone`) |

### Acceptance specifications (`validate-specs.js`)

| ID | The gate must fail when… | Expected failure type |
|---|---|---|
| NR-G01 | a feature file isn't valid Gherkin | `invalid-spec` |

## Positive controls (guards against false failures)

| ID | The gate must pass when… |
|---|---|
| PC-01 | a minimal valid site is checked (the base every negative site fixture is built from) |
| PC-02 | the fictional sample site is checked |
| PC-03 | a page has external, `mailto:` and `tel:` links (these aren't checked) |
| PC-04 | a 2-page public CV with no contact details is checked |
| PC-05 | a CV contains years, date ranges, metrics and long reference numbers that aren't phone numbers |
| PC-06 | an application CV with contact details is checked with `--allow-contact` |
| PC-07 | the project's own feature files are validated |

## Out of scope

These can't be proven by an automated negative test. They're covered by review: see [fabrication-review.md](fabrication-review.md) and the manual checklist in the README.
- Whether the assistant invented or upgraded a fact.
- Whether a page contains confidential information.
- WCAG criteria that tools can't judge, such as a logical focus order or meaningful alt text.

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
