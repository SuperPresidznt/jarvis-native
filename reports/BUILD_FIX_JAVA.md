# Build Failure Fix: Java Not Found

**Date:** December 16, 2025  
**Issue:** Gradle build failing - JAVA_HOME points to invalid directory

---

## Problem

```
ERROR: JAVA_HOME is set to an invalid directory: D:\android assistant\jdk\jdk-17.0.2
```

Java is not installed or JAVA_HOME is misconfigured.

---

## Solution: Install Java 17

### Step 1: Download Java 17
1. Go to: https://adoptium.net/temurin/releases/
2. Select:
   - **Version:** 17 (LTS)
   - **Operating System:** Windows
   - **Architecture:** x64
   - **Package Type:** JDK
3. Download the `.msi` installer

### Step 2: Install Java
1. Run the downloaded `.msi` file
2. During installation, check:
   - ✅ "Add to PATH"
   - ✅ "Set JAVA_HOME variable"
3. Install to default location (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.x.x\`)

### Step 3: Verify Installation
Open a **new** PowerShell window and run:
```powershell
java -version
```

Should show:
```
openjdk version "17.0.x"
```

Check JAVA_HOME:
```powershell
$env:JAVA_HOME
```

Should show:
```
C:\Program Files\Eclipse Adoptium\jdk-17.x.x
```

### Step 4: Try Build Again
```powershell
cd "d:\claude dash\jarvis-native"
npm run android
```

---

## Alternative: Manual JAVA_HOME Fix

If Java is already installed elsewhere, find it and update JAVA_HOME:

### Find Java Installation
```powershell
Get-ChildItem "C:\Program Files" -Recurse -Filter "java.exe" -ErrorAction SilentlyContinue | Select-Object FullName
```

### Set JAVA_HOME (This Session Only)
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.10.7-hotspot"
```

### Set JAVA_HOME (Permanently)
1. Open System Properties (Win + Pause/Break)
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", click "New"
5. Variable name: `JAVA_HOME`
6. Variable value: `C:\Program Files\Eclipse Adoptium\jdk-17.0.10.7-hotspot`
7. Click OK
8. Restart PowerShell

---

## Why Java 17?

React Native Android requires Java 17 (JDK 17) as of recent versions. Don't use Java 8, 11, or 21 - use 17 specifically.

---

**After fixing Java, your build should work.**

— Madam Claudia
