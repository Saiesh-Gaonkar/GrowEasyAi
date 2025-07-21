# 🚀 GrowEasyAI Local Setup Guide

Complete step-by-step instructions to run GrowEasyAI on your local machine.

## 📋 Prerequisites

Before starting, ensure you have these installed on your PC:

### 1. Node.js (Required)
- **Download**: https://nodejs.org/
- **Version**: 16.x or higher
- **Verify installation**:
  ```bash
  node --version
  npm --version
  ```

### 2. MongoDB (Required)
Choose one option:

#### Option A: Local MongoDB Installation
- **Windows**: https://www.mongodb.com/try/download/community
- **macOS**: `brew install mongodb-community`
- **Linux**: Follow MongoDB official docs for your distribution

#### Option B: MongoDB Atlas (Cloud - Recommended for beginners)
- Create free account at https://cloud.mongodb.com/
- Create a new cluster (free tier available)
- Get connection string

### 3. Git (Required)
- **Download**: https://git-scm.com/downloads
- **Verify**: `git --version`

### 4. Code Editor (Recommended)
- **VS Code**: https://code.visualstudio.com/
- Or any editor of your choice

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository
```bash
# Navigate to your desired directory
cd Desktop  # or wherever you want the project

# Clone the repository (replace with actual repo URL)
git clone <your-repository-url>
cd groweasyai
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Go back to root directory
cd ..
```

### Step 3: Database Setup

#### For Local MongoDB:
```bash
# Start MongoDB service
# Windows (run as administrator):
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

#### For MongoDB Atlas:
1. Go to your MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

### Step 4: Environment Configuration

#### Server Environment (.env in server/ directory):
```bash
# Navigate to server directory
cd server

# Create .env file
# Windows:
echo. > .env

# macOS/Linux:
touch .env
```

Add this content to `server/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/groweasyai

# For MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/groweasyai

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# OpenAI Configuration (Your API Key)
OPENAI_API_KEY=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

# AI Configuration
ENABLE_AI=true

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

#### Client Environment (.env in client/ directory):
```bash
# Navigate to client directory
cd ../client

# Create .env file
# Windows:
echo. > .env

# macOS/Linux:
touch .env
```

Add this content to `client/.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### Step 5: Seed Database (Optional but Recommended)
```bash
# Go back to server directory
cd ../server

# Run the seed script to populate sample data
npm run seed
```

This will create:
- Sample courses (Web Development, Data Science, etc.)
- Sample job postings
- Admin user (email: admin@groweasyai.com, password: admin123)

### Step 6: Start the Application

#### Option A: Start Both Servers Concurrently (Recommended)
```bash
# From root directory
cd ..
npm run dev
```

#### Option B: Start Servers Separately
```bash
# Terminal 1 - Start Backend Server
cd server
npm run dev

# Terminal 2 - Start Frontend Server (new terminal)
cd client
npm run dev
```

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🧪 Test the Setup

### 1. Test Backend API
Open browser and go to: http://localhost:5000/api/health
You should see:
```json
{
  "success": true,
  "message": "GrowEasyAI Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Frontend
Open browser and go to: http://localhost:3000
You should see the GrowEasyAI homepage

### 3. Test Database Connection
Check server terminal for:
```
📄 MongoDB Connected: localhost:27017
```

### 4. Test AI Features
1. Register a new account or login with admin credentials
2. Try the AI chat feature (bottom-right chat icon)
3. Take the AI assessment from dashboard

## 🔍 Troubleshooting

### Common Issues and Solutions:

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Ensure MongoDB is running
- Check if MongoDB service is started
- Verify MONGODB_URI in .env file

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
- Kill process using the port: `npx kill-port 5000`
- Or change PORT in server/.env to different number

#### 3. OpenAI API Errors
```
Error: Invalid API key
```
**Solution**:
- Verify OPENAI_API_KEY in server/.env
- Check if API key has sufficient credits
- The app will fallback to static responses if OpenAI fails

#### 4. Module Not Found Errors
```
Error: Cannot find module 'xyz'
```
**Solution**:
- Delete node_modules and package-lock.json
- Run `npm install` again
- Ensure you're in correct directory

#### 5. CORS Errors
```
Access to fetch blocked by CORS policy
```
**Solution**:
- Verify CLIENT_URL in server/.env matches frontend URL
- Restart both servers

## 📱 Development Tips

### 1. Hot Reload
Both servers support hot reload:
- Frontend: Changes reflect immediately
- Backend: Server restarts automatically on file changes

### 2. Database Management
View your data using:
- **MongoDB Compass** (GUI): https://www.mongodb.com/products/compass
- **Command Line**: `mongo` or `mongosh`

### 3. API Testing
Use tools like:
- **Postman**: https://www.postman.com/
- **Thunder Client** (VS Code extension)
- **curl** commands

### 4. Debugging
- Check browser console for frontend errors
- Check terminal output for backend errors
- Use browser dev tools Network tab for API calls

## 🚀 Next Steps

Once everything is running:

1. **Register Account**: Create your first user account
2. **Explore Features**: Try courses, jobs, AI chat
3. **Take Assessment**: Complete the AI career assessment
4. **Customize**: Modify code to add your own features
5. **Deploy**: Follow deployment guides when ready

## 📞 Need Help?

If you encounter issues:
1. Check this troubleshooting guide
2. Verify all prerequisites are installed
3. Ensure all environment variables are set correctly
4. Check that all services (MongoDB, Node.js) are running
5. Look at terminal output for specific error messages

## 🎉 Success!

If you can see the homepage at http://localhost:3000 and the AI chat works, congratulations! Your GrowEasyAI application is running successfully.

Happy coding! 🚀