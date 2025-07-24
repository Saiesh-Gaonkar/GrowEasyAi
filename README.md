
# GrowEasyAI

GrowEasyAI is an AI-powered education and career guidance platform designed to empower students in Tier-2 and Tier-3 cities of India. It offers personalized learning, career assessment, and smart job matching using advanced AI technologies.

## 🚀 Features
- **AI-Powered Learning:** Personalized tutoring and recommendations
- **Career Assessment:** AI-driven personality and skills analysis
- **Smart Job Matching:** Intelligent job recommendations based on user profile
- **Interactive Courses:** Engaging modules, quizzes, and hands-on projects
- **Dashboard:** Track progress, enrolled courses, and job applications
- **Admin Panel:** Manage courses, jobs, and users

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **AI Integration:** OpenAI API, Local LLM fallback
- **Authentication:** JWT, Context API

## 📁 Folder Structure
```
project/
├── client/         # Frontend (React)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # App pages (Home, Dashboard, etc.)
│   │   └── index.css     # Global styles
│   ├── index.html        # Frontend entry
│   └── ...
├── server/         # Backend (Node.js/Express)
│   ├── controllers/ # Route controllers
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── utils/       # AI utils, seed data
│   ├── config/      # Database config
│   └── server.js    # Server entry
├── index.html       # App entry (Vite)
├── package.json     # Project metadata
└── ...
```

## ⚡ Quick Start
See `QUICK_START.md` for a 5-minute setup guide.

## 📝 Setup & Usage
1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd groweasyai
   ```
2. **Install dependencies:**
   ```bash
   npm install
   npm run install-all
   ```
3. **Configure environment:**
   - Edit `.env` files in `server/` and `client/` (see `SETUP_GUIDE.md`)
4. **Seed database (optional):**
   ```bash
   cd server
   npm run seed
   ```
5. **Start application:**
   ```bash
   cd ..
   npm run dev
   ```
6. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 👤 Contribution
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
This project is licensed under the MIT License.

---
Empowering students with AI-driven education and career guidance. For help, see `SETUP_GUIDE.md` or contact support@groweasyai.com.
