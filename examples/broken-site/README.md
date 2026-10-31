# Deliberately broken sample site

Used as a negative test: the site checks must FAIL on this folder. Known injected defects:

1. A menu link to an anchor that doesn't exist on the page (`#missing-section`).
2. A link to an anchor that doesn't exist on another page (`/notes/release-checklist#no-such-heading`).
3. A link to a page that doesn't exist (`notes/no-such-note`).
4. A link to a missing file (`cv/missing.pdf`).
5. An image with no alt text inside a collapsed section (WCAG 1.1.1), visible only once it's expanded.
6. A long unbroken line inside a collapsed section that causes horizontal scrolling only once it's expanded.
