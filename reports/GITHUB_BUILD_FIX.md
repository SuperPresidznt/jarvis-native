# GitHub Actions Build Failure Fix

**Date:** December 16, 2025  
**Issue:** Build APK (Release) step failing in GitHub Actions

---

## Problem

The `Build APK (Release)` step in GitHub Actions is failing. This is almost always due to **missing signing configuration** for release builds.

---

## Root Cause

Android release builds require signing keys. Your workflow tries to build a release APK but doesn't have:
1. Keystore file
2. Keystore password
3. Key alias
4. Key password

---

## Solution 1: Build Debug APK Instead (Quick Fix)

Change the workflow to build debug APK (doesn't need signing):

### Update `.github/workflows/build-apk.yml`

**Change line 52-56 from:**
```yaml
- name: Build APK (Release)
  run: |
    cd android
    ./gradlew clean
    ./gradlew assembleRelease --no-daemon --stacktrace --max-workers=1 --no-parallel --no-build-cache
```

**To:**
```yaml
- name: Build APK (Debug)
  run: |
    cd android
    ./gradlew clean
    ./gradlew assembleDebug --no-daemon --stacktrace --max-workers=1 --no-parallel --no-build-cache
```

**Also update line 63:**
```yaml
- name: List APK files
  run: |
    echo "Listing APK output directory:"
    ls -la android/app/build/outputs/apk/debug/ || echo "Debug directory not found"
    find android/app/build/outputs/apk -name "*.apk" || echo "No APK files found"
```

**And line 69:**
```yaml
- name: Rename APK
  run: |
    mkdir -p release
    find android/app/build/outputs/apk/debug -name "*.apk" -exec cp {} release/jarvis-native.apk \;
```

**Debug APK works fine for testing** - it just can't be published to Play Store.

---

## Solution 2: Add Signing Configuration (Production)

If you need a proper release build:

### Step 1: Generate Keystore (Local)

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore jarvis-release.keystore -alias jarvis-key -keyalg RSA -keysize 2048 -validity 10000
```

Enter passwords when prompted (remember them!).

### Step 2: Add Keystore to GitHub Secrets

1. Encode keystore to base64:
   ```bash
   base64 android/app/jarvis-release.keystore > keystore.txt
   ```

2. Go to GitHub repo → Settings → Secrets and variables → Actions

3. Add these secrets:
   - `KEYSTORE_BASE64` = contents of keystore.txt
   - `KEYSTORE_PASSWORD` = your keystore password
   - `KEY_ALIAS` = jarvis-key
   - `KEY_PASSWORD` = your key password

### Step 3: Update Workflow

Add before "Build APK (Release)" step:

```yaml
- name: Decode Keystore
  run: |
    echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > android/app/jarvis-release.keystore

- name: Build APK (Release)
  run: |
    cd android
    ./gradlew clean
    ./gradlew assembleRelease --no-daemon --stacktrace --max-workers=1 --no-parallel --no-build-cache
  env:
    GRADLE_OPTS: -Xmx2g -XX:MaxMetaspaceSize=512m -Dorg.gradle.jvmargs=-Xmx2g
    KEYSTORE_FILE: jarvis-release.keystore
    KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
    KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
    KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
```

### Step 4: Update build.gradle

In `android/app/build.gradle`, add signing config:

```gradle
android {
    signingConfigs {
        release {
            if (System.getenv("KEYSTORE_FILE")) {
                storeFile file(System.getenv("KEYSTORE_FILE"))
                storePassword System.getenv("KEYSTORE_PASSWORD")
                keyAlias System.getenv("KEY_ALIAS")
                keyPassword System.getenv("KEY_PASSWORD")
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## Recommendation

**For now: Use Solution 1 (Debug APK)**
- Quick fix, no setup needed
- Works for testing and internal distribution
- Can't publish to Play Store (but you're not doing that yet)

**Later: Use Solution 2 (Signed Release)**
- When you're ready to publish to Play Store
- More setup but proper production build

---

## Other Possible Causes

If it's not signing, check:

### 1. Out of Memory
GitHub Actions runners have 7GB RAM. Your build uses `--max-workers=1` which is good.

If still failing, reduce memory further:
```yaml
env:
  GRADLE_OPTS: -Xmx1g -XX:MaxMetaspaceSize=256m -Dorg.gradle.jvmargs=-Xmx1g
```

### 2. Gradle Version Mismatch
Check `android/gradle/wrapper/gradle-wrapper.properties`:
```
distributionUrl=https\://services.gradle.org/distributions/gradle-8.3-bin.zip
```

Should be 8.0+ for React Native.

### 3. Missing Dependencies
Ensure `npx expo prebuild` step succeeded. Check logs for:
```
✓ Config synced
✓ Android project ready
```

### 4. Build Cache Issues
Your workflow already uses `--no-build-cache` which is good.

---

## Quick Test

To verify the fix works, push this change:

```yaml
# .github/workflows/build-apk.yml
- name: Build APK (Debug)  # Changed from Release
  run: |
    cd android
    ./gradlew clean
    ./gradlew assembleDebug  # Changed from assembleRelease
```

Then trigger the workflow manually:
1. Go to Actions tab
2. Select "Build Android APK"
3. Click "Run workflow"

Should succeed and produce `jarvis-native.apk` (debug version).

---

**Most likely fix: Switch to debug build (Solution 1)**

— Madam Claudia
