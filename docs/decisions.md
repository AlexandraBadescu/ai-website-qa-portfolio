# The decisions behind the green ticks

I wanted a website, not another full-time job. The AI assistant could do the coding, and I was perfectly happy to let it. But there's a small problem with letting AI build something and then asking the same AI whether it all works. Nobody should be the only reviewer of their own work, and an AI is no exception. That's why teams have code review and a second pair of eyes in testing.

So I started checking the checks. That's how I found a quality gate that could report success without actually testing anything. The interesting part wasn't just catching that bug. It was working out what would make the next green result worth trusting.

## What I owned

The AI wrote the website, suggested content and executed the checks. I supplied the facts, decided what was in scope, reviewed the results, challenged questionable outputs, prioritised defects and approved releases. I didn't write the original website code by hand, and I won't pretend otherwise.

## Three decisions worth explaining

### 1. No green result if nothing was tested

T01 was the most awkward discovery. Give the check a wrong or empty target and it could still produce a successful result. A green tick with no evidence behind it is worse than a useful failure, because it gives you confidence you haven't earned. I changed the gate to fail when the input is invalid or no pages were inspected, then added negative tests so the problem wouldn't quietly return. It adds a little friction to setup. I'm quite happy with that trade-off.

### 2. A fix isn't finished until it survives a different screen size

I fixed the phone menu after D01, tested it on a normal phone width and thought that was that. D02 disagreed. Labels were clipped on a narrow folding-phone cover, which was a useful reminder that a fix is only as good as the screens you've bothered to check. I added 280px, 344px and 690px to the regression set. More combinations, yes, but much less chance of congratulating myself too early.

### 3. Privacy checks need positive controls

The public CV check was meant to catch phone numbers before I accidentally published one. Useful, until it also decided a long reference number was a phone number. I kept the privacy rule but added a positive control with dates, metrics and reference numbers that must pass. Catching a real problem matters. Not blocking perfectly innocent content matters too. And because this is still pattern matching, I wouldn't pretend it replaces a human privacy review.

## What I would say at a release meeting

**For the recorded 30 October 2026 build:** the automated website checks and known-defect tests passed in the documented runs. That supported a go decision for those tested behaviours. It did **not** justify claiming a fresh manual accessibility audit, independently verified AI accuracy or continuous validation of the live URL. I'd make those limitations explicit and put an owner against each outstanding item.

This was my own website, not a regulated production service or a team programme, so the evidence is small. The habits are the ones I use at work: test the checks, keep limits visible, and make the release call explicit.

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
