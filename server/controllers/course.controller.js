const Course = require('../models/Course.model');
const User = require('../models/User.model');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const level = req.query.level;
    
    // Build filter object
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (level && level !== 'all') filter.level = level;

    // Get courses with pagination
    const courses = await Course.find(filter)
      .select('-modules.quiz -modules.content')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCourses: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting courses'
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Don't show quiz answers to non-enrolled users
    if (!req.user) {
      course.modules = course.modules.map(module => ({
        ...module.toObject(),
        quiz: module.quiz ? module.quiz.map(q => ({
          question: q.question,
          options: q.options
        })) : []
      }));
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting course'
    });
  }
};

// @desc    Search courses
// @route   GET /api/courses/search
// @access  Public
const searchCourses = async (req, res) => {
  try {
    const { q, category, level } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Build search query
    const searchQuery = {
      $and: [
        { isActive: true },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { skills: { $in: [new RegExp(q, 'i')] } },
            { 'instructor.name': { $regex: q, $options: 'i' } }
          ]
        }
      ]
    };

    if (category && category !== 'all') {
      searchQuery.$and.push({ category });
    }

    if (level && level !== 'all') {
      searchQuery.$and.push({ level });
    }

    const courses = await Course.find(searchQuery)
      .select('-modules.quiz -modules.content')
      .sort({ enrolledStudents: -1, rating: -1 });

    res.json({
      success: true,
      data: {
        courses,
        count: courses.length,
        query: q
      }
    });
  } catch (error) {
    console.error('Search courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching courses'
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/enroll/:id
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.course.toString() === req.params.id
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add to user's enrolled courses
    user.enrolledCourses.push({
      course: req.params.id,
      progress: 0,
      completedModules: []
    });

    // Increment course enrollment count
    course.enrolledStudents += 1;

    await user.save();
    await course.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        courseId: course._id,
        title: course.title
      }
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error enrolling in course'
    });
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/courses/user/enrolled
// @access  Private
const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses.course',
        select: 'title description thumbnail category level duration instructor rating'
      });

    const enrolledCourses = user.enrolledCourses.map(enrollment => ({
      ...enrollment.course.toObject(),
      enrollmentData: {
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        completedModules: enrollment.completedModules
      }
    }));

    res.json({
      success: true,
      data: enrolledCourses
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting enrolled courses'
    });
  }
};

// @desc    Update course progress
// @route   PUT /api/courses/progress/:courseId
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { moduleIndex, completed } = req.body;
    const courseId = req.params.courseId;

    const user = await User.findById(req.user.id);
    const enrollment = user.enrolledCourses.find(
      e => e.course.toString() === courseId
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Get course to calculate progress
    const course = await Course.findById(courseId);
    const totalModules = course.modules.length;

    if (completed && !enrollment.completedModules.includes(moduleIndex)) {
      enrollment.completedModules.push(moduleIndex);
    } else if (!completed) {
      enrollment.completedModules = enrollment.completedModules.filter(
        index => index !== moduleIndex
      );
    }

    // Calculate progress percentage
    enrollment.progress = Math.round(
      (enrollment.completedModules.length / totalModules) * 100
    );

    await user.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress: enrollment.progress,
        completedModules: enrollment.completedModules
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating progress'
    });
  }
};

// @desc    Submit quiz answer
// @route   POST /api/courses/quiz/:courseId/:moduleId
// @access  Private
const submitQuizAnswer = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { answers } = req.body; // Array of user answers

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Check if user is enrolled
    const user = await User.findById(req.user.id);
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.course.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = [];

    module.quiz.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;
      
      results.push({
        questionIndex: index,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    });

    const score = Math.round((correctAnswers / module.quiz.length) * 100);

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score,
        correctAnswers,
        totalQuestions: module.quiz.length,
        results
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting quiz'
    });
  }
};

module.exports = {
  getCourses,
  getCourse,
  searchCourses,
  enrollInCourse,
  getEnrolledCourses,
  updateProgress,
  submitQuizAnswer
};