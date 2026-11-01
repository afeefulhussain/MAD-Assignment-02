# Smart Attendance Full-Stack Application 📱⚡

A modern, full-stack smart attendance application featuring a **React Native (Expo)** mobile application with a **Tinder-style swipe interface** and a **Node.js + Express + MongoDB** backend server with direct **WhatsApp report dispatching**.

---

## 🏗️ Architecture & Tech Stack

```
┌────────────────────────────────────────┐
│     Mobile App Frontend (Expo/RN)      │
│  - Slate-900 Minimalist Dark Mode      │
│  - 60 FPS Animated + PanResponder Deck │
│  - Direct wa.me WhatsApp Integration   │
│  - AsyncStorage Offline Fallback Store │
└──────────────────┬─────────────────────┘
                   │ REST API
┌──────────────────▼─────────────────────┐
│    Backend Server (Node.js/Express)    │
│  - RESTful API Endpoints               │
│  - MongoDB (Mongoose) with Fallback    │
│  - CORS & Morgan Request Logging       │
└────────────────────────────────────────┘
```

- **Frontend**: React Native with Expo SDK 57, `@expo/vector-icons`, `@react-native-async-storage/async-storage`.
- **Backend**: Node.js, Express.js 4.x, Mongoose (MongoDB ODM), dotenv, cors, morgan.
- **Swipe Physics**: React Native `PanResponder` and `Animated` (smooth 60fps interpolation of swipe rotation, velocity, and dynamic stamps).
- **Messaging**: Automated formatting of student-by-student reports and dispatching via WhatsApp deep link (`wa.me/<phone>?text=<encoded_report>`).

---

## 📂 Project Directory Structure

```text
attendence app/
├── App.js                         # Root container with dark slate navigation bar
├── app.json                       # Expo application metadata & theme config
├── package.json                   # Mobile dependencies & run scripts
├── src/
│   ├── theme.js                   # Slate-900 color tokens & glow shadows
│   ├── config.js                  # API host config & AsyncStorage keys
│   ├── api.js                     # HTTP client + automatic offline fallback
│   ├── components/
│   │   ├── SwipeCard.js           # 60 FPS Tinder card with PRESENT/ABSENT stamps
│   │   ├── ProgressCounter.js     # Live counter & animated progress bar
│   │   ├── ActionButtons.js       # Absent (Red), Undo, Present (Green) buttons
│   │   └── CompletionCard.js      # Session KPI breakdown & "Save & Send" button
│   ├── screens/
│   │   ├── AttendanceScreen.js    # The Tinder swipe attendance workflow
│   │   ├── CoursesScreen.js       # Course, Teacher & Student roster management
│   │   ├── HistoryScreen.js       # Date-wise logs, percentages & search modal
│   │   └── SettingsScreen.js      # Server status, ping check & endpoint picker
│   └── utils/
│       └── whatsapp.js            # WhatsApp message formatter & URL deep linker
└── backend/
    ├── package.json               # Backend dependencies
    ├── .env.example               # Environment variables template
    ├── .env                       # Local server configuration
    └── src/
        ├── config/
        │   └── db.js              # MongoDB connection & offline fallback status
        ├── models/
        │   ├── Course.js          # Subject, Teacher & Student roster schema
        │   └── Attendance.js      # Date-wise attendance session & summary schema
        ├── controllers/
        │   ├── courseController.js       # CRUD operations for courses & students
        │   └── attendanceController.js   # Save session, history queries & stats
        ├── routes/
        │   ├── courseRoutes.js           # /api/courses
        │   └── attendanceRoutes.js       # /api/attendance
        ├── seeds/
        │   └── seedData.js        # Sample courses & attendance seeder
        └── server.js              # Express app bootstrap & error handler
```

---

## 🗄️ Database Schemas (MongoDB)

### 1. Course Schema (`backend/src/models/Course.js`)
```javascript
{
  name: { type: String, required: true },               // e.g. "Distributed Systems"
  code: { type: String, default: '' },                  // e.g. "CS-401"
  teacherName: { type: String, required: true },        // e.g. "Dr. Tariq Mahmood"
  teacherWhatsApp: { type: String, required: true },    // e.g. "+923001234567"
  color: { type: String, default: '#6366F1' },
  students: [
    {
      rollNo: { type: String, required: true },         // e.g. "01"
      name: { type: String, required: true },           // e.g. "Ali Ahmed"
      email: { type: String, default: '' }
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Attendance Schema (`backend/src/models/Attendance.js`)
```javascript
{
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  courseName: { type: String, required: true },
  teacherName: { type: String, default: '' },
  teacherWhatsApp: { type: String, default: '' },
  date: { type: String, required: true },               // Format: "YYYY-MM-DD"
  timestamp: { type: Date, default: Date.now },
  records: [
    {
      studentId: { type: String, required: true },
      rollNo: { type: String, required: true },
      name: { type: String, required: true },
      status: { type: String, enum: ['PRESENT', 'ABSENT'] }
    }
  ],
  summary: {
    total: Number,
    presentCount: Number,
    absentCount: Number,
    percentage: Number
  },
  notes: { type: String, default: '' },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 Backend REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check & MongoDB connection status |
| `GET` | `/api/courses` | List all courses with teacher details & enrolled students |
| `POST` | `/api/courses` | Create a new course with teacher contact & student roster |
| `GET` | `/api/courses/:id` | Fetch a single course by ID |
| `PUT` | `/api/courses/:id` | Update a course or student roster |
| `DELETE` | `/api/courses/:id` | Delete a course |
| `POST` | `/api/attendance` | Record an attendance session (computes summary & percentages) |
| `GET` | `/api/attendance` | Query attendance logs (filters: `?courseId=...&date=...`) |
| `GET` | `/api/attendance/:id` | Fetch single attendance session details |
| `DELETE` | `/api/attendance/:id` | Remove an attendance log |

---

## 🚀 Running the Project

### 1. Start the Backend Server
```bash
# Navigate to the backend directory
cd backend

# Install dependencies (already completed)
npm install

# Start the server
npm start
# Or for live hot-reload development:
npm run dev
```
> The server listens on `http://localhost:5000` (or `http://10.0.2.2:5000` from Android Emulator).
> If MongoDB is not running locally, the server continues gracefully with built-in memory fallback and sample seed records!

### 2. Start the Mobile App
```bash
# In the root workspace directory
npx expo start
```
- Press `a` to open in Android Emulator / Device.
- Press `w` to open in Web browser.
- Scan the QR code using the **Expo Go** app on your physical Android/iOS phone.

---

## 📲 Direct WhatsApp Integration Details

When an attendance session concludes, clicking **"Save & Send to Teacher"**:
1. Saves the attendance record to MongoDB / offline AsyncStorage.
2. Strips formatting characters from the teacher's phone number into international E.164 format.
3. Automatically opens WhatsApp using the official deep link:
   ```
   https://wa.me/<teacher_number>?text=<encoded_report>
   ```
4. Generates a formatted report:
   ```text
   📋 *SMART ATTENDANCE REPORT*
   ━━━━━━━━━━━━━━━━━━━━━
   📚 *Subject:* Advanced Mobile Application Development (CS-401)
   👨‍🏫 *Teacher:* Dr. Tariq Mahmood
   📅 *Date:* Wednesday, Oct 21, 2026
   👥 *Total Students:* 10
   ✅ *Present:* 9 (90%)
   ❌ *Absent:* 1 (10%)
   ━━━━━━━━━━━━━━━━━━━━━

   ✅ *PRESENT STUDENTS (9):*
    • [01] Ali Ahmed
    • [02] Fatima Zahra
    • [03] Muhammad Bilal
    • [05] Hamza Tariq
    • [06] Zainab Bibi
    • [07] Usman Ghani
    • [08] Sara Khan
    • [09] Zayan Malik
    • [10] Haniya Imran

   ❌ *ABSENT STUDENTS (1):*
    • [04] Ayesha Noor

   _Report generated via Smart Attendance App_
   ```
