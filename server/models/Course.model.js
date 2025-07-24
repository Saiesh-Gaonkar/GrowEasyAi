import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['Programming', 'Data Science', 'Digital Marketing', 'Design', 'Business', 'Language', 'Other']
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  duration: {
    type: String,
    required: true // e.g., "4 weeks", "2 months"
  },
  modules: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    content: String,
    videoUrl: String,
    duration: String, // e.g., "45 minutes"
    order: {
      type: Number,
      required: true
    },
    quiz: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }]
  }],
  skills: [String], // Skills taught in this course
  prerequisites: [String],
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  instructor: {
    name: {
      type: String,
      required: true
    },
    bio: String,
    avatar: {
      type: String,
      default: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=150'
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5
    }
  },
  thumbnail: {
    type: String,
    default: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?w=400'
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFree: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'English'
  }
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);