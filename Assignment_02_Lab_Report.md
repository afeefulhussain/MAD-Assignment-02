# Lab Report: Assignment 02
## Mobile Application Development
### CRUD Operations, Local Storage & API Integration (React Native)

---

**Course Title:** Mobile Application Development  
**Assignment No:** 02  
**Total Marks:** 20  
**Framework:** React Native (Expo SDK 57)  
**Language:** JavaScript (ES6+)  
**State & Storage:** React Hooks (`useState`, `useEffect`, `useMemo`), `@react-native-async-storage/async-storage`  
**Networking:** `axios`  

---

## 1. Executive Summary & Objective

The primary objective of this project is to extend an existing React Native mobile application by implementing:
1. **Full CRUD Operations (Create, Read, Update, Delete):** Providing an intuitive, dark-mode minimalist user interface to manage student and course records dynamically.
2. **Local Data Persistence:** Ensuring data remains safe and available across app sessions and device restarts utilizing `@react-native-async-storage/async-storage`.
3. **Advanced JavaScript Array Methods:** Leveraging `filter()`, `find()`, `map()`, `some()`, and `every()` for searching, filtering, record retrieval, and validation.
4. **External Public API Integration:** Fetching external JSON resources via HTTP GET requests using `axios` from a free public REST API (`https://jsonplaceholder.typicode.com/users`), with complete request state management (Loading, Error, Success, and Pull-to-Refresh).
5. **Preservation of Existing Features:** Retaining the **Bottom Tab Navigation Bar** (from Assignment 01) and custom icons/splash screens (from Assignment 02).

---

## 2. System Architecture & Folder Structure

```text
attendence app/
├── App.js                         # Root Application with Bottom Tab Navigator
├── app.json                       # Expo configuration & adaptive icon metadata
├── package.json                   # Dependencies (axios, async-storage, react-native-web)
├── src/
│   ├── theme.js                   # Minimalist Slate-900 dark-mode theme tokens
│   ├── config.js                  # Application constants & storage key definitions
│   ├── api.js                     # Offline-first API cache & storage synchronization
│   ├── screens/
│   │   ├── CrudScreen.js          # Task 1: Complete CRUD + AsyncStorage + Array Methods
│   │   ├── ApiScreen.js           # Task 2: Public API (Axios GET) Directory Screen
│   │   ├── AttendanceScreen.js    # Tinder-style Gesture Attendance Interface
│   │   ├── CoursesScreen.js       # Subject & Roster Management
│   │   ├── HistoryScreen.js       # Date-wise logs and WhatsApp dispatching
│   │   └── SettingsScreen.js      # Server diagnostics and network settings
│   ├── components/
│   │   ├── SwipeCard.js           # 60 FPS animated card with PanResponder
│   │   ├── ProgressCounter.js     # Attendance evaluation progress meter
│   │   ├── ActionButtons.js       # Quick action triggers (Present, Absent, Undo)
│   │   └── CompletionCard.js      # Session KPI breakdown & WhatsApp trigger
│   └── utils/
│       └── whatsapp.js            # Automated report formatter & wa.me deep-linker
├── README.md                      # Architecture documentation
├── ASSIGNMENT_02_SUBMISSION.md    # LMS submission guide & screenshot checklist
└── Assignment_02_Lab_Report.md    # Formal assignment lab report
```

---

## 3. Task 1: CRUD Application Implementation

### 3.1. CRUD Operations Breakdown

#### 1. Create Record (C)
- Users tap the **"+ Add Student"** button to trigger a modal form.
- Inputs: Roll Number, Student Full Name, Department / Program, Email, Phone, and Status (Active / Inactive).
- **Validation:** Uses `Array.some()` to verify all required fields and prevent duplicate roll numbers before saving.
- Once submitted, the record is prepended to the array of objects and committed to `AsyncStorage`.

#### 2. Read Records (R)
- Records are rendered dynamically via React Native `FlatList`.
- Each record item is displayed inside a custom card styled with elevated dark slate backgrounds (`#172235`), roll badges, department tags, contact details, and dynamic status indicators.

#### 3. Update Record (U)
- Tapping **"Edit"** on any student card locates the exact object via `Array.find()`.
- The form modal opens pre-filled with the existing values.
- On saving, `Array.map()` updates the specific item immutably and synchronizes the change to `AsyncStorage`.

#### 4. Delete Record (D)
- Tapping **"Delete"** prompts a confirmation alert displaying the student's name and roll number.
- On confirmation, `Array.filter()` removes the target record, and the updated array is saved to `AsyncStorage`.

### 3.2. Local Storage Persistence (`AsyncStorage`)
- **Key:** `@crud_students_records_v1`
- **Retrieval:** `AsyncStorage.getItem()` is executed on component mount (`useEffect`). If existing records are found, state is initialized; otherwise, sample demo records are seeded.
- **Persistence:** On every Create, Update, or Delete operation, `AsyncStorage.setItem()` writes the serialized JSON string immediately. Closing and reopening the app retains all data.

### 3.3. JavaScript Array Methods

| Array Method | Code Usage | Purpose |
|---|---|---|
| `filter()` | `records.filter(r => r.id !== id)` | Removes records during deletion; dynamically filters records by search keyword, department, and status. |
| `find()` | `records.find(r => r.id === targetId)` | Locates specific student object when opening the Edit Modal or Details Modal. |
| `map()` | `records.map(r => r.id === id ? updated : r)` | Performs immutable record updates; maps department pills and KPI summary cards. |
| `some()` | `records.some(r => r.rollNo === inputRoll)` | Enforces unique roll number constraint; detects presence of inactive students. |
| `every()` | `records.every(r => r.status === 'Active')` | Evaluates if the entire student roster is in Active status for reporting. |

---

## 4. Task 2: Free Public API Integration with Axios

### 4.1. Endpoint Selection
- **API Provider:** JSONPlaceholder (Public REST API)
- **Endpoint:** `https://jsonplaceholder.typicode.com/users`
- **Method:** HTTP `GET`
- **Data Returned:** User ID, Name, Username, Email, Address, Phone, Website, and Company details.

### 4.2. Axios Implementation
```javascript
import axios from 'axios';

const fetchApiData = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users', {
      timeout: 6000,
      headers: { Accept: 'application/json' },
    });
    setData(response.data);
  } catch (err) {
    setError(err.message || 'Failed to connect to Public API.');
  } finally {
    setLoading(false);
  }
};
```

### 4.3. Request State Handling
1. **Loading State:** Displays an animated `ActivityIndicator` centered on screen with clear messaging: *"Connecting to Public API... Executing axios.get()"*.
2. **Error State:** If network access fails or times out, a rose-bordered error banner displays the error text alongside a **"Retry Request"** button.
3. **Success State:** Displays a list of user cards with avatars, company tags, direct contact info, pull-to-refresh (`RefreshControl`), and real-time search.

---

## 5. UI/UX Design & Components

- **Theme:** Modern Minimalist Dark Slate (`#0B0F17` background, `#172235` cards, `#6366F1` indigo accents, `#10B981` emerald present, `#F43F5E` rose red absent).
- **Core React Native Components Utilized:**
  - `View`, `SafeAreaView`, `StatusBar` for responsive structure.
  - `Text` with strict typographic hierarchy.
  - `TextInput` for searching and form inputs.
  - `Pressable` for tactile touch feedback on buttons and cards.
  - `FlatList` with optimized windowing for high performance.
  - `Modal` for bottom sheets and popup dialogs.
  - `RefreshControl` for pull-to-refresh data reloading.

---

## 6. Git Push & LMS Submission Steps

### 6.1. Push Project to GitHub
All files have been committed to local Git. To push to your university GitHub repository:

```bash
# 1. Add your GitHub repository remote (replace with your repo URL):
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 2. Rename branch to main if needed:
git branch -M main

# 3. Push all code:
git push -u origin main
```

### 6.2. LMS Submission Checklist
- [x] **APK Download Link:** Upload generated APK to Google Drive / OneDrive and submit link.
- [x] **GitHub Repository Link:** Submit link to the public GitHub repository.
- [x] **VS Code Folder Structure Screenshot:** Capture the expanded project tree in VS Code.
- [x] **App Screenshots:**
  - CRUD interface with student list
  - Add / Edit student form modal
  - Search & filter functionality active
  - Local storage data persistence (after app restart)
  - Public API live data cards via Axios GET
