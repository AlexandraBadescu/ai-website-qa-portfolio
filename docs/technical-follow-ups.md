# Technical follow-ups (proposed, not all implemented)

1. **Wire the real website artifact into CI.** The release workflow provided here checks a local artifact only. The website's build/deployment pipeline still needs to supply it and retain provenance. No cross-repository access tokens are assumed.
2. **Save detailed axe evidence.** Keep rule ID, impact, help URL, affected elements and failure summary rather than only `rule-id (node count)`. Add a scrubber for accidental personal data before uploading diagnostics.
3. **Capture screenshots for failed contexts.** Save only failures, with deterministic page/width/scheme file names, and use an isolated local test site so screenshots cannot leak private CVs.
4. **Exercise a browser matrix.** Add Chromium plus WebKit and Firefox on CI if the environment and runtime budget allow it; don't claim Safari is identical to Playwright WebKit.
5. **Test declared runtime support.** Current CI has Node 24 / Python 3.12. Add matrix runs for Node 18 and 20 (and supported Python versions) before advertising full compatibility. Check security support lifecycle before keeping older versions.
6. **Make the defect model's estimates explicit.** Dark-mode percentages and recruitment audience exposure are hypotheses, not observed visitor data. Accessibility, confidentiality or safety can override the frequency score and block release.
7. **Separate licences if desired.** Current CC BY-NC-ND 4.0 restricts derivative distribution and is not a conventional open-source software licence. Keep it unless the author explicitly approves a change; if adoption is a goal, consider MIT or Apache-2.0 for code and separate content terms after reviewing the implications.
8. **Add trustworthy release badges only after evidence exists.** No badges based on a stale run or a different artifact.
