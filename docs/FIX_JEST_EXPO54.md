# Fix: Jest + Expo 54 Compatibility

**Date**: Dec 23, 2025
**Issue**: Tests failing with "ReferenceError: You are trying to `import` a file outside of the scope of the test code"
**Status**: RESOLVED

---

## Problem

After upgrading to Expo 54, Jest tests failed with:

```
ReferenceError: You are trying to `import` a file outside of the scope of the test code.

  at Runtime._execModule (node_modules/jest-runtime/build/index.js:1216:13)
  at node_modules/expo/src/winter/runtime.native.ts:23:10
```

This was caused by Expo 54's "winter runtime" conflicting with Jest 30.x.

---

## Root Cause

**Jest version conflict**: Jest 30.x is incompatible with jest-expo 54.x

The issue occurs because:
1. Expo 54 introduced a new "winter runtime" (`expo/src/winter/runtime.native.ts`)
2. Jest 30.x changed module resolution behavior
3. The winter runtime tries to load before Jest mocks can intercept it

---

## Solution

**Downgrade Jest from 30.x to 29.7.0**

### Changes to package.json:

```diff
  "devDependencies": {
-   "@types/jest": "^30.0.0",
+   "@types/jest": "^29.5.0",
-   "jest": "^30.2.0",
+   "jest": "~29.7.0",
    "jest-expo": "^54.0.16",
  }
```

### Steps to apply:

```bash
# 1. Update package.json with the versions above

# 2. Clean reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Verify
npm test
```

---

## Validation Script Update

Re-enabled tests in the validation pipeline:

```diff
  "scripts": {
-   "test:smoke": "echo 'Smoke tests temporarily disabled...'",
-   "validate": "npm run type-check && npm run lint"
+   "test:smoke": "jest __tests__/smoke.test.tsx",
+   "validate": "npm run type-check && npm run lint && npm run test"
  }
```

---

## Result

```
PASS __tests__/smoke.test.tsx
  Smoke Tests - Core modules
    ✓ imports theme system without errors
    ✓ theme getColors returns valid color scheme
    ✓ imports store modules without errors
    ✓ imports hook modules without errors
    ✓ validates theme type consistency

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

Full validation now works:
- `npm run type-check` → 0 errors
- `npm run lint` → 0 errors
- `npm run test` → 5 passed

---

## Why This Matters

The CLAUDE.md guardrails require:
```
npm run type-check  # MUST pass
npm run lint        # MUST pass
npm run test        # MUST pass (if tests exist)
```

Without working tests, the validation loop was incomplete. This allowed bugs like the responsive layout collapse to slip through (type-safe code that broke at runtime).

With tests restored, agents can now catch more issues before committing.

---

## References

- [GitHub Gist: Fix for Expo Jest error](https://gist.github.com/skozz/92cc6003bcc09a04899521139376969c)
- [Jest Issue #14302](https://github.com/jestjs/jest/issues/14302)
- [Expo Issue #37261](https://github.com/expo/expo/issues/37261)

---

## Future Considerations

1. **Monitor jest-expo releases** - A future version may support Jest 30.x
2. **Add more smoke tests** - Current tests only cover theme system, could expand to cover:
   - Navigation imports
   - Database module imports
   - Component render tests (when Jest/RN Testing Library stabilizes)
3. **Consider Detox** - For E2E testing that doesn't rely on Jest module resolution
