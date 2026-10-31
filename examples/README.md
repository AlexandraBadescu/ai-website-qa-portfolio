# Fictional examples

**In plain words:** made-up files you can run the checks on straight away. Some are meant to pass and some are deliberately broken, so you can see the checks catch real problems.

Everything here is made up, so anyone can run the checks without their own files.

| Example | Expected result | Why |
|---|---|---|
| `sample-site/` | **Pass** | Two pages, with relative, absolute and extensionless links, an anchor on another page, a collapsible section and a CV download |
| `broken-site/` | **Fail** | Six injected defects, listed in [broken-site/README.md](broken-site/README.md) |
| `sample-cv.pdf` | **Pass** | Two balanced pages, no contact details |
| `bad-cv.pdf` | **Fail** | Email and phone included, and page 2 holds only a footer |

These are a quick demo with several defects at once. The rigorous tests live in [`tests/`](../tests): one defect per fixture, each traced to a requirement. A check that can't catch a known defect isn't a check.

To rebuild the sample CVs: `node examples/src/make-cvs.js`

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
