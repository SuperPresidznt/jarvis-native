# LAUNCH CHECKLIST
**Jarvis Native - Master Launch Plan**

**Status:** IN PROGRESS
**Created:** December 25, 2025
**Last Updated:** December 26, 2025
**Owner:** Human (CEO)

---

## Overview

This is THE master checklist for launching Jarvis Native to App Store and Google Play. All tasks from all reports (technical, legal, marketing, beta roadmap) are consolidated here with clear ownership, dependencies, and status tracking.

**Timeline:** 6 weeks to public launch
**Current Phase:** Phase 1 - Blockers
**Target Launch Date:** February 10, 2026

### Target Milestones
| Phase | Target Date | Status |
|-------|-------------|--------|
| Phase 1: Blockers | Jan 5, 2026 | ⬜ Not Started |
| Phase 2: Parallel Work | Jan 19, 2026 | ⬜ Not Started |
| Phase 3: Integration/Beta | Feb 2, 2026 | ⬜ Not Started |
| Phase 4: Submit | Feb 9, 2026 | ⬜ Not Started |
| PUBLIC LAUNCH | Feb 10, 2026 | ⬜ Not Started |

### Team Roster
| Role | Agent | Status |
|------|-------|--------|
| CEO | Human | Active |
| CTO | ??? | **OPEN - NEEDS FILL** |
| CMO | Max | Active |
| CFO | Finn | Active |

---

## PHASE 1: BLOCKERS (Week 1)
**Must do before anything else. No parallel work until these are done.**

### 1.1 Business Setup (HUMAN)

- [ ] **Create Apple Developer Account** ($99/year)
  - **Owner:** Human
  - **Status:** ⬜ Not Started
  - **Depends on:** None (START HERE)
  - **File:** None
  - **Timeline:** 1-2 business days approval
  - **URL:** https://developer.apple.com/programs/
  - **Critical:** BLOCKS ALL iOS WORK

- [ ] **Create Google Play Developer Account** ($25 one-time)
  - **Owner:** Human
  - **Status:** ⬜ Not Started
  - **Depends on:** None (START HERE)
  - **File:** None
  - **Timeline:** 1-7 days approval
  - **URL:** https://play.google.com/console/signup
  - **Critical:** BLOCKS ALL ANDROID WORK

- [ ] **Decide App Name**
  - **Owner:** Human
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **File:** `docs/beta/APP_STORE_COPY.md` (update all `[APP_NAME]` placeholders)
  - **Notes:** "Jarvis" may conflict with Marvel trademark. Consider alternatives.
  - **Critical:** BLOCKS LEGAL DOCS, STORE LISTINGS

### 1.2 Legal Documents (CMO)

- [ ] **Complete Privacy Policy Placeholders**
  - **Owner:** CMO
  - **Status:** 🔄 In Progress (template exists, needs placeholders filled)
  - **Depends on:** App name decision
  - **File:** `legal/PRIVACY_POLICY.md`
  - **Placeholders to fill:**
    - `[APP_NAME]` → Final app name
    - `[YOUR_EMAIL]` → Support email (e.g., support@jarvis.app)
  - **Critical:** BLOCKS STORE SUBMISSION

- [ ] **Complete Terms of Service Placeholders**
  - **Owner:** CMO
  - **Status:** 🔄 In Progress (template exists, needs placeholders filled)
  - **Depends on:** App name decision
  - **File:** `legal/TERMS_OF_SERVICE.md`
  - **Placeholders to fill:**
    - `[APP_NAME]` → Final app name
    - `[YOUR_NAME/COMPANY]` → Legal entity name
    - `[YOUR_EMAIL]` → Support email
    - `[YOUR_STATE/COUNTRY]` → Governing jurisdiction
    - `[YOUR_JURISDICTION]` → Court jurisdiction
  - **Critical:** BLOCKS STORE SUBMISSION

- [ ] **Host Legal Documents Publicly**
  - **Owner:** CMO / Human
  - **Status:** ⬜ Not Started
  - **Depends on:** Privacy Policy + Terms completed
  - **Options:**
    - GitHub Pages: `https://yourusername.github.io/jarvis-native/legal/`
    - GitHub Gist (fastest): Create 2 gists, copy raw URLs
    - Dedicated website: `https://yoursite.com/privacy` + `/terms`
  - **Action:** Update `src/constants/config.ts` → `LEGAL_URLS` with final URLs
  - **Critical:** BLOCKS STORE SUBMISSION

### 1.3 Technical Blockers (CTO)

- [ ] **Fix HTTP → HTTPS Backend URL**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **File:** `src/constants/config.ts`
  - **Issue:** `ENDPOINTS.BASE_URL = 'http://localhost:800'` (insecure)
  - **Fix:** Move to environment variable, default to HTTPS in production
  - **Effort:** 2-3 hours
  - **Critical:** Apple WILL reject apps with HTTP networking (App Transport Security violation)
  - **Rejection Risk:** HIGH

- [ ] **Disable Android Backup OR Add Exclusion Rules**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **File:** `app.json` → `android.allowBackup = false`
  - **Issue:** Encrypted data exposed in Android cloud backups
  - **Fix:** Either disable backup entirely OR exclude sensitive data
  - **Effort:** 1-2 hours
  - **Critical:** Security vulnerability, may be flagged in review
  - **Rejection Risk:** MEDIUM

- [ ] **Audit Database Queries for SQL Injection**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **Files:** All files in `src/database/` (13 modules)
  - **Issue:** Ensure all queries use parameterized statements, not string interpolation
  - **Effort:** 8-12 hours (full audit)
  - **Critical:** Security flaw (not tested by stores, but critical)
  - **Rejection Risk:** LOW (stores don't test, but bad practice)

- [ ] **Decide AI Backend Strategy**
  - **Owner:** Human + CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **Options:**
    - **A:** Implement backend (40-60 hours, delays launch)
    - **B:** Remove AI chat from v1.0 (4 hours, faster launch) ✅ RECOMMENDED
    - **C:** Ship with "Coming Soon" placeholder (RISKY - may be rejected)
  - **Files:** `src/screens/main/AIChatScreen.tsx`, backend endpoints
  - **Notes:** AI UI is 80% done, backend 0% done. Recommend defer to v1.1.
  - **Critical:** Impacts launch timeline and feature set

### 1.4 Critical Assets (HUMAN + DESIGN CONTRACTOR)

- [ ] **Design App Icon**
  - **Owner:** Human (commission designer) or CTO (DIY)
  - **Status:** ⬜ Not Started (placeholder exists)
  - **Depends on:** App name, brand identity
  - **Specs:**
    - iOS: 1024x1024px PNG, no transparency, no rounded corners
    - Android: 512x512px PNG
    - Adaptive Icon: 432x432px safe zone, foreground + background layers
  - **Files:** Replace `assets/icon.png`, `assets/adaptive-icon.png`
  - **Design tips:** Simple, 2-3 colors, high contrast, recognizable at small sizes
  - **Effort:** 6-8 hours (design) OR $50-100 (Fiverr/99designs)
  - **Critical:** BLOCKS STORE LISTING

- [ ] **Create Support Email**
  - **Owner:** Human
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **Action:** Create `support@[yourdomain].com` or use personal email
  - **Usage:** Required for App Store + Play Store listings, Privacy Policy, Terms of Service
  - **Critical:** BLOCKS STORE SUBMISSION

---

## PHASE 2: PARALLEL WORK (Week 2-3)
**What each team can do simultaneously after Phase 1 blockers are cleared**

### 2.1 CTO TRACK (Code/Technical)

#### 2.1.1 Monitoring & Analytics Setup

- [ ] **Integrate Sentry (Crash Reporting)**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None (can start anytime)
  - **Steps:**
    1. Create Sentry account at https://sentry.io (free tier: 5,000 errors/month)
    2. Install: `npm install @sentry/react-native`
    3. Configure in `App.tsx` with DSN
    4. Add error boundaries
    5. Test crash reporting in staging
  - **Files:** `App.tsx`, `.env` (add `SENTRY_DSN`)
  - **Effort:** 2-4 hours
  - **Priority:** P0 (MUST HAVE before beta)

- [ ] **Set Up Analytics**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Decide analytics platform (Segment/PostHog/Expo)
  - **Steps:**
    1. Choose platform (Segment recommended for most features)
    2. Create account + project
    3. Install SDK
    4. Instrument key events (app open, screen views, feature usage)
    5. Test in development
  - **Files:** New file `src/services/analytics.ts`, `.env` (add API key)
  - **Effort:** 6-8 hours
  - **Priority:** P0 (MUST HAVE for beta insights)

- [ ] **Environment Configuration**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **Steps:**
    1. Create `.env.example` with all required variables
    2. Create `.env.production` for beta builds
    3. Update `src/constants/config.ts` to use env vars
    4. Document environment setup in README
  - **Files:** `.env.example`, `.env.production`, `src/constants/config.ts`
  - **Effort:** 2-3 hours
  - **Priority:** P1 (Should have before beta)

#### 2.1.2 Performance & Optimization

- [ ] **Performance Baseline Testing**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **Tests:**
    - App launch time (target: <3s cold start)
    - Screen transition time (target: <300ms)
    - Database queries with 1000+ tasks (target: <100ms)
    - Memory usage (target: <200MB iOS, <250MB Android)
  - **Tools:** React Native Performance Monitor, Xcode Instruments, Android Profiler
  - **Effort:** 4-6 hours
  - **Priority:** P1 (Should do before beta)

- [ ] **Add Database Indexes**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **File:** `src/database/schema.ts`
  - **Indexes needed:**
    ```sql
    CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
    CREATE INDEX idx_tasks_due_date ON tasks(due_date);
    CREATE INDEX idx_habits_user_archived ON habits(user_id, archived);
    CREATE INDEX idx_calendar_user_date ON calendar_events(user_id, start_time);
    CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
    ```
  - **Effort:** 2-3 hours
  - **Priority:** P2 (Nice to have)

#### 2.1.3 App Signing & Build Setup

- [ ] **iOS Code Signing Setup**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Apple Developer account approved
  - **Steps:**
    1. Install EAS CLI: `npm install -g eas-cli`
    2. Login: `eas login`
    3. Configure: `eas build:configure`
    4. Create Distribution Certificate in Apple Developer Portal
    5. Create App Store Provisioning Profile
  - **Effort:** 4-6 hours (first time)
  - **Priority:** P0 (REQUIRED for iOS submission)

- [ ] **Android App Signing Setup**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Google Play account approved
  - **Steps:**
    1. Generate upload keystore:
       ```bash
       keytool -genkeypair -v -storetype PKCS12 \
         -keystore jarvis-upload-key.keystore \
         -alias jarvis-key-alias \
         -keyalg RSA -keysize 2048 -validity 10000
       ```
    2. Store credentials securely (1Password, GitHub Secrets)
    3. Configure `eas.json` with keystore info
    4. Enroll in Play App Signing
  - **Effort:** 3-4 hours
  - **Priority:** P0 (REQUIRED for Android submission)

- [ ] **Set Up CI/CD Pipeline (Optional)**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** App signing setup
  - **Files:** `.github/workflows/ios-build.yml`, `.github/workflows/android-build.yml`
  - **Benefit:** Automated builds on every commit
  - **Effort:** 10-14 hours
  - **Priority:** P2 (Nice to have, not required for beta)

#### 2.1.4 Code Quality

- [ ] **Clean Up ESLint Warnings**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **Issues:**
    - 150 unused imports/variables
    - 274 console.log statements (replace with logger)
    - 26 missing dependency arrays
    - 68 explicit `any` types
  - **Effort:** 4-6 hours
  - **Priority:** P2 (Nice to have, not blocking)

- [ ] **Add Privacy Manifest for iOS 17+**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **File:** Create `ios/jarvis/PrivacyInfo.xcprivacy`
  - **Required APIs to declare:**
    - User defaults (AsyncStorage)
    - File timestamp (expo-file-system)
  - **Effort:** 2-3 hours
  - **Priority:** P0 (iOS 17+ REQUIREMENT - Apple rejects without this)
  - **Rejection Risk:** HIGH

- [ ] **Set Android Target API to 34**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **File:** `app.json` → `android.targetSdkVersion = 34`
  - **Required:** Google requires API 34 (Android 14) as of August 2024
  - **Effort:** 1 hour (if already compatible)
  - **Priority:** P0 (REQUIRED for Play Store submission)
  - **Rejection Risk:** BLOCKING

### 2.2 CMO TRACK (Marketing/Legal)

#### 2.2.1 App Store Metadata

- [ ] **Finalize App Store Description**
  - **Owner:** CMO
  - **Status:** ✅ Done (template ready, needs final app name)
  - **Depends on:** App name decision
  - **File:** `docs/beta/APP_STORE_COPY.md`
  - **Action:** Replace all `[APP_NAME]`, `[YOUR_EMAIL]`, `[PRIVACY_URL]`, `[TERMS_URL]` placeholders
  - **Specs:**
    - iOS: Subtitle (30 chars), Description (4000 chars), Keywords (100 chars)
    - Android: Short Description (80 chars), Full Description (4000 chars)
  - **Priority:** P0 (REQUIRED for store listing)

- [ ] **Research Keywords (ASO)**
  - **Owner:** CMO
  - **Status:** ✅ Done (preliminary research in APP_STORE_COPY.md)
  - **Depends on:** None
  - **File:** `docs/beta/APP_STORE_COPY.md` (section "Keywords")
  - **Top keywords:** productivity, task manager, habit tracker, to-do list, calendar, budget, focus timer, pomodoro
  - **Effort:** Already done, may refine
  - **Priority:** P1 (Should optimize before launch)

- [ ] **Write Release Notes Template**
  - **Owner:** CMO
  - **Status:** ✅ Done
  - **Depends on:** App name
  - **File:** `docs/beta/APP_STORE_COPY.md` (section "Release Notes v1.0.0")
  - **Action:** Update placeholders
  - **Priority:** P1 (Needed for submission)

#### 2.2.2 Design Assets

- [ ] **Create Screenshots (iOS)**
  - **Owner:** Human (commission designer) or CTO (DIY)
  - **Status:** ⬜ Not Started
  - **Depends on:** Final app running with real data
  - **Specs:**
    - 6.5" iPhone (1284 x 2778px) - iPhone 14 Pro Max
    - 5.5" iPhone (1242 x 2208px) - iPhone 8 Plus (optional)
    - 12.9" iPad (2048 x 2732px) - Optional for iPad support
    - Minimum: 5 screenshots per size
  - **Content:**
    1. Dashboard (hero shot)
    2. Tasks screen
    3. Focus timer
    4. Habits tracking
    5. Calendar
    6. Finance (optional 6th)
  - **Tools:** Simulator screenshots + device frames (https://screenshots.pro or Figma)
  - **Effort:** 20-30 hours (design + production)
  - **Priority:** P0 (REQUIRED for store listing)

- [ ] **Create Screenshots (Android)**
  - **Owner:** Human (commission designer) or CTO (DIY)
  - **Status:** ⬜ Not Started
  - **Depends on:** iOS screenshots (can reuse)
  - **Specs:**
    - Phone: 1080 x 1920px or 1440 x 2560px
    - Minimum: 2 screenshots, Maximum: 8
    - Recommended: 5-6 (match iOS feature coverage)
  - **Effort:** 12-16 hours (can reuse iOS designs)
  - **Priority:** P0 (REQUIRED for store listing)

- [ ] **Create Google Play Feature Graphic**
  - **Owner:** Human (commission designer) or CTO (DIY)
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **Specs:** 1024 x 500px PNG or JPEG
  - **Content:** Banner with app screenshots montage + tagline
  - **Effort:** 4-6 hours
  - **Priority:** P1 (Highly recommended, increases visibility)

- [ ] **Create Splash Screen**
  - **Owner:** Human (commission designer) or CTO (DIY)
  - **Status:** ⬜ Not Started (placeholder exists)
  - **Depends on:** App icon finalized
  - **File:** `assets/splash-icon.png`
  - **Recommendation:** Keep minimal (fast loading), match app theme gradient
  - **Effort:** 2-3 hours
  - **Priority:** P2 (Nice to have, current placeholder OK)

#### 2.2.3 Support & FAQ

- [ ] **Create Support FAQ**
  - **Owner:** CMO
  - **Status:** ✅ Done
  - **Depends on:** None
  - **File:** `docs/SUPPORT_FAQ.md`
  - **Action:** Host publicly and link from app Settings
  - **Priority:** P2 (Nice to have, TestFlight feedback sufficient for beta)

- [ ] **Add In-App Support Links**
  - **Owner:** CTO (implementation) + CMO (content)
  - **Status:** ✅ Done (links to Privacy Policy + Terms already in SettingsScreen)
  - **Depends on:** Legal docs hosted
  - **File:** `src/screens/main/SettingsScreen.tsx`
  - **Action:** Verify links work after legal docs are hosted
  - **Priority:** P0 (Required for compliance)

#### 2.2.4 Social Media & Launch Prep (Optional for Beta)

- [ ] **Create Landing Page**
  - **Owner:** CMO (content) + Human (implementation or contractor)
  - **Status:** ⬜ Not Started
  - **Depends on:** Screenshots, app name, legal docs
  - **Options:**
    - GitHub Pages (free)
    - Vercel (free)
    - Carrd ($19/year, fastest)
  - **Effort:** 20-30 hours (custom) OR 2-3 hours (Carrd template)
  - **Priority:** P2 (Nice to have for launch, not required for beta)

- [ ] **Prepare Launch Day Social Media**
  - **Owner:** CMO
  - **Status:** ⬜ Not Started
  - **Depends on:** Screenshots, store links
  - **Platforms:** Twitter/X, LinkedIn, ProductHunt
  - **Effort:** 4-6 hours (drafting posts, scheduling)
  - **Priority:** P2 (Nice to have for public launch)

### 2.3 CFO TRACK (Pricing/Security) - Owner: Finn

- [ ] **Decide Monetization Strategy**
  - **Owner:** Human + Finn (CFO)
  - **Status:** ✅ Research Done (see `docs/beta/MONETIZATION_STRATEGY_REPORT.md`)
  - **Depends on:** None
  - **Options:**
    - **Free (No monetization)** ✅ RECOMMENDED for beta
    - **Freemium** (Free + Premium tier at $4.99/month or $39.99/year)
    - **Paid upfront** (Not recommended, very low install rate)
  - **Recommendation:** Launch free, add monetization post-beta based on user feedback
  - **Effort:** 2-3 hours (decision making)
  - **Priority:** P1 (Needed before public launch, can defer for beta)

- [ ] **Complete Data Safety Section (Play Store)**
  - **Owner:** Finn (CFO) + CTO
  - **Status:** 🔄 In Progress (Finn preparing)
  - **Depends on:** Final feature set (AI chat included or not?)
  - **File:** Filled in Google Play Console UI
  - **Required declarations:**
    - Personal info: Email (if using accounts)
    - Financial info: Transaction history, budgets
    - Messages: AI chat conversations (if included)
    - Files/Docs: Export data
  - **Effort:** 4-6 hours (coordinate with CTO)
  - **Priority:** P0 (REQUIRED for Play Store submission)
  - **Rejection Risk:** BLOCKING

- [ ] **Accessibility Audit**
  - **Owner:** Finn (CFO) + CTO (implementation)
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **Tests:**
    - Screen reader support (VoiceOver iOS, TalkBack Android)
    - Touch target sizes (minimum 44x44pt iOS, 48x48dp Android)
    - Color contrast ratios (4.5:1 for text)
  - **Tools:** Xcode Accessibility Inspector, Android Lint
  - **Effort:** 8-12 hours (audit + fixes)
  - **Priority:** P1 (Should do before launch, Apple reviews this)
  - **Rejection Risk:** MEDIUM

### 2.4 HUMAN TRACK (Accounts/Decisions)

- [ ] **Set Up Analytics Account**
  - **Owner:** Human
  - **Status:** ⬜ Not Started
  - **Depends on:** Decide analytics platform
  - **Options:** Segment / PostHog / Expo Analytics
  - **Action:** Create account, get API key, share with CTO
  - **Priority:** P0 (Needed for analytics integration)

- [ ] **Set Up Sentry Account**
  - **Owner:** Human
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **URL:** https://sentry.io (free tier sufficient)
  - **Action:** Create account, create project, get DSN, share with CTO
  - **Priority:** P0 (Needed for crash reporting integration)

- [ ] **Choose App Categories**
  - **Owner:** Human
  - **Status:** ⬜ Not Started
  - **Depends on:** None
  - **iOS:**
    - Primary: Productivity
    - Secondary: Business or Lifestyle
  - **Android:**
    - Category: Productivity
    - Tags: Task Manager, Habit Tracker, Calendar, Budget, Focus Timer
  - **Effort:** 1 hour
  - **Priority:** P1 (Needed for store submission)

- [ ] **Complete Age Rating Questionnaire**
  - **Owner:** Human
  - **Status:** ⬜ Not Started
  - **Depends on:** Final feature set (AI chat moderation?)
  - **Answer "None" to all content questions:**
    - Violence: None
    - Sexual content: None
    - Profanity: None
    - Drugs/alcohol: None
  - **Expected rating:** 4+ (iOS) / Everyone (Android)
  - **Note:** If AI chat allows unfiltered content, may bump to 17+
  - **Effort:** 30 minutes
  - **Priority:** P1 (Needed for store submission)

---

## PHASE 3: INTEGRATION (Week 3-4)
**Bring it all together, beta testing**

### 3.1 Platform Setup

- [ ] **Configure App Store Connect**
  - **Owner:** Human + CMO (metadata)
  - **Status:** ⬜ Not Started
  - **Depends on:** Apple Developer account approved, app name finalized, legal docs hosted
  - **Steps:**
    1. Create App ID: `com.jarvis.assistant` (or your chosen bundle ID)
    2. Create App Record in App Store Connect
    3. Fill in metadata (name, subtitle, description, keywords)
    4. Upload screenshots
    5. Add Privacy Policy URL
    6. Add Support URL
    7. Configure TestFlight settings
  - **Effort:** 2-3 hours
  - **Priority:** P0 (REQUIRED for iOS beta)

- [ ] **Configure Google Play Console**
  - **Owner:** Human + CMO (metadata)
  - **Status:** ⬜ Not Started
  - **Depends on:** Google Play account approved, app name finalized, legal docs hosted
  - **Steps:**
    1. Create Application in Play Console
    2. Package name: `com.jarvis.assistant`
    3. Fill in store listing (name, descriptions, screenshots)
    4. Add Privacy Policy URL
    5. Complete Content Rating questionnaire
    6. Complete Data Safety section
  - **Effort:** 2-3 hours
  - **Priority:** P0 (REQUIRED for Android beta)

### 3.2 Build & Upload Beta

- [ ] **Build iOS Beta (TestFlight)**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** iOS code signing setup, App Store Connect configured, all P0 code tasks done
  - **Command:** `eas build --platform ios --profile production`
  - **Action:** Upload to App Store Connect, submit for TestFlight review
  - **Timeline:** Build (30-60 min), Review (1-2 days)
  - **Effort:** 2 hours (first time, including troubleshooting)
  - **Priority:** P0 (REQUIRED for iOS beta)

- [ ] **Build Android Beta (Internal Testing)**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Android signing setup, Play Console configured, all P0 code tasks done
  - **Command:** `eas build --platform android --profile production`
  - **Action:** Upload AAB to Play Console, create Internal Testing release
  - **Timeline:** Build (30-60 min), Internal Testing (instant, no review)
  - **Effort:** 2 hours
  - **Priority:** P0 (REQUIRED for Android beta)

### 3.3 Beta Tester Recruitment

- [ ] **Invite Internal Beta Testers**
  - **Owner:** Human
  - **Status:** ⬜ Not Started
  - **Depends on:** TestFlight + Internal Testing builds live
  - **Target:** 10-25 testers (friends, family, colleagues)
  - **iOS:** Add via email in TestFlight (up to 100)
  - **Android:** Add via email in Internal Testing (up to 100)
  - **Effort:** 2-3 hours (outreach)
  - **Priority:** P0 (REQUIRED for beta testing)

- [ ] **Recruit External Beta Testers (Optional)**
  - **Owner:** Human + CMO
  - **Status:** ⬜ Not Started
  - **Depends on:** Internal beta successful
  - **Target:** 50-100 testers
  - **Sources:**
    - BetaList.com
    - Reddit: r/alphaandbetausers, r/productivity
    - ProductHunt "Ship" page
    - Twitter/LinkedIn followers
  - **Incentive:** Free lifetime premium (if adding monetization later)
  - **Effort:** 6-8 hours
  - **Priority:** P2 (Optional, can skip for faster launch)

### 3.4 Beta Testing Cycle

- [ ] **Internal Testing (Week 1)**
  - **Owner:** Human (coordinate) + CTO (fix bugs)
  - **Status:** ⬜ Not Started
  - **Depends on:** Beta builds distributed
  - **Timeline:** 3-5 days
  - **Actions:**
    - Monitor Sentry for crashes (target: >99% crash-free rate)
    - Review analytics (verify events tracking)
    - Collect feedback via TestFlight/Play Console
    - Triage bugs by severity (P0/P1/P2)
  - **Priority:** P0 (REQUIRED before public launch)

- [ ] **Fix Critical Bugs (P0)**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Internal testing feedback
  - **Definition:** App crashes, data loss, security issues, submission blockers
  - **Action:** Fix immediately, deploy OTA update or rebuild
  - **Priority:** P0 (MUST fix before external beta or public launch)

- [ ] **Fix High-Priority Bugs (P1)**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** P0 bugs fixed
  - **Definition:** Features broken, major UX issues, performance problems
  - **Action:** Include in next weekly release
  - **Priority:** P1 (Should fix before public launch)

- [ ] **External Beta Testing (Week 2, Optional)**
  - **Owner:** Human (coordinate) + CTO (fix bugs) + CMO (announce)
  - **Status:** ⬜ Not Started
  - **Depends on:** Internal testing complete, P0 bugs fixed
  - **Timeline:** 1-2 weeks
  - **Actions:**
    - iOS: Add external testers to TestFlight (up to 10,000)
    - Android: Promote to Closed Testing track
    - Announce beta on social media / email list
    - Iterate on feedback
  - **Priority:** P2 (Optional, can skip for faster launch)

### 3.5 Performance Validation

- [ ] **Device Testing (Real Hardware)**
  - **Owner:** CTO + Beta testers
  - **Status:** ⬜ Not Started
  - **Depends on:** Beta builds available
  - **Minimum device coverage:**
    - iOS: iPhone SE (small), iPhone 14 (standard), iPhone 15 Pro Max (large)
    - Android: Budget device (API 28), Samsung flagship, Google Pixel
  - **Tests:**
    - Fresh install (empty states)
    - Import large data set (1000+ tasks)
    - Offline mode (airplane mode)
    - Background/foreground transitions
  - **Effort:** 8-12 hours (comprehensive testing)
  - **Priority:** P1 (Should do before public launch)

- [ ] **Verify Crash-Free Rate >99.5%**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Beta testing with Sentry monitoring
  - **Target:** >99.5% crash-free sessions (industry standard)
  - **Action:** Monitor Sentry dashboard during beta
  - **Priority:** P0 (Go/No-Go criterion for public launch)

---

## PHASE 4: SUBMIT (Week 4-5)
**Final submission steps**

### 4.1 Pre-Submission Validation

- [ ] **Final Code Review**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** All P0/P1 bugs fixed
  - **Checklist:**
    - [ ] TypeScript: 0 errors (run `npm run type-check`)
    - [ ] ESLint: 0 errors (run `npm run lint`)
    - [ ] No hardcoded secrets or credentials
    - [ ] All console.log removed or replaced with logger
    - [ ] Privacy manifest added (iOS 17+)
    - [ ] Target API 34 (Android)
  - **Effort:** 2-3 hours
  - **Priority:** P0 (REQUIRED before submission)

- [ ] **Store Listing Review**
  - **Owner:** CMO + Human
  - **Status:** ⬜ Not Started
  - **Depends on:** All metadata finalized
  - **Checklist:**
    - [ ] App name accurate
    - [ ] Description compelling, no typos
    - [ ] Screenshots show actual app (not mockups)
    - [ ] Privacy Policy link works
    - [ ] Support email works
    - [ ] Keywords optimized
    - [ ] Age rating appropriate
  - **Effort:** 1-2 hours
  - **Priority:** P0 (REQUIRED before submission)

- [ ] **Test Production Builds on Devices**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Production builds ready
  - **Action:** Install production builds on physical devices, verify everything works
  - **Tests:**
    - App launches successfully
    - Core features work (tasks, habits, focus, calendar, finance)
    - No crashes during 10-minute usage session
    - Legal links in Settings work
  - **Effort:** 2-3 hours
  - **Priority:** P0 (REQUIRED before submission)

### 4.2 Production Submission

- [ ] **Update Version to 1.0.0**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Ready to submit
  - **Files:** `package.json`, `app.json`
  - **Action:** Bump version from beta (e.g., 0.9.0) to 1.0.0
  - **Effort:** 5 minutes
  - **Priority:** P0 (REQUIRED for submission)

- [ ] **Build Production Release (iOS)**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Version updated, all validations passed
  - **Command:** `eas build --platform ios --profile production`
  - **Timeline:** 30-60 minutes (build time)
  - **Effort:** 1 hour (monitoring build)
  - **Priority:** P0 (REQUIRED for iOS submission)

- [ ] **Build Production Release (Android)**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Version updated, all validations passed
  - **Command:** `eas build --platform android --profile production`
  - **Timeline:** 30-60 minutes (build time)
  - **Effort:** 1 hour
  - **Priority:** P0 (REQUIRED for Android submission)

- [ ] **Submit to App Store for Review**
  - **Owner:** Human (final approval) + CTO (technical)
  - **Status:** ⬜ Not Started
  - **Depends on:** iOS production build ready, App Store Connect fully configured
  - **Steps:**
    1. Upload build to App Store Connect
    2. Select build for submission
    3. Fill in "What's New in This Version" (release notes)
    4. Answer App Store review questions
    5. Submit for review
  - **Timeline:** 1-3 days review (Apple)
  - **Effort:** 1 hour (submission process)
  - **Priority:** P0 (REQUIRED for iOS launch)

- [ ] **Submit to Play Store for Review**
  - **Owner:** Human (final approval) + CTO (technical)
  - **Status:** ⬜ Not Started
  - **Depends on:** Android production build ready, Play Console fully configured
  - **Steps:**
    1. Upload AAB to Play Console
    2. Create Production release
    3. Fill in release notes
    4. Roll out to 100% of users (or staged rollout 10% → 50% → 100%)
    5. Submit for review
  - **Timeline:** 1-3 days review (Google)
  - **Effort:** 1 hour
  - **Priority:** P0 (REQUIRED for Android launch)

### 4.3 Review & Launch Monitoring

- [ ] **Monitor App Store Review Status**
  - **Owner:** Human + CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Submission complete
  - **Action:** Check App Store Connect daily for review status
  - **If rejected:** Respond to review feedback within 24 hours
  - **Common rejection reasons:**
    - Privacy Policy missing/incomplete
    - HTTP networking (ATS violation)
    - Crashes on launch
    - Misleading screenshots or description
  - **Priority:** P0 (REQUIRED for approval)

- [ ] **Monitor Play Store Review Status**
  - **Owner:** Human + CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Submission complete
  - **Action:** Check Play Console daily for review status
  - **If rejected:** Fix issues, resubmit
  - **Common rejection reasons:**
    - Privacy Policy missing
    - Data Safety section incomplete
    - Target API level too old (must be 34)
    - Permissions unjustified
  - **Priority:** P0 (REQUIRED for approval)

- [ ] **Prepare Launch Announcement**
  - **Owner:** CMO
  - **Status:** ⬜ Not Started
  - **Depends on:** Apps approved, ready to go live
  - **Content:**
    - Social media posts (Twitter/X, LinkedIn)
    - ProductHunt launch
    - Email to beta testers (ask for reviews)
  - **Effort:** 4-6 hours (drafting, scheduling)
  - **Priority:** P1 (Should do for launch day visibility)

- [ ] **Launch Day! (Release to Public)**
  - **Owner:** Human (final decision) + All teams
  - **Status:** ⬜ Not Started
  - **Depends on:** Both apps approved by stores
  - **Action:** Set apps to "Available for Sale" in App Store Connect and Play Console
  - **Timing:** Coordinate launch time (e.g., Tuesday 10am PST for maximum visibility)
  - **Checklist:**
    - [ ] Apps approved by stores
    - [ ] Sentry monitoring active
    - [ ] Analytics tracking verified
    - [ ] Support email monitored
    - [ ] Social media posts scheduled
  - **Priority:** P0 (THE GOAL!)

---

## PHASE 5: POST-LAUNCH
**Monitoring and iteration**

### 5.1 Week 1 Post-Launch

- [ ] **Monitor Crash Rate Daily**
  - **Owner:** CTO
  - **Status:** ⬜ Not Started
  - **Depends on:** Public launch
  - **Target:** >99.9% crash-free rate
  - **Action:** Check Sentry dashboard every morning, fix critical crashes immediately
  - **Priority:** P0 (ONGOING)

- [ ] **Monitor Analytics Daily**
  - **Owner:** Human + CMO
  - **Status:** ⬜ Not Started
  - **Depends on:** Public launch
  - **Metrics to track:**
    - Daily Active Users (DAU)
    - Session duration
    - Feature adoption (% using tasks, habits, focus, etc.)
    - Crash-free rate
  - **Action:** Review analytics dashboard, identify issues
  - **Priority:** P0 (ONGOING)

- [ ] **Respond to User Reviews**
  - **Owner:** CMO + Human
  - **Status:** ⬜ Not Started
  - **Depends on:** Public launch, users leaving reviews
  - **Action:** Respond to App Store/Play Store reviews within 24-48 hours
  - **Priority:** P1 (Important for reputation)

- [ ] **Triage User Feedback**
  - **Owner:** Human (PM) + CTO (technical)
  - **Status:** ⬜ Not Started
  - **Depends on:** Public launch
  - **Process:**
    - Collect feedback from reviews, support emails, TestFlight, Play Console
    - Categorize by severity (P0/P1/P2/P3)
    - Create backlog for future releases
  - **Priority:** P1 (ONGOING)

### 5.2 Ongoing (Post-Launch)

- [ ] **Weekly Analytics Review**
  - **Owner:** Human + All teams
  - **Status:** ⬜ Not Started
  - **Depends on:** Public launch
  - **Cadence:** Every Monday
  - **Metrics:**
    - User growth (downloads, DAU/WAU)
    - Retention (Day 1, Day 7, Day 30)
    - Feature adoption trends
    - Top user-requested features
  - **Action:** Update roadmap based on data
  - **Priority:** P1 (ONGOING)

- [ ] **Monthly Release Cycle**
  - **Owner:** CTO (builds) + All teams (content)
  - **Status:** ⬜ Not Started
  - **Depends on:** Public launch
  - **Cadence:**
    - Patch releases (1.0.1): As needed for critical bugs
    - Minor releases (1.1.0): Every 2-4 weeks
    - Major releases (2.0.0): Quarterly or when significant features ready
  - **Priority:** P1 (ONGOING)

- [ ] **Plan v1.1 Features**
  - **Owner:** Human (PM) + All teams
  - **Status:** ⬜ Not Started
  - **Depends on:** v1.0 launched, user feedback collected
  - **Candidates (from reports):**
    - AI Chat backend implementation (if deferred from v1.0)
    - Voice input for quick capture
    - Google Calendar sync
    - Biometric authentication
    - Cloud backup/sync
    - Onboarding tutorial improvements
  - **Process:** Prioritize based on user feedback + analytics
  - **Priority:** P2 (Future planning)

---

## GO/NO-GO CRITERIA FOR PUBLIC LAUNCH

**ALL of these must be TRUE before launching to public:**

- [ ] Crash-free rate >99.5% in beta testing
- [ ] All P0 bugs fixed (app crashes, data loss, security issues)
- [ ] Privacy Policy published and linked
- [ ] Terms of Service published and linked
- [ ] App icons finalized (not placeholders)
- [ ] Screenshots uploaded (minimum required for each platform)
- [ ] Sentry monitoring active and verified
- [ ] Analytics tracking active and verified
- [ ] HTTP → HTTPS backend URL fixed
- [ ] Android backup disabled or restricted
- [ ] Privacy manifest added (iOS 17+)
- [ ] Target API 34 (Android)
- [ ] TestFlight review approved (iOS)
- [ ] Internal testing successful (Android)
- [ ] Performance benchmarks met (app launch <3s, screen transitions <300ms)
- [ ] Support email monitored
- [ ] App Store Connect fully configured
- [ ] Google Play Console fully configured

**If ANY item is FALSE:** Delay public launch, fix the issue.

---

## RISK MITIGATION

### High-Risk Items (May Cause Rejection)

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| **App Store rejection (Privacy Manifest missing)** | MEDIUM | HIGH | Add PrivacyInfo.xcprivacy (iOS 17+ requirement) | CTO |
| **Play Store rejection (Target API too old)** | HIGH | BLOCKING | Set targetSdkVersion to 34 in app.json | CTO |
| **App Store rejection (HTTP networking)** | HIGH | BLOCKING | Fix ENDPOINTS.BASE_URL to HTTPS | CTO |
| **Privacy Policy incomplete** | LOW | BLOCKING | Use template from legal/PRIVACY_POLICY.md, review carefully | CMO |
| **Crashes during review** | MEDIUM | HIGH | Beta test on multiple devices, monitor Sentry, fix P0 bugs | CTO |
| **Performance issues (slow launch)** | MEDIUM | MEDIUM | Profile on low-end devices (iPhone 8, Android API 28), optimize | CTO |
| **Data Safety section incomplete (Play Store)** | MEDIUM | BLOCKING | Coordinate with CTO on what data is collected | CFO |

### Timeline Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Apple Developer account approval delayed** | +2-7 days | Apply immediately, expedite if possible |
| **Google Play account approval delayed** | +1-7 days | Apply immediately, verify ID proactively |
| **App Store review rejection** | +3-7 days (resubmit cycle) | Follow guidelines carefully, test thoroughly |
| **Play Store review rejection** | +1-3 days | Use Pre-Launch Report, fix issues before submission |
| **Beta testing reveals critical bugs** | +1-2 weeks | Internal testing first, fix P0 bugs immediately |
| **Screenshot creation delayed** | +1 week | Commission designer early OR use DIY tools |

---

## FILE REFERENCE

**Key files you'll need to update:**

```
Configuration:
├── app.json - App metadata, bundle IDs, version, Android target API
├── eas.json - Build profiles for EAS
├── package.json - Version number
├── src/constants/config.ts - API endpoints, legal URLs, feature flags
├── .env.production - Environment variables for production builds

Legal:
├── legal/PRIVACY_POLICY.md - Fill placeholders, host publicly
├── legal/TERMS_OF_SERVICE.md - Fill placeholders, host publicly

Marketing:
├── docs/beta/APP_STORE_COPY.md - Finalize all placeholders

Assets:
├── assets/icon.png - REPLACE with final app icon (1024x1024)
├── assets/adaptive-icon.png - REPLACE (512x512)
├── assets/splash-icon.png - Update or keep minimal

Monitoring (NEW FILES):
├── src/services/analytics.ts - CREATE for analytics integration
├── .env - CREATE with Sentry DSN, analytics API key
├── ios/jarvis/PrivacyInfo.xcprivacy - CREATE for iOS 17+

Documentation:
├── docs/LAUNCH_CHECKLIST.md - THIS FILE (update status as you go)
├── docs/beta/APP_STORE_LAUNCH_WORKSTREAMS.md - Technical reference
├── docs/BETA_ROADMAP.md - Detailed roadmap
├── docs/HUMAN_ACTIONS_REQUIRED.md - Human-only tasks
├── agentlab/SYNC.md - Team coordination
```

---

## TIMELINE SUMMARY

**Optimistic (2 weeks to beta, 4 weeks to public):**
```
Week 1: Phase 1 blockers (accounts, legal, security fixes, assets)
Week 2: Phase 2 parallel work (monitoring, metadata, screenshots)
Week 3: Phase 3 integration (platform setup, build beta, internal testing)
Week 4: Phase 4 submission (fix bugs, submit to stores, review)
Week 5: Public launch + monitoring
```

**Realistic (3 weeks to beta, 6 weeks to public):**
```
Week 1-2: Phase 1 blockers + start Phase 2
Week 3: Finish Phase 2 parallel work
Week 4: Phase 3 integration (beta builds, internal testing)
Week 5: Phase 3 continued (external beta optional, bug fixes)
Week 6: Phase 4 submission + approval
Week 7: Public launch
```

**Conservative (4 weeks to beta, 8 weeks to public):**
```
Week 1-2: Phase 1 blockers
Week 3-4: Phase 2 parallel work
Week 5: Phase 3 integration (beta builds)
Week 6-7: Phase 3 continued (internal + external beta, iterations)
Week 8: Phase 4 submission
Week 9-10: Review period + public launch
```

**RECOMMENDATION:** Plan for realistic timeline (6 weeks to public), buffer for conservative (8 weeks).

---

## QUICK START GUIDE

**If you're reading this for the first time, start here:**

### This Week (Priority 1):
1. Create Apple Developer + Google Play accounts (Human) - BLOCKS EVERYTHING
2. Decide app name (Human) - BLOCKS LEGAL, METADATA
3. Create support email (Human) - BLOCKS LEGAL, STORE LISTINGS
4. Fill legal doc placeholders (CMO) - BLOCKS STORE SUBMISSION
5. Fix HTTP → HTTPS backend URL (CTO) - BLOCKS APPLE APPROVAL
6. Decide AI backend strategy (Human + CTO) - IMPACTS TIMELINE

### Next Week (Priority 2):
7. Commission app icon design (Human) - BLOCKS STORE LISTING
8. Set up Sentry + Analytics (Human + CTO) - BLOCKS BETA QUALITY
9. Host legal docs publicly (CMO) - BLOCKS STORE SUBMISSION
10. Add Privacy Manifest iOS 17+ (CTO) - BLOCKS APPLE APPROVAL
11. Set Android target API 34 (CTO) - BLOCKS GOOGLE APPROVAL

### Week 3 (Priority 3):
12. Create screenshots (Human/Designer) - BLOCKS STORE LISTING
13. Configure App Store Connect + Play Console (Human) - BLOCKS SUBMISSION
14. Build beta releases (CTO) - STARTS BETA TESTING
15. Recruit internal beta testers (Human) - STARTS FEEDBACK LOOP

### Week 4+ (Priority 4):
16. Beta test, fix bugs, iterate
17. Submit to stores, monitor review
18. Launch!

---

## TEAM ASSIGNMENTS

**Current team (from agentlab/SYNC.md):**
- **Human (CEO):** Accounts, decisions, final approvals, coordination
- **Max (CMO):** Legal, marketing, ASO, metadata, social media
- **??? (CTO):** Code, builds, DevOps, security, QA - **OPEN, NEEDS FILL**
- **Finn (CFO):** Pricing, Data Safety, accessibility, compliance - **ACTIVE**

**Recommended delegation for faster execution:**
- **Design work:** Commission external designer ($50-200) OR use Fiverr/99designs
- **Legal review:** Template + lawyer review ($500-1500) OR use LegalZoom/Rocket Lawyer
- **Landing page:** Use Carrd template ($19/year, 2-3 hours) OR hire contractor

---

## STATUS TRACKING LEGEND

- ✅ Done - Task completed
- 🔄 In Progress - Currently being worked on
- ⬜ Not Started - Task not yet begun
- ❌ Blocked - Cannot proceed until dependency resolved

**Update this checklist as you complete tasks. This is THE source of truth for launch status.**

---

**END OF CHECKLIST**

*Questions? Refer to detailed reports:*
- Technical details: `docs/beta/APP_STORE_LAUNCH_WORKSTREAMS.md`
- Beta roadmap: `docs/BETA_ROADMAP.md`
- Human tasks: `docs/HUMAN_ACTIONS_REQUIRED.md`
- Marketing copy: `docs/beta/APP_STORE_COPY.md`
- Team sync: `agentlab/SYNC.md`
