# Glossary

Plain explanations of the terms used in this project.

| Term | What it means here |
|---|---|
| **Acceptance criteria** | The conditions a piece of work must meet to count as done, written so they can be checked. |
| **Acceptance specification** | Acceptance criteria written as example scenarios (Given / When / Then). Here they describe required behaviour; they aren't run as code. |
| **ATS** | Applicant Tracking System: the software employers use to read and filter CVs. |
| **axe (axe-core)** | A widely used open-source tool that checks web pages against accessibility rules. |
| **BDD / Gherkin** | Behaviour-Driven Development, a way of describing behaviour as scenarios. Gherkin is the plain-text format those scenarios are written in (`.feature` files). |
| **CI (continuous integration)** | An automated pipeline (here, GitHub Actions) that runs the tests every time the code changes. |
| **Clean-room test** | Installing and running the project in an empty folder, exactly as a newcomer would, to prove nothing depends on the author's own machine. |
| **Exit code** | The number a command returns when it finishes: 0 means success and anything else means failure. Pipelines rely on it. |
| **False positive / false negative** | A check that fails when nothing is wrong (false positive), or passes when something is wrong (false negative). The second is more dangerous. |
| **Fixture** | A small, made-up input built to test one specific thing, such as a web page with exactly one broken link. |
| **Heuristic** | A rule of thumb that is usually right but not guaranteed, such as estimating whether a CV page is "full enough". |
| **Horizontal overflow** | When a page is wider than the screen, so you have to scroll sideways. |
| **Negative test** | A test that proves a check **fails** when it should: you give it a known defect and confirm it's caught, for the right reason. |
| **Positive control** | A test that proves a check **passes** on valid input, so it isn't just failing everything. |
| **Quality gate** | A set of checks that must pass before something is released. |
| **Regression** | Something that used to work and broke again, often because of an unrelated change. A regression test makes sure it stays fixed. |
| **Service impact** | How much a bug harms users: severity × affected users, read from a table. See [bug-template.md](bug-template.md). |
| **Severity** | How bad a bug is for the people it affects, from cosmetic to a core journey being impossible. |
| **Traceability** | Being able to follow each requirement to the test that proves it, and back. See [traceability.md](traceability.md). |
| **WCAG 2.2 AA** | Web Content Accessibility Guidelines version 2.2, level AA: the accessibility standard most organisations are asked to meet. |
| **Workaround** | Another way for users to get what they need while a bug is still open. A safe workaround caps severity at Medium in the impact model. |

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
