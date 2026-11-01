# Assignment 02: CRUD Operations, Local Storage & API Integration (React Native)

**Course:** Mobile Application Development  
**Total Marks:** 20  
**Technology Stack:** React Native, Expo SDK 57, `@react-native-async-storage/async-storage`, `axios`

---

## 📋 Table of Contents
1. [Overview & Architecture](#overview--architecture)
2. [Task 1: CRUD Application with Local Storage](#task-1-crud-application-with-local-storage)
   - [Create, Read, Update, Delete Implementation](#crud-implementation)
   - [Local Storage Persistence (`AsyncStorage`)](#local-storage-persistence)
   - [JavaScript Array Methods (`filter`, `find`, `map`, `some`, `every`)](#javascript-array-methods)
3. [Task 2: Free Public API Integration with Axios](#task-2-free-public-api-integration-with-axios)
   - [Endpoint & Configuration](#api-endpoint--configuration)
   - [Request States: Loading, Error, and Success](#api-request-states)
   - [UI Presentation with Cards and Search](#api-ui-presentation)
4. [Project Folder Structure](#project-folder-structure)
5. [LMS Submission Checklist & Screenshot Guide](#lms-submission-checklist)

---

## 1. Overview & Architecture

This application extends the existing mobile application (Assignment 01 Bottom Tab Navigation & Assignment 02 App Icon/Splash Screen) by adding:
1. **Dynamic CRUD Management:** Complete interface to Create, Read, Update, and Delete student records with local persistence (`AsyncStorage`) and live search/filtering using JavaScript array methods.
2. **Public API Integration (`axios`):** External GET request to a public JSON REST API (`https://jsonplaceholder.typicode.com/users`), displaying user/student cards with loading spinners, error handling, pull-to-refresh, and search filters.
3. **Bottom Tab Navigation:** 4 tabs preserving all previous assignment features:
   - 📑 **CRUD App:** Complete student records management.
   - 🌐 **Public API:** Live Axios API directory.
   - 📱 **Swipe Mark:** 60 FPS gesture attendance interface.
   - 📅 **History:** Date-wise attendance logs and WhatsApp reports.

---

## 2. Task 1: CRUD Application with Local Storage

### CRUD Implementation
- **Create Records:** Users can tap the **"+ Add Student"** button to open a modal form with fields: Full Name, Roll Number, Department, Email, Phone, and Status (Active/Inactive).
- **Read Records:** Records are dynamically rendered using React Native `FlatList`, displaying roll badges, department tags, contact info, and status chips.
- **Update Records:** Tapping the **"Edit"** button retrieves the record using `find()`, populates the form modal, allows editing, and saves updates.
- **Delete Records:** Tapping **"Delete"** prompts a confirmation dialog and removes the record using `filter()`.

### Local Storage Persistence (`AsyncStorage`)
- Local storage key: `@crud_students_records_v1`
- Records are loaded from `AsyncStorage.getItem()` when the application opens (`useEffect`).
- Every addition, edit, or deletion immediately saves the updated array to `AsyncStorage.setItem()`, ensuring data persistence across app restarts.

### JavaScript Array Methods Used
| Method | Code Location | Purpose in Assignment |
|---|---|---|
| `filter()` | `src/screens/CrudScreen.js` | Searching across names, roll numbers, departments, and deleting items |
| `find()` | `src/screens/CrudScreen.js` | Locating a specific student record by `id` for editing and details view |
| `map()` | `src/screens/CrudScreen.js` | Rendering department filter pills and updating records immutably |
| `some()` | `src/screens/CrudScreen.js` | Validating duplicate roll numbers (`records.some(...)`) and checking inactive status |
| `every()` | `src/screens/CrudScreen.js` | Verifying if all students are currently active |

---

## 3. Task 2: Free Public API Integration with Axios

### API Endpoint & Configuration
- **Library:** `axios` (v1.21.0)
- **Endpoint:** `https://jsonplaceholder.typicode.com/users`
- **Method:** `axios.get(PUBLIC_API_URL)`

### API Request States
1. **Loading State:** An animated `ActivityIndicator` displays with the message *"Connecting to Public API... Executing axios.get()"*.
2. **Error State:** If the network is disconnected or fails, an error banner is displayed with the exact error message and a **"Retry Request"** button.
3. **Success State:** Displays cards containing name, username, email, phone, company, address, pull-to-refresh, and live search.

---

## 4. Project Folder Structure

```text
attendence app/
├── App.js                         # Root Container with Bottom Tab Navigation
├── app.json                       # Expo configuration (Dark theme & icons)
├── package.json                   # Dependencies (axios, async-storage, expo)
├── src/
│   ├── theme.js                   # Minimalist Slate dark-mode color palette
│   ├── config.js                  # App configuration & storage keys
│   ├── screens/
│   │   ├── CrudScreen.js          # Task 1: Complete CRUD, AsyncStorage & Array Methods
│   │   ├── ApiScreen.js           # Task 2: Public API Integration with Axios GET
│   │   ├── AttendanceScreen.js    # Tinder Swipe Attendance screen
│   │   └── HistoryScreen.js       # Date-wise attendance logs
│   ├── components/
│   │   ├── SwipeCard.js           # 60 FPS Tinder card gesture component
│   │   ├── ProgressCounter.js     # Attendance live counter component
│   │   ├── ActionButtons.js       # Present / Absent / Undo buttons
│   │   └── CompletionCard.js      # Session summary card
│   └── utils/
│       └── whatsapp.js            # WhatsApp report formatter
```

---

## 5. LMS Submission Checklist & Screenshots

Submit the following items on your university LMS portal:

1. **APK Download Link:** Generate via `eas build -p android --profile preview` or export.
2. **GitHub Repository Link:** Push project to GitHub and paste repository URL.
3. **VS Code Folder Structure Screenshot:** Take a screenshot of VS Code showing the expanded project folder tree (`src/screens`, `App.js`, `package.json`).
4. **App Screenshots Required:**
   - **Screenshot 1 (CRUD Main Interface):** `CRUD App` tab showing student list and total counts.
   - **Screenshot 2 (Add / Edit Record):** Modal showing adding a new student or editing existing student.
   - **Screenshot 3 (Search & Filter):** Search bar filtering by student name or department pill.
   - **Screenshot 4 (Local Storage Persistence):** App showing saved students after closing and reopening.
   - **Screenshot 5 (Public API Data):** `Public API` tab displaying live user cards fetched via `axios.get()`.
