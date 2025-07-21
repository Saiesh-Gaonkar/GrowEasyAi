# GrowEasyAI - AI-Powered Education & Career Platform

An intelligent education and career guidance platform specifically designed for students in Tier-2 and Tier-3 cities of India. Features local AI tutoring, personalized career assessments, and smart job matching.

## 🚀 Features

- **AI-Powered Learning**: Local LLM integration for instant learning assistance
- **Career Assessment**: Intelligent personality and skills assessment with AI analysis
- **Smart Job Matching**: Location and skills-based job recommendations
- **Mobile-First Design**: Optimized for low-bandwidth connections
- **Real-time Chat**: AI tutor for instant doubt resolution
- **Progress Tracking**: Course completion and learning analytics

## 🛠 Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Context API, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **AI Integration**: node-llama-cpp for local LLM processing
- **Authentication**: JWT-based secure authentication
- **Database**: MongoDB with comprehensive schemas

## 📁 Project Structure

```
groweasyai/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API state management
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Additional styles
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── package.json
│   └── server.js
├── package.json          # Root package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd groweasyai
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install-all
```

### Step 3: Environment Configuration

Create `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/groweasyai
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/groweasyai

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# AI Configuration
OPENAI_API_KEY=your-openai-api-key-here
ENABLE_AI=true

# Local LLM Configuration (Optional - fallback when OpenAI is unavailable)
LLM_MODEL_PATH=./models/llama-model.gguf
```

Create `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: AI Configuration

#### Option 1: OpenAI API (Recommended)
1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Add it to your server `.env` file as `OPENAI_API_KEY`
3. The application will use OpenAI's GPT models for enhanced AI responses

#### Option 2: Local LLM Model Setup (Optional Fallback)

1. Create a `models/` directory in the `server/` folder
2. Download a compatible GGUF model (recommended: Llama-2-7B-Chat-GGUF)
3. Place the model file in `server/models/llama-model.gguf`
4. Update the `LLM_MODEL_PATH` in your server `.env` file

**Note**: The application will automatically fall back to local LLM if OpenAI is unavailable, and to static responses if both fail.

### Step 5: Database Setup

For local MongoDB:
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb  # macOS
```

For MongoDB Atlas:
1. Create a cluster at https://cloud.mongodb.com
2. Update `MONGODB_URI` in server `.env`

### Step 6: Start Development Servers

```bash
# Start both client and server concurrently
npm run dev
```

Or start them separately:

```bash
# Terminal 1: Start server (http://localhost:5000)
npm run server

# Terminal 2: Start client (http://localhost:3000)
npm run client
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course
- `POST /api/courses/enroll/:id` - Enroll in course (protected)

### Jobs
- `GET /api/jobs` - Get job listings
- `GET /api/jobs/search` - Search jobs by skills/location
- `POST /api/jobs/apply/:id` - Apply for job (protected)

### AI Features
- `POST /api/ai/chat` - Chat with AI tutor (protected)
- `POST /api/ai/assess` - Career assessment analysis (protected)
- `GET /api/ai/recommendations` - Get career recommendations (protected)

## 🚀 Production Deployment

### Build for Production

```bash
# Build client for production
cd client && npm run build
```

### Environment Variables for Production

Update server `.env` for production:
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
```

## 🔍 Key Features Explained

### Enhanced AI Integration
- **Primary**: OpenAI GPT models for sophisticated natural language processing
- **Fallback**: Local LLM using node-llama-cpp for offline processing
- **Backup**: Static responses ensure the app always works
- Advanced career analysis and personalized recommendations
- Context-aware tutoring with memory of user profile

### Local AI Integration
- Optional local processing using node-llama-cpp
- Fallback system ensures reliability
- Privacy-focused options available

### Mobile-First Design
- Responsive design optimized for mobile devices
- Progressive Web App (PWA) capabilities
- Optimized for low-bandwidth connections

### Career Assessment
- Multi-dimensional personality and skills assessment
- Advanced AI-powered career path recommendations using OpenAI
- Detailed insights and growth suggestions
- Personalized learning path generation
- Job market analysis specific to Indian cities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@groweasyai.com
- Documentation: https://docs.groweasyai.com
- Issues: Open a GitHub issue

## 🙏 Acknowledgments

- Built for empowering students in Tier-2 and Tier-3 cities of India
- Inspired by the need for accessible, AI-powered education
- Thanks to the open-source community for amazing tools and libraries