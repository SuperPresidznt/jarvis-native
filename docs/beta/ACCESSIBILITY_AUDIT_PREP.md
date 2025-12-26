# Accessibility Audit Preparation

**Owner:** Finn (CFO) - compliance | CTO - implementation
**Status:** Prep Complete - Awaiting CTO execution
**Last Updated:** December 26, 2025
**Priority:** P1 (Should do before launch - Apple reviews this)

---

## Overview

This document outlines the accessibility requirements for App Store and Play Store compliance. Apple increasingly reviews accessibility, and poor accessibility can result in rejection or negative reviews.

**Guidelines:**
- Apple: https://developer.apple.com/accessibility/
- Google: https://developer.android.com/guide/topics/ui/accessibility

---

## Audit Checklist

### 1. Touch Target Sizes

**Requirement:**
- iOS: Minimum 44x44 points
- Android: Minimum 48x48 dp

**Screens to audit:**
- [ ] Dashboard (all cards, buttons)
- [ ] Task list (checkboxes, edit buttons)
- [ ] Habit tracker (completion buttons)
- [ ] Calendar (day cells, event items)
- [ ] Finance (transaction list items, buttons)
- [ ] Focus screen (start/pause/stop buttons)
- [ ] Settings (all list items)
- [ ] Bottom navigation tabs

**Common issues:**
- Small icon buttons
- Close/dismiss buttons
- Checkbox sizes
- List item touch areas

---

### 2. Color Contrast

**Requirement:**
- Normal text: 4.5:1 minimum contrast ratio
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

**Test tools:**
- Chrome DevTools contrast checker
- Xcode Accessibility Inspector
- https://webaim.org/resources/contrastchecker/

**Areas to check:**
- [ ] Text on colored backgrounds (cards, buttons)
- [ ] Placeholder text in inputs
- [ ] Disabled state colors
- [ ] Error/success state colors
- [ ] Theme colors (light + dark mode)

**Current concerns:**
- Primary theme gradients may have low contrast text
- Subtle gray text for secondary info

---

### 3. Screen Reader Support

**iOS (VoiceOver):**
- All interactive elements need `accessibilityLabel`
- Images need `accessibilityRole="image"` with description
- Buttons need clear action labels ("Delete task" not just "Delete")
- Navigation announcements

**Android (TalkBack):**
- `contentDescription` on all interactive elements
- Proper heading hierarchy
- Focus order matches visual order

**Test method:**
- iOS: Settings > Accessibility > VoiceOver
- Android: Settings > Accessibility > TalkBack

**Critical screens:**
- [ ] Onboarding flow
- [ ] Dashboard
- [ ] All CRUD operations (create, read, update, delete)
- [ ] Modal dialogs
- [ ] Form inputs

---

### 4. Keyboard Navigation (iPad)

**Requirement:**
- All interactive elements accessible via Tab key
- Visible focus indicator
- Logical tab order

**Test method:**
- Connect hardware keyboard to iPad
- Navigate using Tab, Shift+Tab, Enter, Escape

---

### 5. Dynamic Type (iOS)

**Requirement:**
- Text should scale with system font size settings
- Layout shouldn't break at larger text sizes

**Test method:**
- Settings > Display & Brightness > Text Size
- Test at largest setting

**Areas to check:**
- [ ] All text is using scalable font styles
- [ ] Layout handles larger text without clipping
- [ ] Headers don't overlap content

---

### 6. Reduce Motion

**Requirement:**
- Respect user's "Reduce Motion" setting
- Provide alternative to animations

**React Native:**
```javascript
import { AccessibilityInfo } from 'react-native';
// Check: AccessibilityInfo.isReduceMotionEnabled()
```

**Areas to check:**
- [ ] Screen transitions
- [ ] Loading animations
- [ ] Progress indicators
- [ ] Micro-interactions

---

### 7. Dark Mode

**Requirement:**
- Full dark mode support
- Proper contrast in both modes

**Areas to check:**
- [ ] All screens render correctly in dark mode
- [ ] No hardcoded colors (use theme colors)
- [ ] System dark mode toggle respected

---

## Quick Audit Commands

### iOS (Xcode)

```bash
# Run accessibility audit
# In Xcode: Debug > Accessibility > Audit
```

### Android (Lint)

```bash
# Check for accessibility issues
./gradlew lint

# Look for:
# - ContentDescription warnings
# - ClickableViewAccessibility warnings
# - HardcodedText warnings
```

---

## Priority Fixes

Based on common React Native issues:

1. **HIGH:** Add `accessibilityLabel` to all buttons/icons
2. **HIGH:** Ensure touch targets are 44x44pt minimum
3. **MEDIUM:** Add `accessibilityRole` to interactive elements
4. **MEDIUM:** Test and fix color contrast issues
5. **LOW:** Add dynamic type support
6. **LOW:** Test reduce motion preference

---

## Estimated Effort

| Task | Hours | Owner |
|------|-------|-------|
| Touch target audit + fixes | 4-6h | CTO |
| Color contrast audit + fixes | 2-3h | CTO |
| Screen reader labels | 6-8h | CTO |
| Keyboard navigation (iPad) | 2-3h | CTO |
| Dynamic type support | 2-4h | CTO |
| Reduce motion check | 1-2h | CTO |
| **Total** | **17-26h** | |

**Recommendation:** Focus on HIGH priority items first (touch targets, screen reader basics). LOW priority can be post-launch if needed.

---

## Rejection Risk

**Apple:**
- Increasingly reviews accessibility
- Can reject for major VoiceOver issues
- Common rejection: "Your app is not accessible to users who are blind"

**Google:**
- Less strict on enforcement
- But Accessibility Scanner in pre-launch report flags issues
- Affects store ranking

---

## Action Items

1. [x] Create accessibility requirements doc - DONE (this doc)
2. [ ] CTO runs Xcode Accessibility Audit
3. [ ] CTO runs Android Lint for accessibility
4. [ ] Fix HIGH priority issues
5. [ ] Test with VoiceOver/TalkBack
6. [ ] Fix remaining issues before submission

---

*This audit prep is complete. Execution requires CTO.*
