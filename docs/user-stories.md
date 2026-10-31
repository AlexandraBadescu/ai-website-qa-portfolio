# User story: AI-assisted personal website

**In plain words:** what the website had to do, why it mattered, and how we'd know it was done. The acceptance criteria are the checklist the finished site was tested against.

**As a** job-seeking professional
**I want** an AI assistant to build and publish a personal website from my real CV and experience
**So that** recruiters and hiring managers can see how I work, beyond a list of job titles, without me having to write code.

### What

A reusable prompt ([personal-website-prompt.md](../prompts/personal-website-prompt.md)) that guides an AI assistant through these steps:
1. Gather information.
2. Draft content.
3. Design.
4. Build a static site.
5. Run quality checks.
6. Publish behind an explicit approval gate.
7. Harden the account and domain afterwards.

### Why

- AI can produce a polished site quickly, but polished isn't the same as correct. Without guardrails it invents facts, overstates experience, leaks private contact details and skips testing.
- A personal site is public and permanent. One wrong claim or one exposed phone number costs more than the time saved.
- The prompt applies the same quality gates as a software release: entry criteria, constraints that can be tested, traceability, a definition of done and go/no-go.

### Acceptance criteria

1. **Entry criteria:** the assistant doesn't draft anything until it has the user's CV.
2. **Information gathering:**
   - it extracts answers from the CV, LinkedIn, GitHub and any pasted notes before asking questions
   - it asks only for what's missing
   - it shows the user what it extracted so they can correct it
3. **Privacy:**
   - no email address or phone number appears on any published page or in the downloadable CV
   - employers, clients and projects the user marks as private are described generically
4. **No fabrication:**
   - every fact on the site comes from the user
   - any illustrative example the assistant suggests is flagged for the user to confirm or reword
5. **Responsive layout:** no page scrolls sideways at 280, 344, 390, 690, 768, 860, 1024 or 1280px, before or after collapsible sections are expanded, and every menu item is visible without swiping.
6. **Accessibility:** the site meets **WCAG 2.2 Level AA**.
   - automated checks for WCAG 2.0, 2.1 and 2.2 A and AA rules report zero violations in light and dark mode at every width, with collapsible sections opened
   - the manual checks for keyboard, focus, zoom and reflow, text spacing, screen reader and target size pass
7. **Links:** every internal link and anchor resolves.
8. **Downloadable CV:**
   - exactly 2 pages, with text covering at least 65% of each page's height (a visual heuristic that a lone footer can't satisfy) and no blank gap over 30% of a page
   - text can be extracted, which is a prerequisite for ATS parsing, not proof of it
   - no email address or phone number
9. **Approval gate:**
   - nothing is published until the user explicitly says "go"
   - after publishing, the assistant checks the live site
   - a backup of the previous version is kept
10. **Security:**
   - security headers are set
   - no JavaScript, trackers or cookies
   - the assistant never enters the user's passwords

### Related

- The checks used to prove these criteria have their own requirements and negative tests: see [quality-gate-requirements.md](quality-gate-requirements.md) and the [traceability matrix](traceability.md).
- Bugs found against these criteria are logged in [defects.md](defects.md), using the [bug template](bug-template.md).

### Acceptance specification (BDD)

See [features/personal-website.feature](../features/personal-website.feature). The Gherkin scenarios are written as an acceptance specification, not as an executable suite. The automated checks cover the layout, accessibility, link and CV scenarios. The scenarios about the assistant's behaviour are verified by review, as in [fabrication-review.md](fabrication-review.md).

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
