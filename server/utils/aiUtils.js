import OpenAI from 'openai';
import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';
import path from 'path';
import fs from 'fs';

let openai = null;
let localModel = null;
let localContext = null;

// Initialize OpenAI client
const initializeOpenAI = () => {
  try {
    if (process.env.OPENAI_API_KEY) {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log('✅ OpenAI API initialized successfully');
      return true;
    } else {
      console.warn('⚠️  OpenAI API key not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI:', error.message);
    return false;
  }
};

// Initialize local LLM model as fallback
const initializeLocalLLM = async () => {
  try {
    if (process.env.ENABLE_AI !== 'true') {
      console.log('🤖 Local AI features disabled');
      return false;
    }

    const modelPath = process.env.LLM_MODEL_PATH || path.join(__dirname, '../models/llama-model.gguf');
    
    console.log('🤖 Initializing local AI model...');
    console.log('📁 Model path:', modelPath);

    // Check if model file exists
    if (!fs.existsSync(modelPath)) {
      console.warn('⚠️  Local LLM model not found at:', modelPath);
      console.warn('⚠️  Local AI features will be disabled');
      return false;
    }

    localModel = new LlamaModel({
      modelPath,
      verbose: false
    });

    localContext = new LlamaContext({
      model: localModel,
      threads: 2,
      contextSize: 2048
    });

    console.log('✅ Local AI model initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize local AI model:', error.message);
    return false;
  }
};

// Initialize all AI systems
const initializeAI = async () => {
  const openaiReady = initializeOpenAI();
  const localReady = await initializeLocalLLM();
  
  if (!openaiReady && !localReady) {
    console.warn('⚠️  No AI systems available - using fallback responses');
  }
};

// Get AI response with OpenAI as primary, local LLM as fallback
const getAIResponse = async (prompt, options = {}) => {
  const {
    maxTokens = 500,
    temperature = 0.7,
    model = 'gpt-3.5-turbo',
    systemPrompt = 'You are a helpful AI tutor for GrowEasyAI, an education platform for students in India. Provide clear, encouraging, and practical advice.'
  } = options;

  try {
    // Try OpenAI first
    if (openai) {
      console.log('🤖 Using OpenAI API for response');
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      });

      return completion.choices[0].message.content.trim();
    }

    // Fallback to local LLM
    if (localModel && localContext) {
      console.log('🤖 Using local LLM for response');
      const session = new LlamaChatSession({
        context: localContext
      });

      const response = await session.prompt(`${systemPrompt}\n\n${prompt}`, {
        maxTokens,
        temperature
      });

      return response.trim();
    }

    // Final fallback to static responses
    console.log('🤖 Using fallback response');
    return getFallbackResponse(prompt);

  } catch (error) {
    console.error('AI Response error:', error);
    
    // Try local LLM if OpenAI fails
    if (openai && localModel && localContext) {
      try {
        console.log('🤖 OpenAI failed, trying local LLM');
        const session = new LlamaChatSession({
          context: localContext
        });

        const response = await session.prompt(`${systemPrompt}\n\n${prompt}`, {
          maxTokens,
          temperature
        });

        return response.trim();
      } catch (localError) {
        console.error('Local LLM also failed:', localError);
      }
    }

    return getFallbackResponse(prompt);
  }
};

// Enhanced career analysis using OpenAI
const analyzeCareerProfile = async (profileData) => {
  const {
    personalityResponses,
    skillsAssessment,
    interests,
    careerGoals,
    userProfile
  } = profileData;

  const analysisPrompt = `
    Analyze this Indian student's profile and provide comprehensive career guidance:

    Student Background:
    - Location: ${userProfile?.location?.city || 'Not specified'}, ${userProfile?.location?.state || 'India'}
    - Education: ${userProfile?.education?.level || 'Not specified'}
    - Experience: ${userProfile?.experience || 'Fresher'}

    Assessment Data:
    - Skills: ${JSON.stringify(skillsAssessment)}
    - Interests: ${interests?.join(', ') || 'Not specified'}
    - Career Goals: ${careerGoals?.shortTerm?.join(', ') || 'Not specified'}
    - Personality Responses: ${JSON.stringify(personalityResponses)}

    Please provide:
    1. Personality analysis with type (Analyst/Diplomat/Sentinel/Explorer)
    2. Top 5 career recommendations with:
       - Career title
       - Match percentage (0-100)
       - Description (2-3 sentences)
       - Required skills
       - Salary range in INR
       - Growth prospects in India
       - Why it matches their profile
       - Specific next steps

    Focus on opportunities in India, especially for Tier-2/3 cities. Consider remote work options and emerging fields.
    Format as JSON with clear structure.
  `;

  try {
    const response = await getAIResponse(analysisPrompt, {
      maxTokens: 1000,
      temperature: 0.8,
      systemPrompt: 'You are an expert career counselor specializing in the Indian job market. Provide detailed, actionable career guidance in JSON format.'
    });

    // Try to parse JSON response
    try {
      return JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, return structured fallback
      return parseCareerAnalysisText(response);
    }
  } catch (error) {
    console.error('Career analysis error:', error);
    return getFallbackCareerAnalysis(profileData);
  }
};

// Generate personalized learning recommendations
const generateLearningRecommendations = async (userProfile, careerGoals) => {
  const prompt = `
    Based on this student profile, recommend specific learning paths:

    Profile:
    - Current Skills: ${userProfile?.skills?.join(', ') || 'None specified'}
    - Education: ${userProfile?.education?.level || 'Not specified'}
    - Career Goals: ${careerGoals?.join(', ') || 'Not specified'}
    - Location: ${userProfile?.location?.city || 'India'}

    Provide:
    1. Top 5 skills to learn (prioritized)
    2. Specific course recommendations
    3. Learning timeline (weeks/months)
    4. Free resources available in India
    5. Certification suggestions

    Focus on practical, job-ready skills for the Indian market.
  `;

  try {
    return await getAIResponse(prompt, {
      maxTokens: 600,
      systemPrompt: 'You are an education advisor specializing in skill development for Indian students. Provide practical, actionable learning recommendations.'
    });
  } catch (error) {
    console.error('Learning recommendations error:', error);
    return getFallbackLearningRecommendations();
  }
};

// Enhanced job matching with AI
const generateJobRecommendations = async (userProfile, jobPreferences) => {
  const prompt = `
    Analyze this profile and suggest job search strategies:

    Profile:
    - Skills: ${userProfile?.skills?.join(', ') || 'Not specified'}
    - Experience: ${userProfile?.experience || 'Fresher'}
    - Location: ${userProfile?.location?.city || 'Not specified'}
    - Education: ${userProfile?.education?.level || 'Not specified'}
    - Preferences: ${JSON.stringify(jobPreferences)}

    Provide:
    1. Best job titles to search for
    2. Companies to target in their location
    3. Salary expectations
    4. Skills to highlight in applications
    5. Interview preparation tips
    6. Remote work opportunities

    Focus on realistic opportunities in India.
  `;

  try {
    return await getAIResponse(prompt, {
      maxTokens: 500,
      systemPrompt: 'You are a job placement expert familiar with the Indian job market. Provide specific, actionable job search advice.'
    });
  } catch (error) {
    console.error('Job recommendations error:', error);
    return getFallbackJobRecommendations();
  }
};

// Fallback responses when AI is not available
const getFallbackResponse = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('career') || lowerPrompt.includes('job')) {
    return "Based on your profile, I recommend exploring technology, digital marketing, or data analysis fields. These areas have great opportunities in India. Consider taking relevant courses to build your skills. Would you like specific course recommendations?";
  }
  
  if (lowerPrompt.includes('learn') || lowerPrompt.includes('study')) {
    return "Great question! For effective learning, I suggest: 1) Break topics into smaller parts, 2) Practice regularly with hands-on projects, 3) Join study groups or online communities, 4) Take notes and review them daily. What specific topic are you working on?";
  }
  
  if (lowerPrompt.includes('programming') || lowerPrompt.includes('coding')) {
    return "Programming is an excellent skill to develop! Start with fundamentals like HTML, CSS, and JavaScript for web development, or Python for data science. Practice by building small projects and gradually increase complexity. Consistency is key!";
  }
  
  return "Thank you for your question! While I'm having some technical difficulties right now, I encourage you to explore our courses and resources. Remember, every expert was once a beginner. Keep learning and practicing!";
};

// Helper functions for parsing and fallbacks
const parseCareerAnalysisText = (text) => {
  // Simple text parsing for career analysis
  return {
    personalityType: 'Explorer',
    careers: [
      {
        title: 'Software Developer',
        matchPercentage: 85,
        description: 'Develop web and mobile applications using modern technologies',
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        salaryRange: { min: 300000, max: 800000 },
        growthProspects: 'Excellent growth opportunities in tech industry',
        reasons: ['Strong analytical skills', 'Interest in technology'],
        nextSteps: ['Learn programming fundamentals', 'Build projects', 'Apply for internships']
      }
    ]
  };
};

const getFallbackCareerAnalysis = (profileData) => {
  return {
    personalityType: 'Explorer',
    careers: [
      {
        title: 'Software Developer',
        matchPercentage: 85,
        description: 'Build web and mobile applications',
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        salaryRange: { min: 300000, max: 800000 },
        growthProspects: 'High demand in Indian tech industry',
        reasons: ['Analytical thinking', 'Problem-solving skills'],
        nextSteps: ['Learn coding basics', 'Build portfolio projects']
      },
      {
        title: 'Digital Marketing Specialist',
        matchPercentage: 78,
        description: 'Manage online marketing campaigns',
        requiredSkills: ['SEO', 'Social Media', 'Analytics'],
        salaryRange: { min: 250000, max: 600000 },
        growthProspects: 'Growing with digital economy',
        reasons: ['Creative thinking', 'Communication skills'],
        nextSteps: ['Learn digital marketing tools', 'Get certified']
      }
    ]
  };
};

const getFallbackLearningRecommendations = () => {
  return `
    Based on current market trends, here are key learning recommendations:

    Priority Skills:
    1. Programming (JavaScript, Python) - 3-6 months
    2. Digital Marketing - 2-3 months  
    3. Data Analysis - 4-6 months
    4. Communication Skills - Ongoing
    5. English Proficiency - Ongoing

    Free Resources:
    - FreeCodeCamp for programming
    - Google Digital Marketing courses
    - YouTube tutorials
    - Government skill development programs

    Certifications:
    - Google Career Certificates
    - Microsoft Learn
    - AWS Cloud Practitioner
  `;
};

const getFallbackJobRecommendations = () => {
  return `
    Job Search Strategy:

    Target Roles:
    - Junior Developer
    - Digital Marketing Executive
    - Data Analyst Trainee
    - Customer Support Specialist

    Companies to Target:
    - Local IT companies
    - Startups in your city
    - Remote-first companies
    - Government organizations

    Salary Expectations:
    - Entry level: ₹2-4 LPA
    - With skills: ₹4-8 LPA

    Key Tips:
    - Build a strong LinkedIn profile
    - Create a portfolio of projects
    - Practice interview skills
    - Network with professionals
  `;
};

// Check if AI systems are available
const isAIAvailable = () => {
  return !!(openai || (localModel && localContext));
};

const isOpenAIAvailable = () => {
  return !!openai;
};

export {
  initializeAI,
  getAIResponse,
  analyzeCareerProfile,
  generateLearningRecommendations,
  generateJobRecommendations,
  isAIAvailable,
  isOpenAIAvailable
};

// Legacy exports for backward compatibility
export const initializeLLM = initializeAI;
export const getLLMResponse = getAIResponse;