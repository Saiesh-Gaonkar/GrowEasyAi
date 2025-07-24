#!/bin/bash

echo "🔍 GrowEasyAI Project Health Check"
echo "=================================="

# Check if required files exist
files=(
    "package.json"
    "client/package.json"
    "server/package.json"
    "client/.env"
    "server/.env"
    "README.md"
    "SETUP_GUIDE.md"
    "QUICK_START.md"
)

echo "📁 Checking required files..."
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Check if required directories exist
dirs=(
    "client/src/components"
    "client/src/pages"
    "client/src/context"
    "server/controllers"
    "server/models"
    "server/routes"
    "server/utils"
    "server/config"
    "server/middleware"
)

echo ""
echo "📂 Checking directory structure..."
for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir exists"
    else
        echo "❌ $dir missing"
    fi
done

# Check component files
components=(
    "client/src/components/Navbar.jsx"
    "client/src/components/Footer.jsx"
    "client/src/components/JobCard.jsx"
    "client/src/components/CourseCard.jsx"
    "client/src/components/AITutorChatWindow.jsx"
    "client/src/components/ProtectedRoute.jsx"
    "client/src/components/ResumeBuilder.jsx"
)

echo ""
echo "🧩 Checking components..."
for component in "${components[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $component exists"
    else
        echo "❌ $component missing"
    fi
done

# Check page files
pages=(
    "client/src/pages/HomePage.jsx"
    "client/src/pages/LoginPage.jsx"
    "client/src/pages/RegisterPage.jsx"
    "client/src/pages/DashboardPage.jsx"
    "client/src/pages/CoursesPage.jsx"
    "client/src/pages/CourseDetailPage.jsx"
    "client/src/pages/JobsPage.jsx"
    "client/src/pages/JobDetailPage.jsx"
    "client/src/pages/JobPostPage.jsx"
    "client/src/pages/AIAssessmentPage.jsx"
    "client/src/pages/ProfilePage.jsx"
)

echo ""
echo "📄 Checking pages..."
for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "✅ $page exists"
    else
        echo "❌ $page missing"
    fi
done

# Check server files
server_files=(
    "server/server.js"
    "server/controllers/auth.controller.js"
    "server/controllers/course.controller.js"
    "server/controllers/job.controller.js"
    "server/controllers/ai.controller.js"
    "server/models/User.model.js"
    "server/models/Course.model.js"
    "server/models/JobPosting.model.js"
    "server/models/CareerProfile.model.js"
    "server/routes/auth.routes.js"
    "server/routes/course.routes.js"
    "server/routes/job.routes.js"
    "server/routes/ai.routes.js"
    "server/utils/aiUtils.js"
    "server/utils/seedData.js"
    "server/config/database.js"
    "server/middleware/auth.middleware.js"
)

echo ""
echo "🖥️  Checking server files..."
for file in "${server_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "🎉 Health check complete!"
echo ""
echo "🚀 To start the project:"
echo "1. Install dependencies: npm run install-all"
echo "2. Start development: npm run dev"
echo "3. Access at: http://localhost:3000"
echo ""
echo "📚 For detailed setup, see SETUP_GUIDE.md"
