const express = require('express');
const {
  getJobs,
  getJob,
  searchJobs,
  applyForJob,
  getApplications,
  getJobRecommendations
} = require('../controllers/job.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/search', searchJobs);
router.get('/:id', getJob);

// Protected routes
router.post('/apply/:id', protect, applyForJob);
router.get('/user/applications', protect, getApplications);
router.get('/user/recommendations', protect, getJobRecommendations);

module.exports = router;