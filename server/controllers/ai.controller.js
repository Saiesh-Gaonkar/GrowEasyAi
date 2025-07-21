const { 
  getAIResponse, 
  analyzeCareerProfile, 
  generateLearningRecommendations,
  generateJobRecommendations,
  isOpenAIAvailable 
} = require('../utils/aiUtils');
const CareerProfile = require('../models/CareerProfile.model');
const User = require('../models/User.model');
const Course = require('../models/Course.model');

// @desc    Chat with AI tutor
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get user context for personalized responses
    const user = await User.findById(req.user.id);
    
    // Build context for AI
    const aiContext = `
      You are an AI tutor for GrowEasyAI, helping students from Tier-2 and Tier-3 cities in India. 
      You provide personalized, encouraging guidance in simple language.
      
      Student Profile:
      - Name: ${user.name}
      - Education: ${user.profile?.education?.level || 'Not specified'}
      - Skills: ${user.profile?.skills?.join(', ') || 'Not specified'}
      - Interests: ${user.profile?.interests?.join(', ') || 'Not specified'}
      - Location: ${user.profile?.location?.city || 'Not specified'}
      
      Context: ${context || 'General learning assistance'}
      
      Provide helpful, encouraging advice in 2-3 sentences. Focus on practical next steps.
    `;

    // Get AI response with enhanced context
    const aiResponse = await getAIResponse(message, {
      maxTokens: 300,
      temperature: 0.8,
      systemPrompt: aiContext
    });

    res.json({
      success: true,
      data: {
        response: aiResponse,
        timestamp: new Date(),
        aiProvider: isOpenAIAvailable() ? 'OpenAI' : 'Local'
      }
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing AI chat',
      fallbackResponse: "I'm having trouble connecting right now. Please try again, or explore our courses while I get back online! 😊"
    });
  }
};

// @desc    Submit career assessment
// @route   POST /api/ai/assessment
// @access  Private
const submitAssessment = async (req, res) => {
  try {
    const { personalityResponses, skillsAssessment, interests, careerGoals } = req.body;

    // Validate required data
    if (!personalityResponses || !skillsAssessment || !interests) {
      return res.status(400).json({
        success: false,
        message: 'Assessment data is incomplete'
      });
    }

    // Get user profile for enhanced analysis
    const user = await User.findById(req.user.id);
    
    // Use AI for comprehensive career analysis
    const analysisResult = await analyzeCareerProfile({
      personalityResponses,
      skillsAssessment,
      interests,
      careerGoals,
      userProfile: user.profile
    });

    // Create or update career profile
    let careerProfile = await CareerProfile.findOne({ user: req.user.id });
    
    if (careerProfile) {
      // Update existing profile
      careerProfile.personalityAssessment = {
        responses: personalityResponses,
        personalityType: analysisResult.personalityType,
        traits: analysisResult.traits || {}
      };
      careerProfile.skillsAssessment = skillsAssessment;
      careerProfile.interests = interests;
      careerProfile.careerGoals = careerGoals || {};
      careerProfile.aiRecommendations = {
        careers: analysisResult.careers || [],
        generatedAt: new Date()
      };
      careerProfile.completionStatus = {
        personalityAssessment: true,
        skillsAssessment: true,
        interestsAssessment: true,
        overallCompletion: 100
      };
    } else {
      // Create new profile
      careerProfile = new CareerProfile({
        user: req.user.id,
        personalityAssessment: {
          responses: personalityResponses,
          personalityType: analysisResult.personalityType,
          traits: analysisResult.traits || {}
        },
        skillsAssessment,
        interests,
        careerGoals: careerGoals || {},
        aiRecommendations: {
          careers: analysisResult.careers || [],
          generatedAt: new Date()
        },
        completionStatus: {
          personalityAssessment: true,
          skillsAssessment: true,
          interestsAssessment: true,
          overallCompletion: 100
        }
      });
    }

    await careerProfile.save();

    // Update user's assessment results
    const user = await User.findById(req.user.id);
    user.assessmentResults = {
      personalityType: analysisResult.personalityType,
      strengths: analysisResult.strengths || ['Problem-solving', 'Adaptability'],
      improvements: analysisResult.improvements || ['Communication', 'Leadership'],
      careerMatches: (analysisResult.careers || []).slice(0, 3).map(career => ({
        career: career.title,
        matchPercentage: career.matchPercentage,
        description: career.description
      })),
      completedAt: new Date()
    };
    await user.save();

    res.json({
      success: true,
      message: 'Assessment completed successfully',
      data: {
        personalityType: analysisResult.personalityType,
        careerRecommendations: analysisResult.careers || [],
        completionStatus: careerProfile.completionStatus,
        aiProvider: isOpenAIAvailable() ? 'OpenAI' : 'Local'
      }
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing assessment'
    });
  }
};

// @desc    Get career recommendations
// @route   GET /api/ai/recommendations
// @access  Private
const getCareerRecommendations = async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ user: req.user.id });

    if (!careerProfile || !careerProfile.aiRecommendations) {
      return res.status(404).json({
        success: false,
        message: 'No career assessment found. Please complete the assessment first.'
      });
    }

    // Get recommended courses based on career recommendations
    const recommendedCourses = await getRecommendedCourses(careerProfile);

    res.json({
      success: true,
      data: {
        careers: careerProfile.aiRecommendations.careers,
        courses: recommendedCourses,
        generatedAt: careerProfile.aiRecommendations.generatedAt
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting recommendations'
    });
  }
};

// @desc    Get career profile
// @route   GET /api/ai/profile
// @access  Private
const getCareerProfile = async (req, res) => {
  try {
    const careerProfile = await CareerProfile.findOne({ user: req.user.id })
      .populate('user', 'name email profile');

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Career profile not found'
      });
    }

    res.json({
      success: true,
      data: careerProfile
    });
  } catch (error) {
    console.error('Get career profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting career profile'
    });
  }
};

// @desc    Get personalized insights
// @route   GET /api/ai/insights
// @access  Private
const getPersonalizedInsights = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const careerProfile = await CareerProfile.findOne({ user: req.user.id });

    if (!careerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Please complete your career assessment first'
      });
    }

    // Generate personalized insights using AI
    const learningRecommendations = await generateLearningRecommendations(
      user.profile,
      careerProfile.careerGoals?.shortTerm || []
    );

    const jobRecommendations = await generateJobRecommendations(
      user.profile,
      { remote: true, location: user.profile?.location }
    );

    res.json({
      success: true,
      data: {
        learningRecommendations,
        jobSearchTips: jobRecommendations,
        profileCompletion: careerProfile.completionStatus?.overallCompletion || 0,
        lastUpdated: careerProfile.updatedAt,
        aiProvider: isOpenAIAvailable() ? 'OpenAI' : 'Local'
      }
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating insights'
    });
  }
};

const getRecommendedCourses = async (careerProfile) => {
  try {
    // Get all career recommendations
    const careerTitles = careerProfile.aiRecommendations.careers.map(career => career.title);
    const requiredSkills = careerProfile.aiRecommendations.careers
      .flatMap(career => career.requiredSkills || []);

    // Find courses that match career paths and required skills
    const courses = await Course.find({
      $or: [
        { skills: { $in: requiredSkills } },
        { title: { $in: careerTitles.map(title => new RegExp(title, 'i')) } },
        { category: { $in: ['Programming', 'Data Science', 'Digital Marketing', 'Design'] } }
      ],
      isActive: true
    })
    .select('title description thumbnail category level skills rating')
    .limit(6)
    .sort({ rating: -1, enrolledStudents: -1 });

    return courses;
  } catch (error) {
    console.error('Get recommended courses error:', error);
    return [];
  }
};

module.exports = {
  chatWithAI,
  submitAssessment,
  getCareerRecommendations,
  getCareerProfile,
  getPersonalizedInsights
};