# Prompt: build my personal professional website with me

Copy everything below the line into an AI assistant that can write files and use a browser. Have your CV, LinkedIn link and GitHub link (if you have one) ready. The assistant pulls what it can from them and only asks for what's missing.

---

You're going to help me build, publish and maintain a personal professional website on my own domain. Work with me step by step. Show me a preview of every change and **never publish anything until I say "go"**.

## Before you write anything, ask me for this

Start by asking for my CV, LinkedIn and GitHub. **Don't start drafting until you have my CV.**

Then read everything I've given you, including the CV, LinkedIn, GitHub, any email or notes I've pasted, and attachments. Extract every answer to the list below that they already contain, and show me what you found so I can correct it. Only then ask for what's still missing, a few questions at a time. Don't ask me for anything my documents already answer. If something is missing later, stop and ask rather than guessing.

**Documents**
- My CV, ideally the most recent Word or PDF version, plus any role-specific versions I have.
- My LinkedIn profile URL. If you can't read it, ask me to paste my About, Experience and Recommendations sections.
- My GitHub profile URL, if I have one. Review my public repositories and pinned projects, and suggest which are worth featuring, with a one-line description of each. Check them first for anything that shouldn't be public, such as an employer's code, keys, or personal data in commits, and tell me before linking them.
- Recommendations or testimonials I'd like to show, with the person's role and whether I have their permission.
- 2–3 samples of my own writing (posts, emails, notes) so you can match my voice.
- Certificates, courses or awards worth mentioning.

**About me and my goals**
- Name as I want it shown, and my city.
- Current role, level and employer, and whether I'm happy to name the employer.
- Whether I'm employed, leaving or available now, and my notice period or availability date.
- The exact roles I'm looking for: titles, permanent, fixed-term or contract, remote, hybrid or on-site.
- Years of experience and the sectors I've worked in.
- The 3–5 achievements I'm proudest of, with numbers where they're real, and what it was like before and after.
- At least one story with friction: a disagreement, a mistake, or a time I changed approach.
- Anything I don't want claimed or overstated.

**Privacy and contracts**
- Which employers, clients, projects, vendors and figures I can name publicly, and which must stay generic.
- Whether any current work must stay off the site for contract reasons.
- Confirm that email and phone stay off the site.

**Look and feel**
- Colours, fonts or styles I like, and 1–2 websites I admire.
- My LinkedIn profile photo and current banner, so the site matches them.
- Light mode, dark mode or both.

**Accounts and domain**
- Whether I already own a domain, and where it's registered.
- Whether I have a hosting account. If not, suggest a free static host and let me create the account myself.

## Privacy rules (ask me about each before you start)

- Don't publish my email or phone. Say they're available on LinkedIn and use LinkedIn as the contact route.
- Ask which employers or clients I'm happy to name, and which details (projects, vendors, figures) must stay private. Describe anything private generically, e.g. "a regulated healthcare platform".
- Ask whether any current engagement must stay off the site for contract reasons.
- Show testimonials only with permission, and ask whether to use full names or initials.
- Never invent facts, numbers or stories. If something is missing, ask me. If you suggest an illustrative example, flag it so I can confirm it or reword it.

## Content and structure

One main page plus an articles section:

1. **Hero:** one memorable line that captures how I work, a short intro, and buttons for LinkedIn and Contact. Give it something visual that shows my field rather than describing it.
2. **Key figures:** 4–6 numbers with short labels. Include at least one people-impact metric, not only technical ones.
3. **About:** short, warm and in my voice. Make my strongest quality stand out as a highlighted line. Optionally add a playful "Also answers to" list of informal titles.
4. **Experience:** a timeline. Weight leadership roles properly by showing what it was like before I joined and after. Show the top 3 bullets per role and put the rest in "more" sections.
5. **Work I'm proud of:** 4–5 story cards. Each shows "What changed" up front, with "The problem" and "What I did" in a "How it happened" section.
6. **Approach:** how I think about my work, in a few principles.
7. **Kind words:** 3 testimonials that each show a different quality, with the rest in a "more" section.
8. **Notes:** 2–3 real articles. Never use "coming soon" placeholders.
9. **Skills:** 4 capability groups up front, with the full tool inventory in a "more" section.
10. **Projects (if I have GitHub):** 2–4 featured repositories, each with what it does, the tech used and a link. Skip this section if there's nothing worth showing.
11. **Contact:** the exact roles I'm open to, a line with some personality, a LinkedIn button, a GitHub link if I have one, and a CV download.

**Downloadable CV:** a 2-page, ATS-friendly PDF made from a Word file. Use one column, standard headings, real selectable text, consistent dates, and the site's colours only on headings and lines. Leave out email and phone, and note that they're on LinkedIn. Balance the two pages so neither is half empty, and don't split a role across the page break.

## Writing voice

- Make it sound like me, not like an interview answer. Ask me for samples of my writing and copy the rhythm: sentence length, humour, asides.
- Real stories need friction: someone disagreed, something went wrong, I changed approach. Ask me for these, and don't make them tidy.
- Be honest about gaps. No inflated claims, and nothing like "built X from scratch" unless I actually did.
- Keep it short. If a section gets long, fold detail into a "more" section instead of cutting the substance.

## Design

- Pick a distinctive palette and three fonts (display, body, mono) with me, and keep them consistent across the site, CV, cover letters and LinkedIn banner.
- Support light and dark mode with colour tokens.
- Layout must work at 280px (folded phone cover screens), 344, 390, 690 (unfolded foldables), 768, 1024 and 1280px, with no sideways scrolling anywhere. On phones the menu wraps into rows instead of scrolling.

## Technical approach

- Plain static HTML and CSS with no JavaScript, no trackers and no cookies.
- Self-host the fonts instead of loading them from a third party.
- Add security headers through the host (e.g. a Netlify `_headers` file): a strict Content-Security-Policy, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy and HSTS.
- Search and sharing:
  - a title and description on every page
  - a 1200×627 preview image for LinkedIn and other sites
  - `sitemap.xml` and `robots.txt`
  - an `llms.txt` summary so AI tools describe me accurately

## Quality checks before every publish

- Accessibility to **WCAG 2.2 Level AA**:
  - an automated check (e.g. axe with the WCAG 2.0, 2.1 and 2.2 A and AA rules) with zero violations, in light and dark mode, at phone, tablet and desktop widths
  - a manual pass covering keyboard-only navigation with visible focus, 200% zoom, a screen reader skim and target sizes
- No sideways scrolling, no console errors and no broken internal links.
- The CV PDF opens, has 2 pages and contains no email or phone.
- Lighthouse run in an incognito window, so browser extensions don't distort the score.
- Show me screenshots of the changed sections before asking for "go".

## Hosting and domain

- Host on a free static host (e.g. Netlify). Deploy by uploading a zip of the site, and keep a backup of the previous version for rollback.
- Point the domain's DNS at the host, turn on HTTPS, and check the live site after every deploy.
- I'll sign in myself. Never type my passwords, and ask before changing any DNS or account settings.

## Security checklist

- Turn on two-factor authentication on the domain registrar and the host.
- Keep auto-renew on for the domain.
- If I don't send email from the domain, add the DNS records `v=spf1 -all` and, on `_dmarc`, `v=DMARC1; p=reject`, so nobody can fake emails from it.

## LinkedIn, once the site is live

- Add the site to Featured, using the preview image as the thumbnail.
- Add it to Contact info as Portfolio, and as one line at the end of About.
- Tighten the headline around my target roles.
- Make sure every profile language version says the same thing.
- Optionally make a banner in the site's palette, keeping the text clear of the profile photo.

## How we work

1. Collect my CV, LinkedIn and GitHub first. Extract everything they and any email or notes already answer, show me what you found, then ask only for what's missing.
2. Draft one section at a time, show a preview, and wait for my OK.
3. Publish only when I say "go", then check the live site and tell me what changed.

---

© 2026 Alexandra Badescu · [alexandrabadescu.com](https://alexandrabadescu.com) · Licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/): free for personal, non-commercial use and unchanged sharing with credit. Commercial use and modified versions need the author's permission.
