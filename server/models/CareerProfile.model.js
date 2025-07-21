const mongoose = require('mongoose');

const careerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalityAssessment: {
    responses: [{
      question: String,
      answer: String,
      score: Number
    }],
    personalityType: {
      type: String,
      enum: ['Analyst', 'Diplomat', 'Sentinel', 'Explorer']
    },
    traits: {
      openness: { type: Number, min: 0, max: 100 },
      conscientiousness: { type: Number, min: 0, max: 100 },
      extraversion: { type: Number, min: 0, max: 100 },
      agreeableness: { type: Number, min: 0, max: 100 },
      neuroticism: { type: Number, min: 0, max: 100 }
    }
  },
  skillsAssessment: {
    technical: [{
      skill: String,
      level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
      },
      assessedAt: {
        type: Date,
        default: Date.now
      }
    }],
    soft: [{
      skill: String,
      level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
      },
      assessedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  interests: {
    primary: [String],
    secondary: [String],
    dislikes: [String]
  },
  careerGoals: {
    shortTerm: [String], // 1-2 years
    longTerm: [String],  // 5-10 years
    industries: [String],
    roles: [String],
    preferredWorkEnvironment: {
      type: String,
      enum: ['Office', 'Remote', 'Hybrid', 'Flexible']
    }
  },
  aiRecommendations: {
    careers: [{
      title: String,
      matchPercentage: {
        type: Number,
        min: 0,
        max: 100
      },
      description: String,
      requiredSkills: [String],
      averageSalary: {
        min: Number,
        max: Number
      },
      growthProspects: String,
      reasons: [String], // Why this career matches
      nextSteps: [String] // What to do to pursue this career
    }],
    courses: [{
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      relevanceScore: {
        type: Number,
        min: 0,
        max: 100
      },
      reason: String
    }],
    skills: [{
      skill: String,
      priority: {
        type: String,
        enum: ['High', 'Medium', 'Low']
      },
      reason: String,
      resources: [String]
    }],
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  strengths: [String],
  improvements: [String],
  completionStatus: {
    personalityAssessment: {
      type: Boolean,
      default: false
    },
    skillsAssessment: {
      type: Boolean,
      default: false
    },
    interestsAssessment: {
      type: Boolean,
      default: false
    },
    overallCompletion: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CareerProfile', careerProfileSchema);