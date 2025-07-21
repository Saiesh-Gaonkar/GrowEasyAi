const express = require('express');
const {
  getCourses,
  getCourse,
  enrollInCourse,
  getEnrolledCourses,
  updateProgress,
  submitQuizAnswer,
  searchCourses
} = require('../controllers/course.controller');
const { protect } = require('../middleware/auth.middleware');

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

module.exports = router;