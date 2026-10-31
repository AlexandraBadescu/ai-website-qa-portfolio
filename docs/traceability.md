# Traceability matrix

**In plain words:** every requirement for the quality gate, the test that proves it, and whether that test passed on the last run. If a requirement had no test, or a test had no requirement, `npm test` would fail.

- **Generated:** 2026-10-30 by `tests/build-traceability.js`. Don't edit by hand.
- **Requirements:** [quality-gate-requirements.md](quality-gate-requirements.md) · **Test cases:** [tests/cases.json](../tests/cases.json) · **Acceptance specification:** [features/quality-gate.feature](../features/quality-gate.feature)
- **Last run:** 38/38 tests behaved as required

A negative test (NR) passes when the check **fails with exactly the expected failure type, and nothing else**. A positive control (PC) passes when the check **passes with no failures**.

## Site checks

| Requirement | Must fail when | Test fixture | Expected | Last result |
|---|---|---|---|---|
| NR-S01 | the site folder doesn't exist | `tests/fixtures/site/does-not-exist` | exit 1, `no-site` | ✅ pass |
| NR-S02 | the site has no start page (`index.html`) | `tests/fixtures/site/NR-S02-no-start-page` | exit 1, `no-pages` | ✅ pass |
| NR-S03 | a link points to an anchor that doesn't exist on the same page | `tests/fixtures/site/NR-S03-anchor-same-page` | exit 1, `broken-link` | ✅ pass |
| NR-S04 | a link points to an anchor that doesn't exist on **another** page | `tests/fixtures/site/NR-S04-anchor-other-page` | exit 1, `broken-link` | ✅ pass |
| NR-S05 | an extensionless link (`/notes/x`) points to a page that doesn't exist | `tests/fixtures/site/NR-S05-extensionless-missing` | exit 1, `broken-link` | ✅ pass |
| NR-S06 | a relative link (`../x.html`) points to a page that doesn't exist | `tests/fixtures/site/NR-S06-relative-missing` | exit 1, `broken-link` | ✅ pass |
| NR-S07 | a link points to a file (e.g. a CV PDF) that doesn't exist | `tests/fixtures/site/NR-S07-missing-file` | exit 1, `broken-link` | ✅ pass |
| NR-S08 | a page scrolls sideways on narrow screens as soon as it loads | `tests/fixtures/site/NR-S08-overflow-on-load` | exit 1, `overflow` | ✅ pass |
| NR-S09 | a page scrolls sideways only once a collapsible section is expanded | `tests/fixtures/site/NR-S09-overflow-when-expanded` | exit 1, `overflow-expanded` | ✅ pass |
| NR-S10 | a page scrolls sideways only around 860px (regression for D09) | `tests/fixtures/site/NR-S10-overflow-at-860` | exit 1, `overflow` | ✅ pass |
| NR-S11 | an image has no text alternative (WCAG 1.1.1) | `tests/fixtures/site/NR-S11-image-alt` | exit 1, `wcag:image-alt` | ✅ pass |
| NR-S12 | text contrast is below WCAG AA in both colour schemes (1.4.3) | `tests/fixtures/site/NR-S12-contrast` | exit 1, `wcag:color-contrast` | ✅ pass |
| NR-S13 | text contrast fails **only in dark mode** (regression for D08) | `tests/fixtures/site/NR-S13-contrast-dark-only` | exit 1, `wcag:color-contrast` | ✅ pass |
| NR-S14 | the page language isn't declared (3.1.1) | `tests/fixtures/site/NR-S14-no-lang` | exit 1, `wcag:html-has-lang` | ✅ pass |
| NR-S15 | a link has no accessible name (2.4.4, 4.1.2) | `tests/fixtures/site/NR-S15-link-name` | exit 1, `wcag:link-name` | ✅ pass |
| NR-S16 | a WCAG failure is hidden inside a collapsed section | `tests/fixtures/site/NR-S16-hidden-in-details` | exit 1, `wcag:image-alt` | ✅ pass |
| NR-S17 | touch targets are smaller than 24 × 24px with no spacing (WCAG 2.2, 2.5.8) | `tests/fixtures/site/NR-S17-target-size` | exit 1, `wcag:target-size` | ✅ pass |
| NR-S18 | the page throws a JavaScript error | `tests/fixtures/site/NR-S18-js-error` | exit 1, `console-error` | ✅ pass |
| NR-S19 | the test server is asked for a file outside the site folder, including a sibling folder with the same name prefix | `tests/unit/static-resolve.test.js` | pass | ✅ pass |
| NR-S20 | a defect is on a page reached only by following a link | `tests/fixtures/site/NR-S20-defect-on-linked-page` | exit 1, `wcag:image-alt` | ✅ pass |

## CV checks

| Requirement | Must fail when | Test fixture | Expected | Last result |
|---|---|---|---|---|
| NR-C01 | the PDF file doesn't exist | `tests/fixtures/cv/does-not-exist.pdf` | exit 1, `not-found` | ✅ pass |
| NR-C02 | a public CV contains an email address | `tests/fixtures/cv/NR-C02-email.pdf` | exit 1, `email` | ✅ pass |
| NR-C03 | a public CV contains a UK mobile number | `tests/fixtures/cv/NR-C03-uk-mobile.pdf` | exit 1, `phone` | ✅ pass |
| NR-C04 | a public CV contains an international landline number, e.g. `+44 (0)20 ` | `tests/fixtures/cv/NR-C04-intl-landline.pdf` | exit 1, `phone` | ✅ pass |
| NR-C05 | the CV has more pages than expected | `tests/fixtures/cv/NR-C05-three-pages.pdf` | exit 1, `page-count` | ✅ pass |
| NR-C06 | the CV has fewer pages than expected | `tests/fixtures/cv/NR-C06-one-page.pdf` | exit 1, `page-count` | ✅ pass |
| NR-C07 | a page is empty except for a footer | `tests/fixtures/cv/NR-C07-footer-only-page.pdf` | exit 1, `coverage` | ✅ pass |
| NR-C08 | a page has a large blank gap in the middle | `tests/fixtures/cv/NR-C08-blank-gap.pdf` `--min-fill 0` | exit 1, `gap` | ✅ pass |
| NR-C09 | the text is an image, with nothing extractable | `tests/fixtures/cv/NR-C09-image-only.pdf` `--min-fill 0` | exit 1, `no-text` | ✅ pass |
| NR-C10 | `--allow-contact` is used: it must still report the other failures | `tests/fixtures/cv/NR-C10-allow-contact-still-fails.pdf` `--allow-contact` | exit 1, `coverage` | ✅ pass |

## Acceptance specifications

| Requirement | Must fail when | Test fixture | Expected | Last result |
|---|---|---|---|---|
| NR-G01 | a feature file isn't valid Gherkin | `tests/fixtures/specs/NR-G01-invalid` | exit 1, `invalid-spec` | ✅ pass |

## Positive controls

| Requirement | Must pass when | Test fixture | Expected | Last result |
|---|---|---|---|---|
| PC-01 | a minimal valid site is checked (the base every negative site fixture is built from) | `tests/fixtures/site/PC-01-valid-base` | pass | ✅ pass |
| PC-02 | the fictional sample site is checked | `examples/sample-site` | pass | ✅ pass |
| PC-03 | a page has external, `mailto:` and `tel:` links (these aren't checked) | `tests/fixtures/site/PC-03-external-links` | pass | ✅ pass |
| PC-04 | a 2-page public CV with no contact details is checked | `tests/fixtures/cv/PC-04-valid.pdf` | pass | ✅ pass |
| PC-05 | a CV contains years, date ranges, metrics and long reference numbers that aren't phone numbers | `tests/fixtures/cv/PC-05-numbers-not-phones.pdf` | pass | ✅ pass |
| PC-06 | an application CV with contact details is checked with `--allow-contact` | `tests/fixtures/cv/PC-06-application.pdf` `--allow-contact` | pass | ✅ pass |
| PC-07 | the project's own feature files are validated | `features` | pass | ✅ pass |

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
