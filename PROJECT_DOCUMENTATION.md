# GrowEasyAI Project Documentation

## 1. Project Overview
GrowEasyAI is an AI-powered learning and career guidance platform designed for students in Tier-2 and Tier-3 cities in India. It provides personalized learning, career assessments, job recommendations, and language translation (Hindi/Marathi) to make global learning accessible to rural students.

## 2. Technology Stack & Architecture
- **Frontend:** React (Vite, Tailwind CSS)
- **Backend:** Node.js (Express, ES6 modules)
- **Database:** MongoDB (Mongoose ODM)
- **AI Integration:** OpenAI API (with local fallback)
- **Translation:** LibreTranslate API (Hindi/Marathi)
- **Authentication:** JWT, role-based access (student, admin, employer)

## 3. Backend Modules
### Controllers
- **ai.controller.js:** Handles AI chat, career assessment, recommendations, insights, and profile endpoints. Integrates OpenAI/local AI and translation utilities.
- **auth.controller.js:** Manages user registration, login, and authentication.
- **course.controller.js:** CRUD for courses, course recommendations.
- **job.controller.js:** CRUD for job postings and job recommendations.

### Models
- **User.model.js:** User schema with profile, assessment results, roles.
- **CareerProfile.model.js:** Stores career assessment, AI recommendations, completion status.
- **Course.model.js:** Course details, skills, category, rating, etc.
- **JobPosting.model.js:** Job details, employer info, requirements.

### Middleware
- **auth.middleware.js:** JWT authentication, role-based access control.

### Utilities
- **aiUtils.js:** AI response, career analysis, learning/job recommendations, OpenAI/local model selection.
- **translate.js:** LibreTranslate API utility for Hindi/Marathi translation.
- **seedData.js:** Seeds initial data for development/testing.

### Routes
- **ai.routes.js:** `/api/ai/*` endpoints for chat, assessment, recommendations, profile, insights.
- **auth.routes.js:** `/api/auth/*` endpoints for user management.
- **course.routes.js:** `/api/courses/*` endpoints for course management.
- **job.routes.js:** `/api/jobs/*` endpoints for job management.

### Config
- **database.js:** MongoDB connection setup.

## 4. Frontend Modules
### Main Components
- **App.jsx:** Main app shell, routing.
- **Navbar.jsx, Footer.jsx:** Navigation and footer UI.
- **CourseCard.jsx, JobCard.jsx:** Display course/job info.
- **ResumeBuilder.jsx:** Resume creation tool.
- **AITutorChatWindow.jsx:** AI chat interface with translation dropdown.
- **ProtectedRoute.jsx:** Route protection for authenticated users.

### Context
- **AuthContext.jsx:** Manages user authentication state and profile.

### Pages
- **HomePage.jsx:** Landing page.
- **CoursesPage.jsx:** Lists all free courses, supports translation.
- **CourseDetailPage.jsx:** Course details, translation dropdown.
- **JobsPage.jsx:** Job listings.
- **JobDetailPage.jsx:** Job details.
- **JobPostPage.jsx:** Employer job posting form.
- **DashboardPage.jsx:** User dashboard.
- **ProfilePage.jsx:** User profile and assessment results.
- **AIAssessmentPage.jsx:** Career assessment form, translation support.
- **RegisterPage.jsx, LoginPage.jsx:** Auth forms.

### Styles
- **index.css:** Global styles (Tailwind).

## 5. AI & Personalization Features
- **AI Tutor Chat:** Personalized responses using user profile/context, OpenAI/local fallback, translation support.
- **Career Assessment:** AI-driven analysis of personality, skills, interests, career goals; stores results and recommendations.
- **Career Recommendations:** Suggests careers and courses based on assessment.
- **Personalized Insights:** Learning and job recommendations tailored to user profile and goals.
- **Quiz Generator:** (Planned) AI-generated quizzes based on student performance and learning gaps.

## 6. Language Translation
- **LibreTranslate API:** Used for translating course, assessment, and chat content to Hindi/Marathi.
- **Frontend Integration:** Dropdowns/buttons on CoursesPage, CourseDetailPage, AIAssessmentPage, and AITutorChatWindow for language selection and translation.
- **Backend Utility:** `translate.js` handles API calls and error handling.

## 7. API Endpoints
- **POST /api/ai/chat:** AI tutor chat (personalized, translatable)
- **POST /api/ai/assessment:** Submit career assessment
- **GET /api/ai/recommendations:** Get career/course recommendations
- **GET /api/ai/profile:** Get career profile
- **GET /api/ai/insights:** Get personalized learning/job insights
- **Auth, course, job endpoints:** Standard CRUD and user management

## 8. Setup & Deployment
- **Install dependencies:** `npm install` in root, client, and server folders
- **Run dev servers:** `npm run dev` (concurrently starts client/server)
- **Environment:** Requires MongoDB, OpenAI API key (optional), LibreTranslate API key (for live translation)
- **Health Check:** `health-check.sh` script for validation

## 9. Known Issues & Future Plans
- **MongoDB connection:** Ensure MongoDB is installed and running
- **Quiz Generator:** To be implemented (requires user performance data)
- **Personalization:** Further enhancements planned as more user data is provided
- **Translation:** Awaiting LibreTranslate API key for live translation

## 10. Change Log & Completion
- ES6 module conversion for backend
- All missing pages/components implemented
- Course pricing removed (all courses free)
- AI/translation features integrated
- Health check and completion scripts added

---

For further details, see the README.md and individual module documentation.
