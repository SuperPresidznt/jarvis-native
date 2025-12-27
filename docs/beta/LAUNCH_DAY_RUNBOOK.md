# Launch Day Runbook - Javi

**Target Launch Date:** February 10, 2026
**Last Updated:** [DATE]

---

## Overview

This runbook covers the 48-hour window around launch: day before, launch day, and day after. Follow chronologically. Check off as you go.

---

## Day Before Launch (-1 Day)

### Morning (9:00 AM)

- [ ] **Verify both apps are approved and ready to release**
  - App Store Connect: Status = "Pending Developer Release" or "Ready for Sale"
  - Play Console: Status = "Ready to publish" or already published to production

- [ ] **Confirm all store metadata is final**
  - App name, descriptions, screenshots, keywords
  - Privacy Policy and Terms links working
  - Support email correct

- [ ] **Test production builds one final time**
  - Download from TestFlight (iOS) and Internal Testing (Android)
  - Complete a 10-minute usage session on each platform
  - Verify no crashes, core features work

### Afternoon (2:00 PM)

- [ ] **Prepare monitoring dashboards**
  - Sentry: Bookmark your project URL, set up alerts for new issues
  - Analytics: Verify events are tracking, bookmark dashboard
  - App Store Connect Analytics: Know where to find download stats
  - Play Console: Know where to find crash reports and vitals

- [ ] **Draft social media posts** (if not already done)
  - Launch announcement (Twitter/X, LinkedIn)
  - App Store links ready to paste
  - Screenshots/graphics attached

- [ ] **Prepare email to beta testers**
  - Thank them for testing
  - Ask for App Store/Play Store reviews
  - Include download links

- [ ] **Notify your support email** (if using external service)
  - Expect increased volume
  - Set up auto-responder if needed

### Evening (6:00 PM)

- [ ] **Final check: All systems go?**
  - Sentry DSN configured in production build
  - Analytics API key configured
  - Legal URLs working
  - Support email monitored

- [ ] **Get rest.** Launch day will be busy.

---

## Launch Day (Day 0)

### Launch Morning (8:00 AM - Before Release)

- [ ] **Check email/notifications for any store issues overnight**
  - Apple sometimes pulls apps for last-minute issues
  - Google may flag policy concerns

- [ ] **Open all monitoring dashboards in browser tabs**
  - Sentry (crashes)
  - Analytics dashboard
  - App Store Connect
  - Play Console
  - Twitter/X mentions
  - Email inbox

### Release Time (10:00 AM Recommended)

*Why 10 AM? Tuesday/Wednesday 10 AM PST/EST historically gets good visibility. Avoid Monday (busy inbox) and Friday (weekend dropoff).*

- [ ] **iOS: Release to App Store**
  - App Store Connect → App → Pricing and Availability → Release this version
  - OR if set to "Manually release" → Release to users

- [ ] **Android: Publish to Production**
  - Play Console → Production → Create release (if not already) → Review and rollout
  - Recommended: Start with 20% rollout, expand if stable

- [ ] **Verify apps are live**
  - Search App Store for "Javi" (may take 15-30 min to appear)
  - Search Play Store for "Javi" (may take 1-2 hours to appear)
  - Click your direct links to verify

### Post-Release (11:00 AM)

- [ ] **Post launch announcement on social media**
  - Twitter/X
  - LinkedIn
  - ProductHunt (if prepared)
  - Reddit (r/productivity, r/apps) - follow subreddit rules

- [ ] **Send email to beta testers**
  - We're live!
  - Download links
  - Request for reviews

- [ ] **Monitor Sentry for crashes**
  - First hour is critical - if crashes spike, be ready to respond
  - Target: <1% crash rate

- [ ] **Monitor store analytics**
  - Downloads starting?
  - Any early reviews?

### Midday Check (1:00 PM)

- [ ] **Sentry status check**
  - Any new crash patterns?
  - If critical crash (>5% users affected): Prepare hotfix

- [ ] **Social media engagement**
  - Respond to congratulations, questions
  - Note any early feedback themes

- [ ] **First reviews appearing?**
  - App Store reviews may take 24-48 hours
  - Play Store reviews appear faster
  - Don't panic at early negative reviews - respond professionally

### Afternoon Check (4:00 PM)

- [ ] **Download count check**
  - App Store Connect → Analytics → Downloads
  - Play Console → Statistics → Installs

- [ ] **Crash-free rate check**
  - Sentry: % crash-free sessions
  - Target: >99%
  - If below 99%: Identify top crash, prioritize fix

- [ ] **Social mentions check**
  - Twitter search: "Javi app"
  - Any press coverage picking up?

### Evening (7:00 PM)

- [ ] **End-of-day metrics snapshot**
  - Total downloads (iOS + Android)
  - Crash-free rate
  - Number of reviews
  - Average rating (if enough reviews)
  - Top feedback themes

- [ ] **Prepare for tomorrow**
  - Any critical issues to fix overnight?
  - If hotfix needed: CTO begins work, target morning release

---

## Day After Launch (+1 Day)

### Morning (9:00 AM)

- [ ] **Review overnight metrics**
  - Downloads overnight (especially international markets)
  - Any new crashes?
  - New reviews to respond to?

- [ ] **Respond to all reviews**
  - App Store Connect → App → Ratings and Reviews
  - Play Console → Ratings and reviews
  - Template responses in `docs/beta/REVIEW_RESPONSE_TEMPLATES.md`

- [ ] **Check social media mentions**
  - Respond to questions, feedback
  - Thank users for positive mentions
  - Note feature requests

### Afternoon (2:00 PM)

- [ ] **First 24-hour report**
  - Total downloads
  - Average rating
  - Crash-free rate
  - Top 3 user feedback themes
  - Any critical issues?

- [ ] **Decide: Hotfix needed?**
  - If crash rate >1%: Yes, hotfix ASAP
  - If major UX bug reported by multiple users: Yes
  - If minor issues: Track for v1.0.1 next week

### Evening

- [ ] **Team debrief** (even if solo - write it down)
  - What went well?
  - What surprised you?
  - What would you do differently?
  - What's the top priority for this week?

---

## Days 2-7 (First Week)

### Daily Tasks (Every Day)

- [ ] Check Sentry for new crashes (morning + evening)
- [ ] Check reviews and respond within 24 hours
- [ ] Monitor download trends
- [ ] Note user feedback themes

### Day 2-3

- [ ] **Push ProductHunt** (if not done on launch day)
  - Best on Tuesday/Wednesday
  - Prepare ship page, graphics, description

- [ ] **Release hotfix if critical bugs found**
  - iOS: Expedited review possible if critical
  - Android: Staged rollout recommended

- [ ] **Expand Android rollout if stable**
  - Day 1: 20%
  - Day 2-3: 50%
  - Day 3-4: 100%

### Day 4-5

- [ ] **Compile first week feedback**
  - Top feature requests
  - Top complaints/bugs
  - Unexpected use cases

- [ ] **Plan v1.0.1 patch**
  - Fix any bugs found in week 1
  - Minor improvements based on feedback
  - Target release: End of week 2

### Day 6-7

- [ ] **First week metrics report**
  - Total downloads
  - DAU (Daily Active Users)
  - Retention: Day 1 and Day 7
  - Crash-free rate (should be >99.5%)
  - Average rating
  - Total reviews

- [ ] **Adjust ASO if needed**
  - Are you ranking for target keywords?
  - Screenshot performing well?
  - Description compelling?

---

## Emergency Response Procedures

### App Crashing on Launch (Critical)

**Symptoms:** Crash rate >5%, users reporting app won't open

**Response:**
1. Confirm in Sentry - identify crash signature
2. Attempt to reproduce locally
3. If reproducible: Fix immediately, submit hotfix
4. If not reproducible: Check device/OS combinations, identify pattern
5. Communicate: Update app description with known issue (if severe)
6. iOS: Request expedited review (available for critical issues)
7. Android: Halt rollout, push fix to staged rollout

### Bad Review Flood

**Symptoms:** Multiple 1-star reviews in short period, rating dropping

**Response:**
1. Identify root cause - is there a real bug or misunderstanding?
2. If bug: Prioritize fix, respond to reviews acknowledging issue
3. If misunderstanding: Respond to reviews explaining feature/expected behavior
4. Do NOT argue with reviewers - stay professional
5. Ask happy users to leave reviews (via beta tester email, social media)

### Server/Backend Issues (If Applicable)

**Symptoms:** Features requiring network not working

**Response:**
1. Javi is offline-first, so core features should work
2. If AI chat or future sync features affected: Check backend status
3. Communicate: In-app message or social media update
4. Rollback to last known good backend if possible

### App Store Removal

**Symptoms:** App disappears from store, email from Apple/Google

**Response:**
1. Read the removal notice carefully - understand exact violation
2. Do NOT panic-submit a new version without fixing the issue
3. If policy dispute: Appeal through proper channels
4. If legitimate violation: Fix and resubmit
5. Communicate to users if extended downtime expected

### Data Loss Reports

**Symptoms:** Users reporting lost tasks, habits, or transactions

**Response:**
1. Verify: Is data actually lost or just not visible (UI bug)?
2. Check if related to app update, device migration, or user error
3. If app bug: Highest priority fix
4. Offer support: Help user recover if possible (export backups if they exist)
5. Post-mortem: How did this happen, how to prevent in future?

---

## Key Links to Monitor

| Service | URL | What to Check |
|---------|-----|---------------|
| **Sentry** | https://sentry.io/[YOUR_ORG]/[PROJECT]/ | Crashes, errors |
| **App Store Connect** | https://appstoreconnect.apple.com | Downloads, reviews, status |
| **Play Console** | https://play.google.com/console | Downloads, reviews, crashes |
| **Analytics** | [YOUR_ANALYTICS_URL] | DAU, events, funnels |
| **Twitter/X** | Search "Javi app" or @mentions | Social mentions |
| **Support Email** | [SUPPORT_EMAIL] | User issues |

---

## Communication Plan

### If Solo Developer

**Morning (9 AM):** Check all dashboards, respond to overnight reviews/emails
**Midday (1 PM):** Quick metrics check, social media engagement
**Evening (6 PM):** End-of-day metrics, plan tomorrow's priorities

### If Team

**Slack/Discord Channels:**
- #launch-war-room - Real-time launch day coordination
- #crashes - Sentry alerts piped here
- #feedback - User reviews and social mentions

**Escalation:**
- Crash rate >1%: Alert CTO immediately
- Bad review flood: Alert CMO + Human
- Store removal: Alert Human immediately

### External Communication

**Social Media:** Respond to mentions within 2 hours during launch day
**Email Support:** Respond within 24 hours (aim for same day on launch)
**App Store Reviews:** Respond within 24-48 hours

---

## Post-Launch Success Metrics

### Week 1 Targets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Crash-free rate | >99.5% | <99% = hotfix needed |
| Average rating | >4.0 | <3.5 = investigate |
| Day 1 retention | >40% | <25% = onboarding issue |
| Day 7 retention | >20% | <10% = value issue |

### Month 1 Targets

| Metric | Target |
|--------|--------|
| Total downloads | [SET YOUR TARGET] |
| DAU/MAU ratio | >20% |
| Average rating | >4.2 |
| Featured by Apple/Google | Nice to have |

---

## Checklist Summary

### Day Before
- [ ] Apps approved and ready
- [ ] Monitoring dashboards bookmarked
- [ ] Social posts drafted
- [ ] Beta tester email ready

### Launch Day
- [ ] Release to both stores
- [ ] Post social announcements
- [ ] Email beta testers
- [ ] Monitor crashes hourly
- [ ] Respond to reviews
- [ ] End-of-day metrics snapshot

### Day After
- [ ] Respond to all reviews
- [ ] First 24-hour report
- [ ] Hotfix decision

### Week 1
- [ ] Daily crash/review monitoring
- [ ] ProductHunt launch
- [ ] Expand Android rollout
- [ ] Plan v1.0.1 patch
- [ ] First week report

---

*Questions? Check `docs/LAUNCH_CHECKLIST.md` for full task breakdown.*
*Review response templates: `docs/beta/REVIEW_RESPONSE_TEMPLATES.md`*
