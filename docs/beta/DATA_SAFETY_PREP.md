# Google Play Data Safety Section - Preparation

**Owner:** Finn (CFO)
**Status:** Draft - Awaiting CTO input on implementation details
**Last Updated:** December 26, 2025

---

## Overview

This document prepares answers for Google Play Console's Data Safety section. The Data Safety section is REQUIRED for Play Store submission and must accurately reflect what data the app collects, uses, and shares.

**Reference:** https://support.google.com/googleplay/android-developer/answer/10787469

---

## Data Collection Summary

### Current State (v1.0 without AI backend)

| Data Type | Collected | Stored Locally | Transmitted | Shared |
|-----------|-----------|----------------|-------------|--------|
| Tasks/Projects | Yes | Yes (SQLite) | No | No |
| Habits | Yes | Yes | No | No |
| Calendar Events | Yes | Yes | No | No |
| Financial Data | Yes | Yes | No | No |
| Focus Sessions | Yes | Yes | No | No |
| AI Conversations | Yes | Yes | **TBD** | **TBD** |
| Personal Info (Email) | No | No | No | No |
| Device Info | No | No | No | No |
| Location | No | No | No | No |
| Contacts | No | No | No | No |

### Future State (with Sentry + Analytics + AI)

| Data Type | Collected | Transmitted To | Purpose |
|-----------|-----------|----------------|---------|
| Crash Reports | Yes | Sentry | App stability |
| Usage Analytics | Yes | Segment/PostHog | Product improvement |
| AI Messages | Yes | Anthropic (via proxy) | AI features |

---

## Play Store Data Safety Questionnaire Answers

### 1. Does your app collect or share any of the required user data types?

**Answer:** YES

### 2. Is all of the user data collected by your app encrypted in transit?

**Answer:**
- Current: N/A (no data transmitted)
- With AI/Analytics: YES (HTTPS required)

### 3. Do you provide a way for users to request that their data be deleted?

**Answer:** YES
- Users can delete individual items (tasks, habits, transactions)
- Users can use "Reset All Data" in Settings (needs implementation verification)
- App stores data locally only - uninstalling removes all data

---

## Data Types Declaration

### Personal Info
- [ ] **Name** - NOT COLLECTED
- [ ] **Email** - NOT COLLECTED (no accounts)
- [ ] **User IDs** - NOT COLLECTED
- [ ] **Address** - NOT COLLECTED
- [ ] **Phone number** - NOT COLLECTED

### Financial Info
- [x] **Purchase history** - COLLECTED (user-entered transactions)
  - Purpose: App functionality (budget tracking)
  - Optional: Yes (user chooses to enter)
  - Transmitted: No (local only)
  - Shared: No

- [x] **Other financial info** - COLLECTED (assets, liabilities, budgets)
  - Purpose: App functionality
  - Optional: Yes
  - Transmitted: No
  - Shared: No

### Health and Fitness
- [ ] **Health info** - NOT COLLECTED
- [ ] **Fitness info** - NOT COLLECTED

### Messages
- [x] **Other in-app messages** - COLLECTED (AI chat if implemented)
  - Purpose: App functionality (AI assistant)
  - Optional: Yes (AI feature optional)
  - Transmitted: YES (to AI provider) - **IF AI BACKEND IMPLEMENTED**
  - Shared: No (processing only, not stored by third party)

### Photos and Videos
- [ ] NOT COLLECTED

### Audio Files
- [ ] NOT COLLECTED

### Files and Docs
- [ ] **Other user files** - POTENTIAL (if export feature used)
  - Purpose: Account management (data export)
  - Transmitted: No
  - Shared: No

### Calendar
- [x] **Calendar events** - COLLECTED
  - Purpose: App functionality
  - Optional: Yes
  - Transmitted: No
  - Shared: No

### Contacts
- [ ] NOT COLLECTED

### App Activity
- [x] **App interactions** - COLLECTED (if analytics implemented)
  - Purpose: Analytics
  - Optional: No (passive collection)
  - Transmitted: YES (to analytics provider)
  - Shared: No

- [x] **In-app search history** - NOT COLLECTED
- [x] **Other user-generated content** - COLLECTED (task descriptions, notes)
  - Purpose: App functionality
  - Transmitted: No (unless AI used)
  - Shared: No

### Web Browsing
- [ ] NOT COLLECTED

### App Info and Performance
- [x] **Crash logs** - COLLECTED (if Sentry implemented)
  - Purpose: App stability
  - Transmitted: YES (to Sentry)
  - Shared: No

- [x] **Diagnostics** - COLLECTED (if analytics implemented)
  - Purpose: Analytics
  - Transmitted: YES
  - Shared: No

### Device or Other IDs
- [ ] **Device ID** - NOT COLLECTED (verify with CTO)
- [ ] **Advertising ID** - NOT COLLECTED

---

## Data Handling Practices

### Data Security
- All local data stored in SQLite database
- **ISSUE:** Database not encrypted (flagged in security audit)
- **ISSUE:** Android `allowBackup=true` exposes data in cloud backups

### Data Retention
- Data persists until user deletes it or uninstalls app
- No automatic data expiration
- No cloud sync (data is device-local only)

### Data Deletion
- Users can delete individual items
- Uninstalling app removes all data
- **TODO:** Verify "Reset All Data" feature exists in Settings

---

## CTO Coordination Needed

Before finalizing Data Safety section, need CTO to confirm:

1. [ ] Is there any device ID or analytics collection currently?
2. [ ] Does AsyncStorage or any SDK collect device identifiers?
3. [ ] Is crash reporting already integrated? (Sentry DSN?)
4. [ ] Does the app request any permissions that imply data collection?
5. [ ] Is there a "Delete All Data" option in Settings?

---

## Recommended Data Safety Answers (v1.0 Launch)

For MINIMAL v1.0 without AI backend, analytics, or crash reporting:

**Data collected:**
- Financial info (user-entered transactions, budgets)
- Calendar (user-entered events)
- Other user-generated content (tasks, habits, notes)

**Data NOT collected:**
- Personal info (no accounts, no email)
- Location
- Contacts
- Photos/Videos
- Device identifiers

**Data handling:**
- All data stored locally on device only
- Data not transmitted to any servers
- Data not shared with third parties
- Data deleted when app uninstalled

**This is the safest, most defensible position for v1.0.**

---

## If AI Backend Implemented (v1.1+)

Must add:
- **Messages** → AI chat content transmitted to AI provider (Anthropic)
- Need to disclose: "AI conversations sent to third-party AI service for processing"
- Update Privacy Policy to reflect AI data handling

---

## Action Items

1. [x] Analyze database schema for data types - DONE
2. [ ] Verify no hidden device ID collection (CTO)
3. [ ] Confirm "Delete All Data" exists (CTO)
4. [ ] Decide AI backend for v1.0 (Human + CTO)
5. [ ] Fill out Play Console Data Safety section (after #2-4)

---

*This document is a working draft. Update as implementation details are confirmed.*
