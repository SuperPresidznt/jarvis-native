# Legal Compliance Requirements for Javi (Life OS App)

**Last Updated:** December 27, 2025
**Purpose:** Distinguish between REQUIRED filings/registrations vs. guidelines to follow

---

## Executive Summary

**Good news for solo developers:** Javi's architecture (local-first storage, manual finance tracking, optional Plaid read-only access, AI for data entry only) significantly reduces regulatory burden. Most compliance involves following guidelines rather than obtaining licenses.

### Quick Reference

| Category | Required Filings | Required Guidelines |
|----------|------------------|---------------------|
| Business Entity | Iowa LLC ($50) | Operating agreement (recommended) |
| Finance Features | None (tracking only) | Disclaimers in app |
| Plaid Integration | Plaid agreement | Security questionnaire, OAuth setup |
| AI Features | None currently | EU AI Act disclosure by Aug 2026 |
| Privacy (GDPR/CCPA) | None for local-only | Privacy policy, data rights |
| App Stores | Developer accounts | Data safety forms, review compliance |

---

## 1. Finance Features: Manual + Plaid

### The Critical Question: Is This "Financial Advice"?

**Answer: NO.** Javi is a financial **tracking** tool, not an **advisory** service.

#### What Triggers RIA (Registered Investment Advisor) Requirements:

According to the [SEC](https://www.investor.gov/introduction-investing/getting-started/working-investment-professional/investment-advisers-0), investment advisers:
- Provide investment advice for compensation
- Make specific recommendations on securities (stocks, bonds, etc.)
- Manage client assets
- Charge fees for personalized financial guidance

#### What Javi Does (Safe Activities):

- Displays user-entered or bank-imported transaction data
- Categorizes spending
- Shows charts and trends
- Tracks budgets and goals
- **Does NOT:** Recommend investments, manage money, execute trades, or provide personalized financial advice

### Money Transmitter License: NOT Required

Per [Stripe's guide](https://stripe.com/resources/more/what-is-a-money-transmitter) and [Modern Treasury](https://www.moderntreasury.com/journal/how-do-money-transmission-laws-work):

MTL is required when you:
- Accept and transmit money between parties
- Hold funds temporarily
- Process payments

**Javi only has read-only access to view transactions.** No money moves through the app. No license required.

### REQUIRED: None

### REQUIRED TO FOLLOW:

1. **Clear Disclaimers in App:**
   ```
   "Javi is a personal finance tracking tool. It does not provide
   investment advice, tax advice, or financial planning services.
   Consult a qualified professional for financial advice."
   ```

2. **No AI-Generated Financial Recommendations:**
   - AI should help with data entry ("add $50 for groceries")
   - AI should NOT say "you should invest in X" or "sell your stocks"

3. **Accuracy Disclaimer:**
   ```
   "Bank data provided through Plaid. Verify accuracy with your
   financial institution. We are not responsible for data accuracy."
   ```

---

## 2. Plaid Integration Specifically

### REQUIRED: Plaid Agreements

Per [Plaid's Developer Policy](https://plaid.com/developer-policy/):

1. **Plaid Production Access Agreement**
   - Sign during onboarding
   - Accept terms of service

2. **Security Questionnaire**
   - Required for certain US institutions using OAuth
   - Complete in Plaid Dashboard

3. **Company Profile**
   - Required for OAuth-based institution connections
   - Describes your app and use case

4. **Application Profile**
   - Details about your specific implementation

### REQUIRED TO FOLLOW:

1. **Privacy Policy Disclosure:**
   - Must disclose use of Plaid to users
   - Already covered in existing `legal/PRIVACY_POLICY.md` (should add Plaid specifically)

2. **PCI-DSS Awareness:**
   - Plaid handles sensitive data, but you must implement secure server environments
   - Use HTTPS for all API calls (already implemented per security audit)

3. **User Consent:**
   - Plaid Link handles consent flow
   - Users explicitly connect their accounts

4. **OAuth Support:**
   - Required for some institutions
   - Implement Plaid's OAuth flow

### State-by-State Requirements:

**None for read-only tracking.** State requirements primarily apply to money transmitters and lenders. Since Javi only reads data (no transactions, transfers, or lending), no state-specific financial licenses are needed.

### EU/UK Note:

If expanding to Europe, there's a "separate compliance process" per [Plaid docs](https://plaid.com/docs/launch-checklist/). This includes PSD2 and Open Banking requirements. **Not needed for US-only launch.**

---

## 3. AI Features

### Current Status: Low Risk

Javi uses AI for:
- Natural language data entry ("Add $20 for lunch")
- Voice input processing
- NOT for: investment recommendations, credit decisions, risk assessment

### EU AI Act Implications

Per the [EU AI Act](https://artificialintelligenceact.eu/article/50/):

**Timeline:**
- Prohibited AI practices: February 2, 2025
- AI literacy obligations: February 2, 2025
- Transparency provisions: **August 2, 2026**

**Risk Classification:**
Javi's AI is likely "minimal risk" (not high-risk):
- Not used for credit scoring
- Not used for employment decisions
- Not used for essential services access
- Not biometric or surveillance

**Article 50 Transparency Requirements (by Aug 2026):**
If AI generates content, you must:
- Mark AI-generated content as such
- Disclose to users they're interacting with AI

### REQUIRED: None currently

### REQUIRED TO FOLLOW:

1. **For US Launch (Now):**
   - No specific AI disclosure requirements
   - Best practice: Note "AI-powered" in app description

2. **For EU Users (by August 2026):**
   - Disclose AI usage: "This feature uses artificial intelligence"
   - Consider adding to Settings or onboarding

3. **AI Output Disclaimers:**
   ```
   "AI suggestions are for convenience only. Always verify
   important information. AI may make mistakes."
   ```

### Penalty Warning:

EU AI Act violations can reach **35 million EUR or 7% of global turnover** per [EU regulations](https://artificialintelligenceact.eu/article/50/). Take this seriously for EU launch.

---

## 4. App Store Requirements

### Apple App Store

Per [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) and [2025 updates](https://nextnative.dev/blog/app-store-review-guidelines):

#### REQUIRED:

1. **Apple Developer Account:** $99/year
2. **Privacy Policy URL:** Must be publicly accessible
3. **App Privacy Details:** Complete "App Privacy" section in App Store Connect

#### Finance App Specific (Guideline 3.2.1(viii)):

Apple states apps for "financial trading, investing, or money management should be submitted by the financial institution performing such services."

**Javi is exempt because:**
- It's personal tracking, not trading/investing
- No money moves through the app
- User manages their own data locally
- Plaid integration is read-only

**If Apple questions this:**
- Emphasize local-first, read-only nature
- Point to disclaimer about not providing financial advice
- Compare to similar apps (Mint, YNAB, Copilot)

#### AI Requirements (Guideline 5.1.2, Nov 2025):

- Disclose if sharing data with third-party AI systems
- Get explicit user permission before AI data transmission

### Google Play Store

Per [Google Play Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469) and [Financial Features Declaration](https://support.google.com/googleplay/android-developer/answer/13849271):

#### REQUIRED:

1. **Google Play Developer Account:** $25 (one-time)
2. **Data Safety Form:** Complete for all apps
3. **Financial Features Declaration:** **Required for ALL apps**, even those without financial features

#### Financial Features Declaration:

You must certify:
- Whether app offers financial features
- Types of financial services (if any)
- Licensing information (if applicable)

**For Javi:**
- Declare: Personal finance tracking
- No licenses required (tracking only, no transactions)
- Complete honestly about Plaid integration

#### Personal Loan App Rules (NOT applicable to Javi):

Google prohibits apps with APR > 36% or repayment < 60 days. **Does not apply** since Javi has no lending features.

---

## 5. Data Privacy: GDPR and CCPA

### The Local-First Advantage

Because Javi stores data locally on device (not cloud), many requirements are reduced but **not eliminated**.

### GDPR (EU Users)

Per [GDPR requirements](https://gdprlocal.com/ai-transparency-requirements/):

#### What Triggers GDPR:

GDPR applies if you:
- Offer goods/services to EU residents
- Monitor behavior of EU residents
- Process personal data of EU residents

**Even local-only apps must comply if available in EU.**

#### REQUIRED:

1. **Privacy Policy:** Already have `legal/PRIVACY_POLICY.md`
2. **Legal Basis for Processing:** Consent (for analytics) + Legitimate Interest (for app function)
3. **Data Subject Rights:** Ability to access, export, delete data (already in app)

#### REQUIRED TO FOLLOW:

1. **Consent for Analytics:**
   - Must be opt-in (not opt-out) for EU
   - Consider: Analytics disabled by default for EU, enable on consent

2. **Right to Erasure:**
   - User can delete all data
   - Should be easy in Settings

3. **Data Portability:**
   - Export in machine-readable format (JSON, CSV)
   - Already planned in Settings

4. **Storage Limitation:**
   - Don't retain analytics longer than needed
   - Current policy: 12 months (acceptable)

### CCPA (California Users)

Per [CCPA requirements](https://www.cookiebot.com/en/ccpa-vs-gdpr/):

#### Threshold for CCPA:

Only applies if you:
- Gross revenue > $25 million, OR
- Process data of 100,000+ California residents, OR
- Derive 50%+ revenue from selling data

**Most solo developers are exempt from CCPA compliance requirements.**

#### REQUIRED (if thresholds met):

1. "Do Not Sell My Personal Information" link
2. Privacy policy disclosures
3. Respond to consumer requests within 45 days

#### RECOMMENDED (even if exempt):

1. Include CCPA section in privacy policy (already done)
2. Don't sell user data (already policy)
3. Honor deletion requests (already possible)

### Local Storage Specifics:

| Concern | Local-Only Impact |
|---------|-------------------|
| Data breaches | You don't have the data, user's device does |
| Server security | No servers = no server compliance |
| Cross-border transfers | Only analytics (if any) leaves device |
| Right to access | User has it already - it's on their device |

---

## 6. COPPA (Children's Privacy)

Per [FTC COPPA Rule](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa) and [2025 amendments](https://blog.promise.legal/startup-central/coppa-compliance-in-2025-a-practical-guide-for-tech-edtech-and-kids-apps/):

### Is Javi Child-Directed?

**No.** Javi is a personal finance and productivity app for adults.

### REQUIRED:

None, if you:
- Don't target children under 13
- Don't market to children
- State in privacy policy app is not for children under 13 (already done)

### RECOMMENDED:

1. **Age Gate (Optional):**
   - Not required for general audience apps
   - Consider if any features could attract children

2. **Privacy Policy Statement:**
   - Already included: "The App is not intended for children under 13"
   - Already included: "We do not knowingly collect personal information from children under 13"

3. **If Child Data Accidentally Collected:**
   - Delete immediately upon discovery
   - Have process documented

### App Store Kids Category:

**Do not list in Kids Category.** This triggers full COPPA compliance and Apple's additional requirements (parental gates, etc.).

---

## 7. Business Entity Requirements

### Iowa LLC Formation

Per [Iowa Secretary of State](https://help.sos.iowa.gov/how-do-i-form-llc) and [ZenBusiness guide](https://www.zenbusiness.com/iowa-llc/):

#### REQUIRED:

| Item | Cost | Frequency |
|------|------|-----------|
| Certificate of Organization | $50 | One-time |
| Registered Agent | $0 (self) or $50-150/yr (service) | Ongoing |
| Biennial Report | $30 (online) | Every 2 years (odd years, by March 31) |
| EIN (if employees or bank account) | Free | One-time |

#### RECOMMENDED:

| Item | Why |
|------|-----|
| Operating Agreement | Defines ownership, protects LLC status |
| Separate Bank Account | Maintains liability protection |
| Business Insurance | Protects personal assets |

#### BOI Reporting Update (March 2025):

Per FinCEN's revised rules, **US-formed LLCs no longer need to file BOI reports** as of March 2025. Only foreign-formed companies must report.

### Total Startup Costs:

| Item | Cost |
|------|------|
| Iowa LLC | $50 |
| Apple Developer | $99/year |
| Google Play Developer | $25 (one-time) |
| **Minimum to Launch** | **$174** |

---

## 8. What Papers Are ACTUALLY Required?

### Mandatory Filings/Registrations:

| Document | Entity | Cost | Purpose |
|----------|--------|------|---------|
| Certificate of Organization | Iowa SOS | $50 | Form LLC |
| EIN | IRS | Free | Business bank account, taxes |
| Apple Developer Agreement | Apple | $99/yr | Publish iOS app |
| Google Play Developer Agreement | Google | $25 | Publish Android app |
| Plaid Production Agreement | Plaid | Free | Use Plaid API |

### Mandatory Documents to Create:

| Document | Location | Status |
|----------|----------|--------|
| Privacy Policy | `legal/PRIVACY_POLICY.md` | Done (needs Plaid addition) |
| Terms of Service | `legal/TERMS_OF_SERVICE.md` | Done |

### NOT Required (Common Misconceptions):

| What People Think | Reality |
|-------------------|---------|
| Money Transmitter License | Not needed - read-only access |
| RIA Registration | Not needed - tracking, not advising |
| State Financial Licenses | Not needed - no transactions |
| COPPA Compliance | Not needed - not child-directed |
| Data Protection Officer | Not needed - below thresholds |
| EU Representative | Not needed - small scale exception likely applies |

---

## 9. Gotchas for Solo Developers

### Watch Out For:

1. **AI Feature Creep:**
   - If AI ever says "you should invest in..." = potential RIA issues
   - Keep AI strictly for data entry, not recommendations

2. **Payment Processing:**
   - If you add in-app payments, new requirements kick in
   - Stick to Apple/Google IAP to avoid PCI compliance

3. **Loan Features:**
   - Never add "suggested loans" or lending marketplace
   - Triggers extensive state-by-state licensing

4. **Apple "Trading" Classification:**
   - If Apple classifies you as trading/investing app, prepare documentation
   - Have clear talking points ready

5. **EU Expansion Timing:**
   - EU AI Act provisions phase in through 2027
   - Plan disclosures before EU launch

6. **Analytics Consent (EU):**
   - GDPR requires opt-in, not opt-out
   - May need different consent flow for EU users

7. **Plaid Institution Coverage:**
   - Not all banks supported everywhere
   - May get user complaints; have FAQ ready

8. **California Threshold Monitoring:**
   - If app grows, may cross CCPA thresholds
   - Track California user count if approaching 100k

### Safe Harbors:

1. **Read-Only = Safe:**
   - As long as you only read financial data (not move money), you avoid most financial regulation

2. **Local Storage = Privacy Advantage:**
   - You can truthfully say you don't have user data
   - Reduces breach liability

3. **No Personalized Advice = No RIA:**
   - Generic tips OK ("save more")
   - Specific recommendations not OK ("buy AAPL")

---

## 10. Pre-Launch Checklist

### Required Before Launch:

- [ ] Iowa LLC formed ($50)
- [ ] EIN obtained (free)
- [ ] Apple Developer account ($99)
- [ ] Google Play Developer account ($25)
- [ ] Plaid production access approved (free)
- [ ] Privacy Policy published at public URL
- [ ] Terms of Service published at public URL
- [ ] App Store App Privacy section completed
- [ ] Google Play Data Safety form completed
- [ ] Google Play Financial Features Declaration completed

### Required in App:

- [ ] Financial disclaimer visible (not advice, verify with institution)
- [ ] AI disclaimer (if applicable)
- [ ] Link to Privacy Policy from Settings
- [ ] Link to Terms of Service from Settings
- [ ] Data export functionality
- [ ] Data deletion functionality

### Recommended:

- [ ] Operating Agreement for LLC
- [ ] Business bank account
- [ ] Add Plaid to Privacy Policy third-party services
- [ ] Analytics opt-out option
- [ ] Age confirmation (optional, for extra protection)

---

## Sources

### Regulatory and Legal

- [SEC - Investment Adviser Registration](https://www.investor.gov/introduction-investing/getting-started/working-investment-professional/investment-advisers-0)
- [Stripe - What is a Money Transmitter?](https://stripe.com/resources/more/what-is-a-money-transmitter)
- [Modern Treasury - Money Transmission Laws](https://www.moderntreasury.com/journal/how-do-money-transmission-laws-work)
- [FTC - COPPA Rule](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa)
- [EU AI Act - Article 50](https://artificialintelligenceact.eu/article/50/)

### App Store Guidelines

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple 2025 Guideline Updates](https://nextnative.dev/blog/app-store-review-guidelines)
- [Google Play Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469)
- [Google Play Financial Features Declaration](https://support.google.com/googleplay/android-developer/answer/13849271)

### Plaid Integration

- [Plaid Developer Policy](https://plaid.com/developer-policy/)
- [Plaid Launch Checklist](https://plaid.com/docs/launch-checklist/)

### Privacy Regulations

- [CCPA vs GDPR Comparison](https://www.cookiebot.com/en/ccpa-vs-gdpr/)
- [GDPR AI Transparency Requirements](https://gdprlocal.com/ai-transparency-requirements/)
- [COPPA 2025 Updates](https://blog.promise.legal/startup-central/coppa-compliance-in-2025-a-practical-guide-for-tech-edtech-and-kids-apps/)

### Business Formation

- [Iowa LLC Formation](https://help.sos.iowa.gov/how-do-i-form-llc)
- [Iowa LLC Requirements](https://www.zenbusiness.com/iowa-llc/)

---

*This document is for informational purposes only and does not constitute legal advice. Consult a licensed attorney for specific legal guidance.*
