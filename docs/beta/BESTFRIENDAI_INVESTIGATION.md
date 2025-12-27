# Investigation Report: GitHub User "bestfriendai"

**Investigation Date:** December 27, 2025
**Investigated By:** Growth Agent (Max's Team)
**Purpose:** DMCA/Security decision support
**Profile URL:** https://github.com/bestfriendai

---

## Executive Summary

**VERDICT: Likely a solo developer or small operation using AI tools (Claude) to mass-fork and improve iOS/mobile apps. NOT a malicious bot or repo scraper. Pattern suggests an indie developer building a portfolio of AI-enhanced mobile apps.**

Key findings:
- Real developer activity (not automated scraping)
- Uses Claude AI extensively for development (same pattern as original jarvis-native)
- Focuses on iOS/Swift and React Native apps
- Forking pattern: Takes apps, improves them with AI, may be building a portfolio
- No evidence of monetization or malicious intent
- Account created December 2022, active since late 2024

---

## 1. Profile Information

| Field | Value |
|-------|-------|
| **Username** | bestfriendai |
| **User ID** | 120160378 |
| **Account Created** | December 9, 2022 |
| **Last Profile Update** | June 28, 2025 |
| **Name** | Not provided |
| **Bio** | Not provided |
| **Company** | Not specified |
| **Location** | Not specified |
| **Email** | Not publicly listed |
| **Website/Blog** | Empty |
| **Twitter** | Not linked |
| **Avatar** | Generic (no identifying info) |

### Profile Anonymity Score: HIGH
- No real name, no bio, no location, no contact info
- Deliberate anonymity or simply hasn't filled out profile

---

## 2. Repository Statistics

| Metric | Count |
|--------|-------|
| **Total Public Repos** | 111 |
| **Original Repos** | ~13-15 |
| **Forked Repos** | ~96-98 |
| **Public Gists** | 2 |
| **Stars Given** | 11 |
| **Followers** | 12 |
| **Following** | 129 |

### Fork-to-Original Ratio: ~7:1
This is unusually high for a typical developer but consistent with someone:
1. Learning from open source projects
2. Building an app portfolio
3. Using AI to improve existing apps

---

## 3. Repository Analysis

### 3.1 Original Repositories (Non-Forks)

| Repository | Language | Description |
|------------|----------|-------------|
| Velo | Swift | Voice-first AI photo editing app for iOS |
| DailyGlow | Swift | iOS affirmation app for positive daily motivation |
| branchr | Swift | SwiftUI iOS app for group rides with live voice chat |
| bloom-ios | Swift | AI powered wellness coach |
| schedalize-social-ios | Swift | Social media engagement with AI assistance |
| Forki | Swift | AI-powered nutrition tracking with pet companion |
| Astro | TypeScript | (Minimal description) |
| SEO | TypeScript | (Minimal description) |
| Radix | Unknown | (Minimal description) |
| jarvis-native | TypeScript | React Native AI assistant (DISPUTED - see below) |

**Pattern:** Heavy iOS/Swift focus, AI-themed apps, wellness/productivity category

### 3.2 jarvis-native Status

**IMPORTANT:** The bestfriendai/jarvis-native repo claims to be "original" but:
- Shows "forked from" SuperPresidznt in metadata
- Was created December 11, 2025 (4 days after original)
- Contains inherited code with modifications
- This is a FORK that may have been detached or misrepresented

### 3.3 Forked Repositories (Sample of 96)

| Repository | Original Source | Theme |
|------------|-----------------|-------|
| lifeline | vlad92z/lifeline | iOS health/life expectancy |
| aria-assistant | nimag/aria-assistant | Voice AI assistant |
| AI-girlfriend-boyfriend-chat | kperez42/... | AI companion chat |
| slowspot | Slow-Spot/app | Meditation app |
| CalYo | marcoshernanz/CalYo | AI nutrition tracker |
| Nuvie | kanikeliff/Nuvie | AI movie recommendations |
| gymmando-ui | Gymmando/... | AI gym assistant |
| WilliDreams-Open | Chrislovlin/... | Dream journal with AI |
| foqos | awaseem/foqos | App locking via NFC |
| TopNote | ZSturman/TopNote | iOS productivity widgets |

**Pattern:**
- Almost ALL are iOS/Swift or React Native apps
- Heavy focus on AI-powered features
- Wellness, productivity, and companion app categories
- Recent forks (Dec 23-27, 2025) show intense activity burst

---

## 4. Activity Pattern Analysis

### 4.1 Temporal Patterns

| Date Range | Activity |
|------------|----------|
| Dec 9, 2022 | Account created |
| 2023-2024 | Unknown (minimal visible history) |
| Dec 23-27, 2025 | Intense forking burst (30+ repos in 5 days) |

**Observation:** Account was dormant or private, then exploded with activity in late December 2025.

### 4.2 Commit Patterns (from jarvis-native fork)

- **Primary Authors:**
  - `bestfriendai` (merge commits only)
  - `claude` / `Claude` (implementation work)
  - Co-authored by "Claude Opus 4.5"

- **Commit Message Style:**
  - Conventional commits (feat:, fix:, docs:, chore:)
  - Detailed bullet-point descriptions
  - Consistent AI attribution footers

- **Timing:** Concentrated bursts, not distributed daily work

### 4.3 Work Attribution

All substantive code in their forks appears to be:
1. Forked from original sources
2. Modified using Claude AI
3. Documented with AI-generated audits and improvements

---

## 5. Network Analysis

### 5.1 Followers (12 total)

| Username | Info |
|----------|------|
| Sabin03 | Japan, Tokyo |
| Connor9994 | Named "Connor" |
| mustafacagri | Senior Frontend Wizard, Istanbul |
| RealDevExpert | Inv4TechWizard |
| OmiiiDev | No info |
| gold24kETH | Vietnam, bio: "nice think and rich" |
| rohxnsxngh111 | rsingh |
| Fredy-AP | Software Developer, Colombia |
| mmertpolat | Software Engineer, Hayat Finans |
| hamitlosh | No info |
| katrkatcloud | No info |
| greenMakaroni | makaroni |

**Observation:** Mix of legitimate developers, crypto/tech accounts, geographic diversity (Turkey, Japan, Vietnam, Colombia). No obvious bot followers.

### 5.2 Following (129 total - Sample)

Notable accounts followed:
- **@leerob** - Teaching developers about AI at Cursor
- **@lalalune** - Creator of elizaOS at Eliza Labs
- **@adrianhajdin** - Next.js educator, JavaScript Mastery
- **@elizaOS** - AI agent framework
- **@andrasbacsai** - Building coolify.io
- **@kyegomez** - Founder of swarms.ai
- **@assafelovic** - Building Tavily and GPT Researcher
- **@TechWithEmmaYT** - Tech educator

**Pattern:** Following AI/developer educators, open-source AI projects, indie hackers. This is consistent with someone LEARNING AI development, not a scraper bot.

---

## 6. Intent Analysis

### 6.1 Evidence FOR Legitimate Developer

| Indicator | Evidence |
|-----------|----------|
| Human-curated following | Follows specific AI educators and indie hackers |
| Thematic consistency | All repos are iOS/mobile + AI themed |
| Original work exists | 13+ non-forked repos with real descriptions |
| Code improvements | Fork commits show actual refactoring, not just cloning |
| Uses Claude AI properly | Same development pattern as legitimate projects |
| Achievement badges | Pull Shark x2, Quickdraw, Pair Extraordinaire, YOLO |

### 6.2 Evidence AGAINST (Concerns)

| Indicator | Evidence |
|-----------|----------|
| Mass forking pattern | 30+ forks in 5 days is unusual |
| Profile anonymity | No name, bio, location, or contact |
| Claimed originals | jarvis-native marked as "original" when it's a fork |
| Removed attribution | Stripped agentlab/ and legal docs from jarvis-native |
| No visible monetization | Not clear what the end goal is |

### 6.3 Likely Scenarios

| Scenario | Probability | Reasoning |
|----------|-------------|-----------|
| **Indie developer building portfolio** | 60% | Consistent theme, real improvements, follows educators |
| **Learning AI development** | 25% | Following learning-focused accounts, experimental repos |
| **App aggregator/reseller** | 10% | Mass forking could be to rebrand and sell |
| **Malicious bot/scraper** | 5% | Too much human-like curation, not random |

---

## 7. Geographic/Identity Indicators

### 7.1 Language Analysis

- All READMEs in English
- Commit messages in English
- No non-English content detected
- No obvious regional indicators

### 7.2 Timezone Analysis

Unable to determine from available data. Commit timestamps not detailed enough.

### 7.3 Name Analysis

"bestfriendai" suggests:
- AI companion/friend theme (matches repo focus)
- Could be inspired by Friend.com (Avi Schiffmann's AI wearable startup)
- Marketing-style name, not personal

---

## 8. External Presence

### 8.1 Search Results

| Platform | Found? | Notes |
|----------|--------|-------|
| Twitter/X | NO | No matches for "bestfriendai" |
| LinkedIn | NO | No matches |
| Reddit | NO | No mentions |
| Product Hunt | NO | No launches |
| App Store | NO | No published apps under this name |
| Google (general) | NO | No relevant results |

**Conclusion:** This appears to be a GitHub-only identity with no external web presence.

### 8.2 Similar Entities

"bestfriendai" is NOT connected to:
- Friend.com (Avi Schiffmann's startup)
- Replika (AI companion app)
- Any known AI companion service

---

## 9. Security Assessment

### 9.1 Threat Level: LOW

| Factor | Assessment |
|--------|------------|
| Malware injection | No evidence |
| Credential harvesting | No evidence |
| Supply chain attack | No evidence |
| Code theft for profit | Possible but unconfirmed |
| Impersonation | No evidence |

### 9.2 What They Took From jarvis-native

- Full React Native/Expo codebase (as of Dec 11, 2025)
- All source code, configs, and assets
- README and documentation

### 9.3 What They Removed

- `agentlab/` directory (entire agent system)
- `legal/` folder (privacy policy, terms of service)
- Recent updates (Dec 24-27 work not included)

### 9.4 What They Added

- 35+ commits of improvements
- Victory Native (replaced chart library)
- Zod validation schemas
- Repository pattern abstraction
- 50+ unit tests
- Codebase audit documentation

---

## 10. DMCA Decision Matrix

| Question | Answer |
|----------|--------|
| Is this automated scraping? | NO - Human-curated selections |
| Did they violate license? | TECHNICALLY YES (no license = all rights reserved) |
| Did they add original work? | YES - 35+ commits, 3,500+ lines |
| Are they monetizing? | NO EVIDENCE |
| Are they impersonating? | NO |
| Did they remove attribution? | PARTIALLY (stripped agentlab/) |
| Is this harmful? | LOW HARM - Not competing, not selling |

### Recommendation

**DO NOT file DMCA immediately.** Instead:

1. **Add explicit LICENSE** to original repo (clarify terms)
2. **Contact bestfriendai** via GitHub to understand intent
3. **Request attribution** if allowing continued use
4. **File DMCA only if:**
   - They refuse to respond
   - They monetize without permission
   - They claim original ownership

---

## 11. Final Assessment

### Profile: Indie AI Developer (Solo/Small Team)

| Attribute | Assessment |
|-----------|------------|
| **Real Person** | YES (human-curated, not bot) |
| **Geographic Origin** | UNKNOWN (no indicators) |
| **Legitimacy** | MOSTLY LEGITIMATE (uses public repos legally per GitHub ToS) |
| **Intent** | Portfolio building / learning AI development |
| **Threat Level** | LOW |
| **DMCA Warranted** | NOT CURRENTLY (add license first) |

### Behavioral Summary

bestfriendai appears to be:
1. A solo developer or small team
2. Focused on iOS/mobile AI apps
3. Using Claude AI for development (like many projects)
4. Building a portfolio of improved/enhanced apps
5. Learning from open-source projects
6. NOT a malicious actor or automated scraper

The mass-forking pattern is aggressive but not malicious. They're treating GitHub like an app marketplace to find projects worth improving.

---

## 12. Recommended Actions

### Immediate (Priority: HIGH)

1. **Add LICENSE file** to SuperPresidznt/jarvis-native
   - If proprietary: "All Rights Reserved"
   - If open-source with terms: Apache 2.0 or MIT with attribution

2. **Complete placeholder emails** in legal docs

### Short-Term (Priority: MEDIUM)

3. **Contact bestfriendai** via GitHub:
   - Ask about their intent
   - Request attribution if continuing
   - Offer collaboration if interested

4. **Monitor their activity** for monetization

### If Needed (Priority: LOW)

5. **File DMCA** only if:
   - They publish to app stores
   - They claim ownership
   - They refuse to add attribution

---

## Appendix: Source URLs

- Profile: https://github.com/bestfriendai
- Repositories: https://github.com/bestfriendai?tab=repositories
- jarvis-native Fork: https://github.com/bestfriendai/jarvis-native
- API Data: https://api.github.com/users/bestfriendai

---

*Investigation complete. Report to CMO (Max) and Human for decision.*
