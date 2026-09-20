# ⌨️ TypeMaster

> A full-stack typing speed test platform built with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB Atlas.

🌐 **Live Demo:** https://typemaster-frontend-cpk7.onrender.com/

---

## 📌 Overview

**TypeMaster** is a full-stack web application designed to help users improve and measure their typing speed and accuracy.

Users can take timed typing tests, track their performance, view statistics, compete on a leaderboard, unlock achievements, manage their profile, and more.

The application also includes an **Admin Panel** that allows administrators to manage the typing paragraphs used in the tests.

The project started as a frontend/local-storage typing game and was extended into a complete full-stack application with authentication, MongoDB persistence, REST APIs, achievements, leaderboard functionality, and cloud deployment.

---

## 🚀 Live Application

### Frontend

🌐 https://typemaster-frontend-cpk7.onrender.com/

### Backend API

🌐 https://typemaster-backend-12gu.onrender.com/

The frontend communicates with the backend through REST APIs.

---

## ✨ Features

### 👤 User Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- Role-based access control
- User and Admin roles

### ⌨️ Typing Test

- Timed typing tests
- 15-second mode
- 30-second mode
- 60-second mode
- Easy difficulty
- Medium difficulty
- Hard difficulty
- Real-time typing feedback
- WPM calculation
- Accuracy calculation
- Mistake tracking
- Character counting
- Restart test functionality
- Personal best tracking

### 📊 Statistics

Users can view:

- Best WPM
- Average WPM
- Average accuracy
- Total tests completed
- Total characters typed
- Total mistakes
- Recent test history
- Performance charts

### 🏆 Leaderboard

The leaderboard provides performance rankings based on:

- Best WPM
- Average WPM
- Average accuracy
- Tests completed
- Total characters typed
- Total mistakes

### 🥇 Achievements

TypeMaster includes achievements based on typing performance.

Current achievements include:

| Achievement | Requirement |
|---|---|
| First Steps | Complete your first typing test |
| Getting Faster | Reach 40 WPM |
| Speed Runner | Reach 60 WPM |
| Fast Fingers | Reach 80 WPM |
| Speed Demon | Reach 100 WPM |
| Sharpshooter | Achieve 100% accuracy |
| Dedicated Typist | Complete 10 typing tests |
| Typing Veteran | Complete 25 typing tests |

Achievements are stored in MongoDB and associated with individual users.

### 👤 Profile Management

Users can:

- View profile information
- Update profile information
- Change password
- Clear typing history
- Delete account

### 🔐 Admin Panel

Administrators can manage typing paragraphs.

Admin functionality includes:

- Add paragraphs
- Edit paragraphs
- Delete paragraphs
- Filter paragraphs by difficulty
- View paragraph statistics
- Manage Easy, Medium, and Hard paragraphs

Only authenticated users with the `admin` role can access protected paragraph-management operations.

### 📝 Dynamic Paragraph System

Typing paragraphs are stored in MongoDB instead of being hard-coded in the frontend.

The typing test retrieves paragraphs from the backend based on the selected difficulty.

This allows administrators to update the available typing content without modifying the frontend source code.

### 🌙 UI Features

- Responsive design
- Dark/light theme support
- Mobile-friendly interface
- TypeMaster branding and logo
- Responsive navigation
- Modern card-based UI
- Interactive typing interface

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.7
- Bootstrap Icons
- Google Fonts
- Chart.js
- LocalStorage

## Backend

- Node.js
- Express.js
- MongoDB
- MongoDB Node.js Driver
- JWT
- bcryptjs
- CORS
- dotenv

## Database

- MongoDB Atlas

## Deployment

- GitHub
- Render Static Site
- Render Web Service
- MongoDB Atlas

---

# 🏗️ Project Architecture

```text
TypeMaster
│
├── frontend/
│   ├── index.html
│   ├── test.html
│   ├── statistics.html
│   ├── leaderboard.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── achievements.html
│   ├── admin-paragraphs.html
│
│   ├── css/
│   │   ├── style.css
│   │   ├── test.css
│   │   ├── statistics.css
│   │   ├── auth.css
│   │   ├── profile.css
│   │   ├── leaderboard.css
│   │   ├── achievements.css
│   │   └── admin-paragraphs.css
│
│   ├── js/
│   │   ├── main.js
│   │   ├── typing.js
│   │   ├── statistics.js
│   │   ├── leaderboard.js
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── achievements.js
│   │   ├── admin-paragraphs.js
│   │   └── config.js
│
│   └── assets/
│       └── typemaster-logo.png
│
├── backend/
│   ├── server.js
│   ├── package.json
│
│   ├── config/
│   │   └── database.js
│
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── testController.js
│   │   ├── userController.js
│   │   ├── leaderboardController.js
│   │   ├── achievementController.js
│   │   └── paragraphController.js
│
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tests.js
│   │   ├── users.js
│   │   ├── leaderboard.js
│   │   ├── achievements.js
│   │   └── paragraphs.js
│
│   └── middleware/
│       ├── authMiddleware.js
│       └── adminMiddleware.js
│
├── database/
│
├── .gitignore
├── README.md
└── package files
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
TypeMaster Frontend
 │
 │ HTTPS REST API
 ▼
Express.js Backend
 │
 ├── Authentication
 ├── Typing Results
 ├── Statistics
 ├── Leaderboard
 ├── Achievements
 ├── Profile Management
 └── Paragraph Management
 │
 ▼
MongoDB Atlas
```

---

# 🔐 Authentication Flow

```text
Register
   ↓
Password hashed using bcrypt
   ↓
User stored in MongoDB
   ↓
Login
   ↓
JWT generated
   ↓
JWT stored on frontend
   ↓
Protected API requests
   ↓
Backend validates JWT
```

JWT payload contains information such as:

```text
userId
username
email
role
```

---

# 🗄️ Database Collections

The application uses MongoDB Atlas with the following major collections:

### Users

Stores:

- User ID
- Username
- Email
- Password hash
- Role
- User information

### Typing Results

Stores:

- User ID
- WPM
- Accuracy
- Mistakes
- Characters
- Difficulty
- Test duration
- Creation date

### Paragraphs

Stores:

- Paragraph text
- Difficulty
- Creation date
- Updated date

### User Achievements

Stores:

- User ID
- Achievement ID
- Unlock date

---

# 🔌 API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Typing Tests

```text
POST /api/tests
GET  /api/tests
DELETE /api/tests/history
```

## Users

```text
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/password
DELETE /api/users/account
```

## Leaderboard

```text
GET /api/leaderboard
```

## Achievements

```text
GET /api/achievements
```

## Paragraphs

```text
GET    /api/paragraphs
POST   /api/paragraphs
PUT    /api/paragraphs/:id
DELETE /api/paragraphs/:id
```

Paragraph creation, modification, and deletion require authentication and Admin privileges.

---

# ⚙️ Local Installation

## 1. Clone the Repository

```bash
git clone https://github.com/avishkardalavi/TypeMaster.git
```

Move into the project:

```bash
cd TypeMaster
```

---

# 🖥️ Backend Setup

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
MONGODB_DATABASE=typemaster
JWT_SECRET=YOUR_JWT_SECRET
```

Do not commit `.env` to GitHub.

Start the backend:

```bash
npm start
```

For development:

```bash
npm run dev
```

The backend will run locally at:

```text
http://localhost:5000
```

---

# 🌐 Frontend Setup

The frontend is a static HTML/CSS/JavaScript application.

The API configuration is stored in:

```text
frontend/js/config.js
```

Production configuration:

```javascript
window.API_BASE_URL =
  "https://typemaster-backend-12gu.onrender.com/api";
```

For local backend development:

```javascript
window.API_BASE_URL =
  "http://localhost:5000/api";
```

Open `frontend/index.html` using a local web server.

---

# 🚀 Deployment

## Backend

The backend is deployed using:

**Render Web Service**

Production API:

```text
https://typemaster-backend-12gu.onrender.com/
```

## Frontend

The frontend is deployed using:

**Render Static Site**

Production website:

```text
https://typemaster-frontend-cpk7.onrender.com/
```

## Database

The production database is hosted on:

**MongoDB Atlas**

---

# 🔒 Security

The project uses several security measures:

- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- Role-based authorization
- Admin middleware
- Environment variables for secrets
- MongoDB Atlas network access controls
- `.env` excluded from Git
- `node_modules` excluded from Git

### Important

Never commit:

```text
.env
```

or expose:

```text
MONGODB_URI
JWT_SECRET
```

in the repository.

---

# 📈 Future Improvements

Possible future enhancements include:

- Real-time multiplayer typing competitions
- More typing languages
- Custom user-created tests
- Daily typing challenges
- Global user rankings
- Friend system
- Advanced performance analytics
- Typing heatmaps
- More achievements
- Email verification
- Password reset
- Social login
- Custom themes
- PWA/mobile support
- Docker deployment
- Automated testing
- CI/CD pipeline

---

# 📄 License

This project is developed for educational and project purposes.

You may modify and extend the project according to your requirements.

---

# 👨‍💻 Developer

**Avishkar Dalavi**

Computer Engineering

TypeMaster — Full-Stack Typing Speed Platform

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**GitHub Repository:**

https://github.com/avishkardalavi/TypeMaster

**Live Website:**

https://typemaster-frontend-cpk7.onrender.com/
