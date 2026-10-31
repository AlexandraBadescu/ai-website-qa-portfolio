# Release evidence: what is connected and what isn't

A green test run for a fixture doesn't prove the thing we shipped is good. It proves the fixture behaved as expected. Useful, yes. A release approval, no.

## Evidence on record

- **30 October 2026:** the test report records a local check of deployed website files and downloadable CV, with 64/64 page–width–scheme combinations passing.
- The report references a SHA-256 **prefix** (`3f08d68bbc16`), not a full hash suitable for independent artifact verification.
- GitHub Actions checks the requirement-based fixtures and integration examples, **not the production site build**.

## Proposed release flow (not yet wired up)

1. The website build process produces a ZIP containing the exact static files for deployment. Upload the ZIP as a GitHub Actions artifact, or supply the files to the verification job through a trusted workflow.
2. Record the full SHA-256 of that ZIP, the website source commit, build timestamp and the deployment identifier.
3. Unzip into a clean directory, run `checks/site-checks.js` against it, and run `checks/cv-checks.py` against the included public CV.
4. Keep the JSON report, logs, hashes and manual-test evidence together as a named release bundle.
5. A human reviews the results and limitations and explicitly approves or rejects the deploy. The automated job **does not grant approval**.
6. After deployment, verify the live URL and identify any difference between published files and the verified artifact.

## Manual approval record (fill this in for each real release)

| Field | Value |
|---|---|
| Website source commit | **Pending** |
| Full artifact SHA-256 | **Pending** |
| Deployed artifact / Netlify deploy ID | **Pending** |
| Automated release report | **Pending** |
| Keyboard / screen-reader / zoom checks and tester | **Pending** |
| Fabrication review signed by | **Pending** |
| Residual risks and decision | **Pending** |
| Approver and date | **Pending** |

Do not turn `Pending` into `Passed` because the documentation looks tidy.
