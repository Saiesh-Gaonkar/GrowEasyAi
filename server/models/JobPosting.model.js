const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: 100
  },
  company: {
    name: {
      type: String,
      required: [true, 'Please add company name']
    },
    logo: {
      type: String,
      default: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?w=150'
    },
    website: String,
    about: String
  },
  description: {
    type: String,
    required: [true, 'Please add job description'],
    maxlength: 2000
  },
  requirements: [String],
  responsibilities: [String],
  requiredSkills: [{
    type: String,
    required: true
  }],
  preferredSkills: [String],
  location: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    },
    isRemote: {
      type: Boolean,
      default: false
    },
    workType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time'
    }
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    period: {
      type: String,
      enum: ['per hour', 'per month', 'per year'],
      default: 'per year'
    }
  },
  experience: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    }
  },
  education: {
    type: String,
    enum: ['High School', 'Diploma', 'Undergraduate', 'Graduate', 'Postgraduate', 'Any'],
    default: 'Any'
  },
  jobType: {
    type: String,
    enum: ['Software Development', 'Data Science', 'Digital Marketing', 'Design', 'Sales', 'HR', 'Finance', 'Operations', 'Other'],
    required: true
  },
  benefits: [String],
  applicationDeadline: {
    type: Date,
    required: true
  },
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Selected'],
      default: 'Applied'
    },
    resume: String, // URL to resume
    coverLetter: String
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search functionality
jobPostingSchema.index({ 
  title: 'text', 
  description: 'text', 
  'company.name': 'text',
  requiredSkills: 'text'
});

module.exports = mongoose.model('JobPosting', jobPostingSchema);