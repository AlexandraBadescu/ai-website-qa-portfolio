# Release evidence: what is connected and what isn't

**In plain words:** a green run on test fixtures proves the checks work. It doesn't prove the release is good. This page shows what connects the tested files to the deployed ones, and what doesn't yet.

## Evidence on record

- **30 October 2026:** the test report records a local check of deployed website files and downloadable CV, with 64/64 page–width–scheme combinations passing.
- The report references a SHA-256 **prefix** (`3f08d68bbc16`), not a full hash suitable for independent artifact verification.
- GitHub Actions runs the requirement-based tests and integration examples on every push. It doesn't yet receive the production site build.
- The [release workflow](../.github/workflows/release-artifact.yml) is built and tested with a dry run on the fictional sample site: it verifies the ZIP's full SHA-256, rejects a wrong hash, unpacks the files safely and runs both checks on them.

## Release flow (steps 2 to 5 are built; 1 and 6 are next)

1. The website build produces a ZIP of the exact files to deploy and uploads it as a GitHub Actions artifact. *(Next: the website's build doesn't do this yet.)*
2. Record the full SHA-256 of that ZIP, the website source commit, build timestamp and the deployment identifier.
3. Unzip into a clean directory, run `checks/site-checks.js` against it, and run `checks/cv-checks.py` against the included public CV.
4. Keep the JSON report, logs, hashes and manual-test evidence together as a named release bundle.
5. A human reviews the results and limitations and explicitly approves or rejects the deploy. The automated job **does not grant approval**.
6. After deployment, check the live URL and flag any difference between the published files and the verified ZIP. *(Next.)*

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

**Rule:** a field stays `Pending` until there's evidence for it. Tidy documentation isn't evidence.

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
