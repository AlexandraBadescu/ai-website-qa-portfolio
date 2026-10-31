# I gave AI a website to build. Then I gave myself a much bigger testing problem.

I wanted a personal website, but I wasn't particularly interested in spending my evenings becoming a frontend developer. So I gave an AI assistant the building job. It wrote the code, helped shape the content and ran the checks. I supplied the facts, reviewed the drafts, challenged what didn't look right and kept the final say on what went live.

Of course, being a QA engineer, I couldn't just accept a green report and move on. I wanted to know whether the checks were any good, especially since the same assistant that helped build the site was also running them.

It turns out one of the checks could report success without testing anything at all. Not exactly the sort of reassurance I was looking for.

So I tested the checks themselves, with deliberately broken examples and positive controls that should still pass. This is the story of what I found, what I changed and how I decided what was safe enough to publish on [alexandrabadescu.com](https://alexandrabadescu.com).

## The short version

| What I looked at | Recorded result | What that does **not** mean |
|---|---|---|
| Website build | 64/64 page, viewport and colour-mode combinations passed in the **30 Oct 2026** recorded local run | It does not mean 64 independent WCAG success criteria passed or that the live URL is continuously monitored |
| Internal navigation | 49 internal links and anchors checked; none broken in that run | External destinations and unlinked pages are not covered automatically |
| The checks themselves | 38/38 requirement-based cases passed: 31 deliberately broken inputs and 7 valid controls | A green result applies to the scenarios actually represented by the fixtures |
| Bugs | 10 website reports (8 defects, 2 non-defects), plus 5 defects in the checks; **0 open in the recorded report** | The 27 retired impact points are an internal weighted estimate, **not** measured incidents or users helped |
| AI-generated claims | One fictional example reviewed against its source; owner sign-off **pending** | This is not an independent evaluation or a guarantee against hallucinations |

The report refers to a dated build and a dated test execution. It is not a claim that today's live site, all browsers or full WCAG 2.2 AA conformance have been independently verified.

## Pick your route

- **Hiring manager / product:** [the decisions](docs/decisions.md) then [the bug log](docs/defects.md) then [the report](docs/test-report.md). Five minutes, no terminal required.
- **QA:** [user stories](docs/user-stories.md) then [quality gate requirements](docs/quality-gate-requirements.md) then [traceability](docs/traceability.md) then [tests](tests/run-tests.js).
- **Engineer:** [run it](#run-it-yourself) then [checks](checks/) then [CI](.github/workflows/checks.yml) then [release artifact workflow](.github/workflows/release-artifact.yml).
- **AI quality:** [fabrication review](docs/fabrication-review.md) then [evaluation plan and cases](evals/README.md).

## My approach

1. **Start with what could go wrong.** Inaccurate claims about my work, an exposed contact detail, inaccessible navigation, a broken CV, and a green pipeline that checked the wrong thing were not acceptable outcomes.
2. **Turn the risks into something checkable.** Requirements link to tests; negative fixtures contain one known defect each; valid controls guard against false positives.
3. **Make failures explain themselves.** For negative tests, a non-zero exit code isn't enough. The check must report the right failure category, and for contextual defects the right page, viewport or colour scheme.
4. **Leave human judgement where it belongs.** A script can't decide whether a story is true, whether a sentence sounds like me, or whether a screen reader experience is actually usable.
5. **Make an explicit release call.** The assistant can recommend; I say go or no-go. If evidence is missing, I want it recorded rather than polished away.

## Three defects that changed how I worked

**T01: Everything passed. Nothing ran.** A mistyped site path could give the quality gate nothing to inspect while still yielding a green result. I changed the gate to fail when no pages are found, and added negative cases for invalid or empty inputs. Lesson: a pipeline can be beautifully green and completely useless.

**D08: Dark mode made the headline unreadable.** A colour chosen for light mode did not have enough contrast on a dark background. The fix was a dark-theme-specific accent, followed by a regression fixture that fails **only** in dark mode. Lesson: one happy path is a wonderfully efficient way to miss the other paths.

**T05: A reference number became a phone number.** My public-CV privacy check flagged legitimate long reference numbers. Adding the positive control stopped an overzealous rule from becoming a release blocker. Lesson: tests that only catch defects are half the job; they also need to leave correct things alone.

Full evidence, fixes and impact rationale: [defects](docs/defects.md). How I prioritised them: [impact model](docs/bug-template.md).

## What's actually automated

- `checks/site-checks.js`: crawls linked internal HTML pages; verifies links and anchors; checks horizontal overflow before/after expanding `<details>`; runs selected axe-core WCAG-tagged rules; collects console and page errors across **8 widths × 2 colour schemes**.
- `checks/cv-checks.py`: checks PDF page count, extractable text, page-fill/gap heuristics, and patterns for contact details in the public CV.
- `checks/validate-specs.js`: validates the Gherkin syntax. **The 59 Gherkin scenarios are specifications, not 59 executed BDD tests.**
- `tests/run-tests.js`: exercises 31 known-defect fixtures and 7 positive controls; demands the exact expected failure types; checks that every requirement and test has a counterpart.
- `.github/workflows/checks.yml`: runs requirement-based tests and the fictional sample/broken-site integration example on pushes and pull requests. **It does not currently validate the actual published site's release build.**
- `.github/workflows/release-artifact.yml` (proposed): manually checks a locally available release build after its provenance is recorded. It is **not** connected to the website's build or deployment pipeline until the artifact handoff is configured.

## Run it yourself

```bash
npm ci
npx playwright install chromium
npm run build:fixtures            # regenerate synthetic PDF test cases
node examples/src/make-cvs.js      # regenerate synthetic sample PDFs
pip install -r requirements.txt   # also install poppler-utils (apt or brew)
npm test                         # 38 requirement-based cases
npm run test:report              # results + generated traceability
node checks/site-checks.js examples/sample-site --report site-report.json
python3 -B checks/cv-checks.py examples/sample-site/cv/sample-cv.pdf
```

Node 18+ is declared in `package.json`; **CI currently exercises Node 24**, not every declared version. Python 3.10+ is documented; **CI currently exercises Python 3.12**. Treat wider compatibility as intended support until a matrix verifies it.

To run against your own static site:

```bash
node checks/site-checks.js path/to/site --report report.json
python3 -B checks/cv-checks.py path/to/public-CV.pdf
python3 -B checks/cv-checks.py path/to/application-CV.pdf --allow-contact
```

A negative test counts as passing only when the check detects exactly the deliberately introduced issue. A positive control must pass without reporting any failure. The [traceability matrix](docs/traceability.md) records the last reported results.

**Public-copy safeguard:** the clean repository checks every Git author and committer email against GitHub `noreply` patterns in CI. If it detects a direct email, the job fails without printing the address. This is an additional alarm, not a substitute for checking the first commit **before pushing it**.

## What the evidence cannot prove

- **Accessibility:** a clean axe scan is not a WCAG 2.2 AA conformance certification. Keyboard navigation, focus, zoom/reflow, screen-reader semantics, meaningful alternatives and text spacing need manual testing. These manual checks **were not repeated for the 30 October report**.
- **Release provenance:** the recorded real-site test ran on deployment files, not a crawl of the public URL. There is no automated verified link from the current CI run to the published Netlify artifact yet. See [release evidence](docs/release-evidence.md).
- **AI claims:** a prompt saying “never invent facts” is an instruction, not proof. The [fabrication review](docs/fabrication-review.md) uses one fictional input and still needs owner sign-off. More demanding evaluation cases are [prepared, not executed](evals/README.md).
- **Browser coverage:** Chromium is the automated browser. The report describes manual Safari and Firefox checks, but no automated cross-browser results.
- **CV compatibility:** extractable text is necessary for many ATS tools, not proof that an employer's ATS will parse the CV correctly. Contact detection and page-fill measures are heuristics.
- **Exposure estimates:** dark-mode shares and affected-user bands are assumptions for prioritisation, not analytics measurements.

## What I'd improve next

The current project tells me how the checks behave against known defects. The next step is proving that the **exact build heading to production** was the one tested, with a traceable SHA and a recorded release decision. Until that connection exists, the evidence is useful, but incomplete. And I'd rather say that plainly than dress it up as a bigger achievement.

See the [release-evidence checklist](docs/release-evidence.md), [evaluation plan](evals/README.md) and [technical follow-ups](docs/technical-follow-ups.md).

## Licence

© 2026 Alexandra Badescu. See [LICENSE](LICENSE). The existing CC BY-NC-ND 4.0 terms are retained **pending a separate licence decision**; this proposal does not silently relicense the code or grant broader rights.

[Website](https://alexandrabadescu.com) · [LinkedIn](https://www.linkedin.com/in/alexandra-maria-badescu/)