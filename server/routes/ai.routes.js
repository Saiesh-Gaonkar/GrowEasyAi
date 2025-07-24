import express from 'express';
import {
  chatWithAI,
  submitAssessment,
  getCareerRecommendations,
  getCareerProfile,
  getPersonalizedInsights
} from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Chat endpoint - public for demo, but can be protected
router.post('/chat', chatWithAI);

// Protected routes
router.use(protect);
router.post('/assessment', submitAssessment);
router.get('/recommendations', getCareerRecommendations);
router.get('/profile', getCareerProfile);
router.get('/insights', getPersonalizedInsights);

export default router;