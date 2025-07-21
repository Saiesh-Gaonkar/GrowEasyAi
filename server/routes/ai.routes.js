const express = require('express');
const {
  chatWithAI,
  submitAssessment,
  getCareerRecommendations,
  getCareerProfile,
  getPersonalizedInsights
} = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All AI routes are protected
router.use(protect);

router.post('/chat', chatWithAI);
router.post('/assessment', submitAssessment);
router.get('/recommendations', getCareerRecommendations);
router.get('/profile', getCareerProfile);
router.get('/insights', getPersonalizedInsights);

module.exports = router;