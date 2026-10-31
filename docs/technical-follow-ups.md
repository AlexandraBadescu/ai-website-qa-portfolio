# Technical follow-ups

**In plain words:** what I'd build next, in priority order. Items already done are listed at the end, so the history stays visible.

## Next

1. **Connect the website's build to the release check.** The release workflow already verifies a ZIP's hash, unpacks it safely and checks the exact files, and its dry run proves that path works. The missing link is the website's own build uploading its ZIP, so every deploy is checked before I approve it.
2. **Screenshots of failures.** Save a screenshot only when a check fails, named by page, width and colour mode, from the local test site so a screenshot can never include a private CV.
3. **More browsers.** Add WebKit (Safari's engine) and Firefox to CI. WebKit in Playwright is close to Safari, not identical, so a real-device check stays in the release checklist.
4. **Check the live site after deploy.** Crawl the public URL and compare it with the files that were checked, so any difference shows up straight away.
5. **Release badges, once there's evidence behind them.** A badge should only reflect a current run on the actual release, never a stale or different one.

## Done

- **Fuller accessibility evidence:** the JSON report now keeps each failure's axe rule, impact, help link and up to 5 affected elements, not just the rule name and a count.
- **Faster site checks:** width and colour-mode combinations run four at a time, with the output kept in a fixed order. The full test suite went from about 2 minutes to under 1.5 minutes locally.
- **Supported runtimes tested:** Node 18 and 20 are past end of life, so the project now requires Node 22 or later, and CI runs on both Node 22 and 24.
- **Release workflow tested:** a dry run on the fictional sample site runs whenever the workflow or the checks change, including a negative test that a wrong hash is rejected.
- **Local test server bound to this computer only:** it listens on 127.0.0.1, not every network interface.

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
