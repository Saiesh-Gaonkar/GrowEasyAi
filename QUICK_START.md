# 🚀 Quick Start Guide - GrowEasyAI

## Prerequisites Check ✅
Before starting, verify you have:
- [ ] Node.js (v16+) - `node --version`
- [ ] MongoDB (local or Atlas account)
- [ ] Git - `git --version`

## 5-Minute Setup 🏃‍♂️

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd groweasyai
npm install
npm run install-all
```

### 2. Environment Setup
```bash
# Server environment (server/.env already created)
# Client environment (client/.env already created)
# ✅ OpenAI API key already configured!
```

### 3. Database Setup
**Option A - Local MongoDB:**
```bash
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Option B - MongoDB Atlas:**
- Update `MONGODB_URI` in `server/.env` with your Atlas connection string

### 4. Seed Database (Optional)
```bash
cd server
npm run seed
```

### 5. Start Application
```bash
cd ..
npm run dev
```

## 🎉 Access Your App
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🧪 Quick Test
1. Open http://localhost:3000
2. Register a new account
3. Click the chat icon (bottom-right) to test AI
4. Try the AI assessment from dashboard

## 🆘 Common Issues
- **Port in use**: `npx kill-port 5000`
- **MongoDB not running**: Start MongoDB service
- **Module errors**: Delete node_modules, run `npm install`

That's it! Your AI-powered education platform is ready! 🚀