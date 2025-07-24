import express from 'express';
import {
  createJob,
  getJobs,
  getJob,
  searchJobs,
  applyForJob,
  getApplications,
  getJobRecommendations
} from '../controllers/job.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/search', searchJobs);
router.get('/:id', getJob);

// Protected routes
router.post('/', protect, createJob);
router.post('/apply/:id', protect, applyForJob);
router.get('/user/applications', protect, getApplications);
router.get('/user/recommendations', protect, getJobRecommendations);

export default router;