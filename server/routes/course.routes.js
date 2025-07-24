import express from 'express';
import {
  getCourses,
  getCourse,
  enrollInCourse,
  getEnrolledCourses,
  updateProgress,
  submitQuizAnswer,
  searchCourses
} from '../controllers/course.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/search', searchCourses);
router.get('/:id', getCourse);

// Protected routes
router.post('/enroll/:id', protect, enrollInCourse);
router.get('/user/enrolled', protect, getEnrolledCourses);
router.put('/progress/:courseId', protect, updateProgress);
router.post('/quiz/:courseId/:moduleId', protect, submitQuizAnswer);

export default router;