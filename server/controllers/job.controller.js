const JobPosting = require('../models/JobPosting.model');
const User = require('../models/User.model');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const jobType = req.query.jobType;
    const workType = req.query.workType;
    const city = req.query.city;

    // Build filter object
    const filter = { isActive: true, applicationDeadline: { $gte: new Date() } };
    
    if (jobType && jobType !== 'all') filter.jobType = jobType;
    if (workType && workType !== 'all') filter['location.workType'] = workType;
    if (city) filter['location.city'] = new RegExp(city, 'i');

    const jobs = await JobPosting.find(filter)
      .populate('postedBy', 'name')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JobPosting.countDocuments(filter);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalJobs: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting jobs'
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id)
      .populate('postedBy', 'name profile.avatar');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting job'
    });
  }
};

// @desc    Search jobs
// @route   GET /api/jobs/search
// @access  Public
const searchJobs = async (req, res) => {
  try {
    const { q, location, skills, experience, salary } = req.query;

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
        { applicationDeadline: { $gte: new Date() } },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { 'company.name': { $regex: q, $options: 'i' } },
            { requiredSkills: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    };

    // Add filters
    if (location) {
      searchQuery.$and.push({
        $or: [
          { 'location.city': { $regex: location, $options: 'i' } },
          { 'location.state': { $regex: location, $options: 'i' } }
        ]
      });
    }

    if (skills) {
      const skillsArray = skills.split(',');
      searchQuery.$and.push({
        requiredSkills: { $in: skillsArray.map(skill => new RegExp(skill.trim(), 'i')) }
      });
    }

    if (experience) {
      const expRange = parseInt(experience);
      searchQuery.$and.push({
        'experience.min': { $lte: expRange },
        'experience.max': { $gte: expRange }
      });
    }

    if (salary) {
      const salaryMin = parseInt(salary);
      searchQuery.$and.push({
        'salary.min': { $gte: salaryMin }
      });
    }

    const jobs = await JobPosting.find(searchQuery)
      .populate('postedBy', 'name')
      .sort({ featured: -1, views: -1 });

    res.json({
      success: true,
      data: {
        jobs,
        count: jobs.length,
        query: q,
        filters: { location, skills, experience, salary }
      }
    });
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching jobs'
    });
  }
};

// @desc    Apply for job
// @route   POST /api/jobs/apply/:id
// @access  Private
const applyForJob = async (req, res) => {
  try {
    const { coverLetter, resume } = req.body;
    const jobId = req.params.id;

    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      applicant => applicant.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'Already applied for this job'
      });
    }

    // Check application deadline
    if (new Date() > job.applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Add application
    job.applicants.push({
      user: req.user.id,
      coverLetter,
      resume,
      status: 'Applied'
    });

    // Update user's applied jobs
    const user = await User.findById(req.user.id);
    user.appliedJobs.push({
      job: jobId,
      status: 'Applied'
    });

    await job.save();
    await user.save();

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        jobId,
        jobTitle: job.title,
        companyName: job.company.name
      }
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error applying for job'
    });
  }
};

// @desc    Get user's job applications
// @route   GET /api/jobs/user/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'appliedJobs.job',
        select: 'title company location salary status applicationDeadline'
      });

    const applications = user.appliedJobs.map(application => ({
      ...application.job.toObject(),
      applicationData: {
        appliedAt: application.appliedAt,
        status: application.status
      }
    }));

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting applications'
    });
  }
};

// @desc    Get job recommendations for user
// @route   GET /api/jobs/user/recommendations
// @access  Private
const getJobRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userSkills = user.profile.skills || [];
    const userLocation = user.profile.location?.city;
    const userEducation = user.profile.education?.level;

    // Build recommendation query
    let matchQuery = {
      isActive: true,
      applicationDeadline: { $gte: new Date() }
    };

    // Match based on skills
    if (userSkills.length > 0) {
      matchQuery.requiredSkills = {
        $in: userSkills.map(skill => new RegExp(skill, 'i'))
      };
    }

    // Match based on location (preferred but not required)
    const locationFilter = userLocation ? {
      $or: [
        { 'location.city': new RegExp(userLocation, 'i') },
        { 'location.isRemote': true }
      ]
    } : { 'location.isRemote': true };

    const recommendations = await JobPosting.find({
      ...matchQuery,
      ...locationFilter
    })
    .populate('postedBy', 'name')
    .sort({ featured: -1, createdAt: -1 })
    .limit(10);

    // Calculate match scores
    const scoredRecommendations = recommendations.map(job => {
      let score = 0;
      
      // Skills match
      const matchingSkills = job.requiredSkills.filter(skill =>
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      score += (matchingSkills.length / job.requiredSkills.length) * 40;

      // Location match
      if (job.location.isRemote || 
          (userLocation && job.location.city.toLowerCase() === userLocation.toLowerCase())) {
        score += 30;
      }

      // Education match
      if (job.education === 'Any' || job.education === userEducation) {
        score += 20;
      }

      // Recent posting bonus
      const daysSincePosted = Math.floor(
        (new Date() - job.createdAt) / (1000 * 60 * 60 * 24)
      );
      if (daysSincePosted <= 7) score += 10;

      return {
        ...job.toObject(),
        matchScore: Math.round(score),
        matchingSkills: matchingSkills.length,
        reasons: [
          `${matchingSkills.length} matching skills`,
          job.location.isRemote ? 'Remote work available' : `Located in ${job.location.city}`,
          `Suitable for ${job.education} level`
        ].filter(Boolean)
      };
    });

    // Sort by match score
    scoredRecommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: {
        recommendations: scoredRecommendations,
        count: scoredRecommendations.length,
        userProfile: {
          skills: userSkills,
          location: userLocation,
          education: userEducation
        }
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

module.exports = {
  getJobs,
  getJob,
  searchJobs,
  applyForJob,
  getApplications,
  getJobRecommendations
};