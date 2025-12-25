# Human Actions Required for Beta Release

**Generated:** December 24, 2024
**Purpose:** Checklist of things only you can do (accounts, payments, decisions, external services)

---

## 1. Decisions Needed

| Decision | Options | Notes |
|----------|---------|-------|
| **App Name** | Pick something not trademarked | "Jarvis" likely conflicts with Marvel |
| **Support Email** | Create dedicated email | e.g., support@yourapp.com |
| **Analytics Provider** | Segment / PostHog / Expo Analytics | Segment = most features, PostHog = open source, Expo = simplest |
| **Beta Strategy** | Internal only vs. External beta | Internal = faster, External = more feedback |

---

## 2. Accounts to Create

| Account | Cost | URL | Why |
|---------|------|-----|-----|
| **Apple Developer** | $99/year | https://developer.apple.com/programs/ | Required for TestFlight/App Store |
| **Google Play Console** | $25 one-time | https://play.google.com/console | Required for Play Store |
| **Sentry** | Free tier | https://sentry.io | Crash reporting |
| **Analytics** | Free tier | Segment/PostHog/Expo | Usage tracking |

---

## 3. Legal Docs - Fill In Placeholders

**Files:** `legal/PRIVACY_POLICY.md` and `legal/TERMS_OF_SERVICE.md`

| Placeholder | Replace With |
|-------------|--------------|
| `[APP_NAME]` | Your final app name |
| `[YOUR_EMAIL]` | Support email address |
| `[YOUR_NAME/COMPANY]` | Your legal name or business entity |
| `[YOUR_STATE/COUNTRY]` | e.g., "Texas, United States" |
| `[YOUR_JURISDICTION]` | e.g., "Travis County, Texas" |

---

## 4. Host Legal Docs

Pick one and get URLs:

- [ ] **Option A: GitHub Gist** (fastest)
  - Go to gist.github.com
  - Paste each doc as separate gist
  - Copy raw URLs

- [ ] **Option B: GitHub Pages** (cleaner)
  - Enable Pages in repo settings
  - URLs: `https://yourusername.github.io/repo-name/legal/PRIVACY_POLICY`

- [ ] **Option C: Simple website** (most professional)
  - Host on Vercel/Netlify/your domain

**Then update:** `src/constants/config.ts` → `LEGAL_URLS`

---

## 5. Design Assets

| Asset | Size | Current Status | Action |
|-------|------|----------------|--------|
| **App Icon** | 1024x1024 (iOS), 512x512 (Android) | Placeholder | Design or commission |
| **Adaptive Icon** | 432x432 foreground + background | Placeholder | Design or commission |
| **Splash Screen** | Match app theme | Generic | Design or commission |
| **Screenshots** | 6 per platform (various sizes) | None | Capture from simulator |

**Options:**
- DIY with Figma/Canva
- Fiverr (~$50-100)
- 99designs (~$300+)
- AI tools (Midjourney, DALL-E for concepts)

---

## 6. App Store Metadata

**Prepare these before submission:**

### App Store (iOS)
- [ ] App Name (30 chars max)
- [ ] Subtitle (30 chars max)
- [ ] Description (4000 chars max)
- [ ] Keywords (100 chars, comma-separated)
- [ ] Category: Productivity
- [ ] Privacy Policy URL
- [ ] Support URL
- [ ] Marketing URL (optional)

### Play Store (Android)
- [ ] App Name (50 chars max)
- [ ] Short Description (80 chars)
- [ ] Full Description (4000 chars)
- [ ] Category: Productivity
- [ ] Privacy Policy URL
- [ ] Feature Graphic (1024x500)

---

## 7. Code Config Updates

**File:** `src/constants/config.ts`

```typescript
// TODO: Update these
APP_CONFIG.NAME = '[APP_NAME]';  // Your chosen name

LEGAL_URLS.PRIVACY_POLICY = 'https://...';  // Your hosted URL
LEGAL_URLS.TERMS_OF_SERVICE = 'https://...';  // Your hosted URL
LEGAL_URLS.SUPPORT_EMAIL = 'support@...';  // Your email
```

---

## 8. Sentry Setup

1. [ ] Create account at sentry.io
2. [ ] Create new project (React Native)
3. [ ] Copy DSN
4. [ ] Add to `.env`:
   ```
   SENTRY_DSN=https://xxx@sentry.io/xxx
   ```
5. [ ] (Code integration done by Claude)

---

## 9. Analytics Setup

1. [ ] Create account (Segment/PostHog/Expo)
2. [ ] Create project
3. [ ] Copy write key / API key
4. [ ] Add to `.env`:
   ```
   ANALYTICS_WRITE_KEY=xxx
   ```
5. [ ] (Code integration done by Claude)

---

## 10. Build & Submit

### iOS (TestFlight)
```bash
# Install EAS CLI (one-time)
npm install -g eas-cli

# Login
eas login

# Build for iOS
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios
```

### Android (Internal Testing)
```bash
# Build for Android
eas build --platform android --profile production

# Upload AAB to Play Console manually
# Or use: eas submit --platform android
```

---

## 11. Beta Tester Management

### TestFlight (iOS)
- [ ] Add internal testers (up to 100, instant access)
- [ ] Add external testers (up to 10,000, requires review)
- [ ] Write beta description
- [ ] Share TestFlight link

### Play Console (Android)
- [ ] Create Internal Testing track
- [ ] Add tester emails
- [ ] Share opt-in link

---

## Priority Order

### This Week (Before Beta Build)
1. ⬜ Pick app name
2. ⬜ Create Apple Developer + Google Play accounts
3. ⬜ Fill in legal doc placeholders
4. ⬜ Host legal docs, get URLs
5. ⬜ Update `config.ts` with URLs and name
6. ⬜ Create Sentry account, get DSN

### Next Week (Beta Prep)
7. ⬜ Design/commission app icon
8. ⬜ Create screenshots
9. ⬜ Write app store descriptions
10. ⬜ Build and submit to TestFlight/Play Console

### Ongoing (During Beta)
11. ⬜ Invite beta testers
12. ⬜ Monitor Sentry for crashes
13. ⬜ Collect and triage feedback
14. ⬜ Fix critical issues

---

## Quick Reference

| What | Where |
|------|-------|
| Legal docs | `legal/PRIVACY_POLICY.md`, `legal/TERMS_OF_SERVICE.md` |
| Config to update | `src/constants/config.ts` |
| Beta roadmap | `docs/BETA_ROADMAP.md` |
| Parallel workers setup | `docs/PARALLEL_WORKERS_SETUP.md` |
| Worker sync file | `agentlab/SYNC.md` |

---

*Everything else (code changes, integrations, builds) can be done by Claude Code.*
