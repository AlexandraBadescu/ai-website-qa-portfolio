# Bug template and service impact model

**In plain words:** every bug is written up the same way, and its importance is worked out the same way. You rate **how many people** are affected and **how bad** it is for them, then read the **service impact** from a table. This measures harm to users, not effort, and it isn't about blame.

## Template

```markdown
### <ID>: <Title: what's wrong, in one line>

**Description**
What the problem is and who notices it, in one or two plain sentences.

**Expected behaviour**
What should happen.

**Actual behaviour**
What happens instead.

**Where and how to reproduce**
- Environment: device, screen width, browser, light or dark mode, version or build
- Steps: 1. … 2. … 3. …

**Service impact**
- Affected users: Low / Medium / Large / Very large, with who and roughly what share
- Severity: Low / Medium / High / Very high, and whether a safe workaround exists
- Impact reasoning: one or two sentences explaining the two ratings
- **Service impact: Low / Medium / High / Very high** (points: 1 / 2 / 4 / 8)

**Notes**
- Possible root cause: …
- Recommended fix: … (if any)
- Evidence: screenshots, logs, links

**Status:** Open / Fixed and verified / Not a defect, with a one-line reason
```

## Service impact = Severity × Affected users

### Affected users: how many people run into it?

| Rating | Share of users | Typical example |
|---|---|---|
| **Low** | under 1%, a niche setup | an older folding phone's cover screen |
| **Medium** | 1–10%, one segment (a role, device or browser) | tablet visitors, people who download the CV |
| **Large** | 10–25%, or most people on one key journey | dark-mode users |
| **Very large** | over 25%, or everyone | all phone visitors, all visitors |

You can raise the rating by one level for a critical or high-value group, such as recruiters reading the CV. If you do, say so in the impact reasoning.

### Severity: how bad is it for the people affected?

| Rating | Meaning |
|---|---|
| **Low** | Cosmetic, with no loss of function |
| **Medium** | Degraded or not blocking, and there's usually a workaround |
| **High** | A major function is broken, a key journey is blocked, or there's a compliance risk (for example, failing WCAG AA) |
| **Very high** | A core journey is impossible, data is lost or exposed, or there's a safety or compliance risk with no workaround |

**Workaround rule:** if a safe workaround exists, severity is normally capped at **Medium**, unless safety or compliance is involved.

### Matrix

| Severity ↓ / Affected users → | Low | Medium | Large | Very large |
|---|---|---|---|---|
| **Low** | Low | Low | Low | Medium |
| **Medium** | Low | Low | Medium | Medium |
| **High** | Medium | High | High | Very high |
| **Very high** | Medium | High | Very high | Very high |

### Points, for tracking the trend

| Service impact | Points |
|---|---|
| Very high | 8 |
| High | 4 |
| Medium | 2 |
| Low | 1 |

**Total service impact** is the sum of points for all open bugs, recorded at the same time each week. The aim isn't zero bugs. It's for the total to go down over time and for nothing serious to stay open for long.

### What each level means in practice

| Service impact | Respond | Fix or mitigate | Longest it may stay open | Review |
|---|---|---|---|---|
| **Very high / High** | within 1 working day | within 7–14 days, and before release | 30 days | weekly |
| **Medium** | decision within 30 days | planned, or deferred with a review date | 90 days | monthly |
| **Low** | at the next review | linked to planned work, or closed | 180 days | quarterly |

If a bug passes its maximum age, someone has to decide: fix it, reduce the impact (mitigate), or escalate with a clear reason. Bugs shouldn't quietly age into tech debt.

### When to re-score

Rate the impact again if:
- the workaround stops working
- usage changes
- more people start reporting it
- a mitigation changes who is affected, for example a feature flag or a fallback

---

© 2026 Alexandra Badescu. Licensed under [CC BY-NC-ND 4.0](../LICENSE).
