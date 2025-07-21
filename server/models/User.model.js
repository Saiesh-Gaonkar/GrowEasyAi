const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  profile: {
    age: {
      type: Number,
      min: 13,
      max: 100
    },
    location: {
      city: String,
      state: String,
      country: { type: String, default: 'India' }
    },
    education: {
      level: {
        type: String,
        enum: ['High School', 'Diploma', 'Undergraduate', 'Graduate', 'Postgraduate'],
        default: 'High School'
      },
      field: String,
      institution: String
    },
    skills: [String],
    interests: [String],
    experience: {
      type: String,
      enum: ['Fresher', '0-1 years', '1-2 years', '2-5 years', '5+ years'],
      default: 'Fresher'
    },
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please add a valid Indian phone number']
    },
    avatar: {
      type: String,
      default: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150'
    }
  },
  enrolledCourses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedModules: [Number]
  }],
  appliedJobs: [{
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Selected'],
      default: 'Applied'
    }
  }],
  assessmentResults: {
    personalityType: String,
    strengths: [String],
    improvements: [String],
    careerMatches: [{
      career: String,
      matchPercentage: Number,
      description: String
    }],
    completedAt: Date
  },
  isEmailVerified: {
    type: Boolean,
    default: true // Simplified for demo
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);