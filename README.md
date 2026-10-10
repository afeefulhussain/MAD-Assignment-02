# Mobile Application Development (MAD)
## Assignment 02: Bottom Tab Bar, Splash Screen and App Icon

**Student Name:** Afeef Ul Hussain  
**Course:** Mobile Application Development (MAD)  
**Framework:** React Native (Expo SDK 57)  
**Submission Date:** 10 – Oct – 2026  
**EAS Project ID:** `7a56e7f0-20df-4a57-9505-f4c84cacb955`  
**GitHub Repository:** [https://github.com/afeefulhussain/MAD-Assignment-02](https://github.com/afeefulhussain/MAD-Assignment-02)  
**📄 Official Submission PDF (Live Link):** [View / Download PDF](https://github.com/afeefulhussain/MAD-Assignment-02/blob/master/MAD_Assignment_02_Afeef_Ul_Hussain.pdf)


---

## 📋 Table of Contents
1. [Assignment Overview](#-assignment-overview)
2. [Proof of Extension from Assignment 01](#-proof-of-extension-from-assignment-01)
3. [Implemented Requirements & Evidence](#-implemented-requirements--evidence)
   - [Requirement 1: New Bottom Tab Screen](#1-add-a-new-bottom-tab-screen)
   - [Requirement 2: Custom Splash Screen & App Icon](#2-customize-splash-screen-and-app-icon)
   - [Requirement 3: Themed Components (ThemedView & ThemedText)](#3-use-themed-components)
4. [VS Code Project Structure](#-vs-code-project-structure)
5. [APK Installer & Build Link](#-apk-installer--build-information)
6. [Local Setup & Testing Guide](#-local-setup--testing-guide)

---

## 🎯 Assignment Overview

This project builds upon the foundational React Native Expo application created in **Assignment 01**. In **Assignment 02**, the application has been extended into a fully functional multi-screen application featuring:
- A custom **Bottom Tab Navigation Bar** with 3 distinct screens:
  1. `Home`: Retains Assignment 01's interactive counter and system guide, refactored with themed components.
  2. `Modules`: Interactive MAD course syllabus with dynamic status tracking.
  3. `Profile & Settings` (**NEW Screen**): Student metadata, interactive Light/Dark theme switcher, and verification checklist.
- Branded **Custom App Icon** and **Custom Splash Screen** configured directly in `app.json`.
- Unified **Themed Components architecture** (`ThemedView` and `ThemedText`) supporting real-time Light and Dark themes.

---

## 🔍 Proof of Extension from Assignment 01

Per the assignment guideline:
> *"Assignment 02 must be developed as an extension of your Assignment 01 project. Do not create a separate application from scratch."*

The Git history preserves the step-by-step evolution:
- **Commit 1 (`85018ed`):** `Assignment 01: Initial React Native Expo application setup` (Single-screen counter app with Expo Go guidance).
- **Commit 2:** `Assignment 02: Add Bottom Tab Bar, Themed Components, Custom Splash Screen & App Icon` (Full extension with new bottom tabs, theming, and custom assets).

You can verify the progression via Git log:
```bash
git log --oneline
```

---

## 🚀 Implemented Requirements & Evidence

### 1. Add a New Bottom Tab Screen
- **Requirement:** Create one new screen in the bottom tab navigation with a suitable title and meaningful content.
- **Implementation:**
  - **Screen Name:** `ProfileScreen.js`
  - **Tab Label & Icon:** "Profile" with `Ionicons` `person` / `person-outline` and a `NEW` indicator badge.
  - **Title:** `Student Profile & Settings`
  - **Meaningful Content:**
    1. **Student Identification Card:** Displays student name (*Afeef Ul Hussain*), course (*Mobile Application Development*), and assignment submission badge.
    2. **Live Theme Switcher:** Interactive buttons for `Light`, `Dark`, and `System` modes that toggle all themed components across the app in real time.
    3. **Assignment 02 Checklist:** Interactive task tracker verifying all requirements.
    4. **Runtime & Build Specifications:** Details Expo SDK 57, React Native 0.86, and EAS Build credentials.

#### Bottom Tab Navigator Implementation (`navigation/BottomTabNavigator.js`):
```javascript
export function BottomTabNavigator() {
  const [activeTab, setActiveTab] = useState('home');
  const { colors } = useAppTheme();

  const tabs = [
    { id: 'home', label: 'Home', iconActive: 'home', iconInactive: 'home-outline' },
    { id: 'explore', label: 'Modules', iconActive: 'book', iconInactive: 'book-outline' },
    { id: 'profile', label: 'Profile', iconActive: 'person', iconInactive: 'person-outline', badge: 'NEW' },
  ];
  // Renders HomeScreen, ExploreScreen, or ProfileScreen seamlessly
}
```

---

### 2. Customize Splash Screen and App Icon
- **Requirement:** Replace default splash screen and app icon with custom designs related to the application.
- **Implementation & Assets:**
  - **Custom App Icon (`assets/icon.png`):** High-resolution 1024x1024 icon featuring a smartphone frame displaying bottom tab navigation badges, vibrant indigo gradient, and MAD branding.
  - **Custom Splash Screen (`assets/splash-icon.png`):** Branded splash graphic on midnight navy (`#0F172A`) background with central application emblem.
  - **Android Adaptive Icons:**
    - Foreground: `assets/android-icon-foreground.png`
    - Background: `assets/android-icon-background.png`
    - Monochrome: `assets/android-icon-monochrome.png`
  - **Favicon:** `assets/favicon.png`

#### Configuration in `app.json`:
```json
{
  "expo": {
    "name": "MAD Assignment 02",
    "slug": "mad-assignment-02",
    "version": "2.0.0",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0F172A"
    },
    "android": {
      "package": "com.afeef.madassignment02",
      "adaptiveIcon": {
        "backgroundColor": "#0F172A",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      }
    }
  }
}
```

---

### 3. Use Themed Components
- **Requirement:** Replace simple `View` with `ThemedView` and simple `Text` with `ThemedText`. Ensure the newly added screen follows the same structure.
- **Implementation:**
  - **`components/ThemedView.js`:** Responsive container supporting `variant` (`default`, `card`, `surface`, `tabBar`) and custom overrides (`lightColor`, `darkColor`).
  - **`components/ThemedText.js`:** Responsive typography supporting `type` (`title`, `subtitle`, `default`, `defaultSemiBold`, `caption`, `badge`, `link`).
  - **`constants/Colors.js`:** Explicit color tokens for `light` and `dark` modes:
    - Background, Card, Text, Subtext, Tint, TabBarBorder, Badges, and Action Buttons.
  - **`context/ThemeContext.js`:** Global React Context providing dynamic theme state (`themeMode`, `isDark`, `colors`, `setThemeMode`).
  - **All Screens (`HomeScreen`, `ExploreScreen`, `ProfileScreen`)** exclusively utilize `ThemedView` and `ThemedText` for their layouts.

---

## 📁 VS Code Project Structure

```text
my-expo-app/
├── assets/
│   ├── android-icon-background.png   # Custom adaptive background
│   ├── android-icon-foreground.png   # Custom adaptive foreground
│   ├── android-icon-monochrome.png   # Custom adaptive monochrome
│   ├── favicon.png                   # Web favicon
│   ├── icon.png                      # Custom 1024x1024 app icon
│   └── splash-icon.png               # Custom branded splash screen
├── components/
│   ├── ThemedText.js                 # Themed Text component with typography styles
│   └── ThemedView.js                 # Themed View component with card/tabBar variants
├── constants/
│   └── Colors.js                     # Light & Dark color palettes
├── context/
│   └── ThemeContext.js               # Theme state management & useAppTheme hook
├── navigation/
│   └── BottomTabNavigator.js         # Custom Bottom Tab Bar navigation
├── screens/
│   ├── HomeScreen.js                 # Tab 1: Refactored Assignment 01 Screen
│   ├── ExploreScreen.js              # Tab 2: Course Modules & Syllabus
│   └── ProfileScreen.js              # Tab 3: NEW Screen (Student & Theme Settings)
├── App.js                            # Application entry point with ThemeProvider
├── app.json                          # Expo configuration (Splash, Icon, Package)
├── eas.json                          # EAS Build configuration for Android APK
├── package.json                      # Dependencies and scripts
└── README.md                         # Comprehensive documentation with proof
```

---

## 📦 APK Installer & Build Information

The project is pre-configured with EAS Build (`eas.json`) to generate standalone Android APKs:

- **EAS Project ID:** `7a56e7f0-20df-4a57-9505-f4c84cacb955`
- **Build Profile (`preview` in `eas.json`):**
  ```json
  {
    "build": {
      "preview": {
        "distribution": "internal",
        "android": {
          "buildType": "apk"
        }
      }
    }
  }
  ```
- **To build APK via EAS CLI:**
  ```bash
  npx eas-cli build --platform android --profile preview
  ```
- **Expo Project Dashboard:** [https://expo.dev/accounts/afeef-ul-hussain/projects/my-expo-app](https://expo.dev/accounts/afeef-ul-hussain/projects/my-expo-app)

---

## 💻 Local Setup & Testing Guide

### Prerequisites
- Node.js (v18 or higher)
- Expo Go mobile application installed on your iOS or Android device

### Steps to Run:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/afeefulhussain/MAD-Assignment-02.git
   cd MAD-Assignment-02
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on Device:**
   - Scan the terminal QR code using **Expo Go** (Android) or the default Camera app (iOS).
   - Test bottom tab bar switching between **Home**, **Modules**, and **Profile**.
   - Navigate to **Profile** and toggle between **Light**, **Dark**, and **System** themes to verify live themed rendering!

---

## 📝 Submission Checklist Verification

| Requirement | Status | Evidence / Location |
| :--- | :---: | :--- |
| **New Bottom Tab Screen** | ✅ Complete | `screens/ProfileScreen.js` integrated in `navigation/BottomTabNavigator.js` |
| **Custom Splash Screen** | ✅ Complete | `assets/splash-icon.png` registered in `app.json` (`splash` block) |
| **Custom App Icon** | ✅ Complete | `assets/icon.png` & adaptive icons registered in `app.json` |
| **Themed Components** | ✅ Complete | `components/ThemedView.js` & `components/ThemedText.js` across all screens |
| **Extension of Assignment 01** | ✅ Complete | Progressive Git commit history (`85018ed` -> Assignment 02) |
| **Documentation & Proof** | ✅ Complete | Full documentation, code snippets, and configuration breakdown in `README.md` |
