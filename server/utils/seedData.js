import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Course from '../models/Course.model.js';
import JobPosting from '../models/JobPosting.model.js';
import User from '../models/User.model.js';

import connectDB from '../config/database.js';

// Sample courses data
const sampleCourses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and build full-stack web applications. Perfect for beginners.',
    category: 'Programming',
    level: 'Beginner',
    duration: '12 weeks',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
    prerequisites: ['Basic computer knowledge'],
    instructor: {
      name: 'Priya Sharma',
      bio: 'Full-stack developer with 5+ years experience in web development',
      rating: 4.8
    },
    thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?w=400',
    modules: [
      {
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web development',
        order: 1,
        duration: '3 hours',
        quiz: [
          {
            question: 'What does HTML stand for?',
            options: ['Hypertext Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'],
            correctAnswer: 0,
            explanation: 'HTML stands for Hypertext Markup Language, the standard markup language for web pages.'
          }
        ]
      },
      {
        title: 'JavaScript Basics',
        description: 'Introduction to programming with JavaScript',
        order: 2,
        duration: '4 hours',
        quiz: [
          {
            question: 'Which of the following is used to declare a variable in JavaScript?',
            options: ['var', 'let', 'const', 'All of the above'],
            correctAnswer: 3,
            explanation: 'JavaScript provides var, let, and const keywords to declare variables, each with different scoping rules.'
          }
        ]
      }
    ],
    rating: 4.7,
    enrolledStudents: 1250
  },
  {
    title: 'Data Science with Python',
    description: 'Master data analysis, visualization, and machine learning using Python, pandas, and scikit-learn.',
    category: 'Data Science',
    level: 'Intermediate',
    duration: '16 weeks',
    skills: ['Python', 'pandas', 'NumPy', 'Matplotlib', 'scikit-learn', 'SQL'],
    prerequisites: ['Basic Python knowledge', 'Mathematics basics'],
    instructor: {
      name: 'Dr. Rajesh Kumar',
      bio: 'Data Scientist with PhD in Statistics and 8+ years industry experience',
      rating: 4.9
    },
    thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=400',
    modules: [
      {
        title: 'Python for Data Analysis',
        description: 'Learn pandas and NumPy for data manipulation',
        order: 1,
        duration: '5 hours',
        quiz: [
          {
            question: 'Which library is primarily used for data manipulation in Python?',
            options: ['NumPy', 'pandas', 'Matplotlib', 'scikit-learn'],
            correctAnswer: 1,
            explanation: 'pandas is the primary library for data manipulation and analysis in Python.'
          }
        ]
      }
    ],
    rating: 4.8,
    enrolledStudents: 850
  },
  {
    title: 'Digital Marketing Mastery',
    description: 'Complete guide to digital marketing including SEO, social media, PPC, and email marketing.',
    category: 'Digital Marketing',
    level: 'Beginner',
    duration: '8 weeks',
    skills: ['SEO', 'Social Media Marketing', 'Google Ads', 'Email Marketing', 'Analytics'],
    prerequisites: ['Basic internet knowledge'],
    instructor: {
      name: 'Aisha Patel',
      bio: 'Digital marketing expert with 6+ years helping businesses grow online',
      rating: 4.6
    },
    thumbnail: 'https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg?w=400',
    modules: [
      {
        title: 'SEO Fundamentals',
        description: 'Learn search engine optimization basics',
        order: 1,
        duration: '3 hours',
        quiz: [
          {
            question: 'What does SEO stand for?',
            options: ['Search Engine Optimization', 'Social Engagement Online', 'Site Enhancement Operations'],
            correctAnswer: 0,
            explanation: 'SEO stands for Search Engine Optimization, the practice of increasing website visibility in search results.'
          }
        ]
      }
    ],
    rating: 4.5,
    enrolledStudents: 2100
  },
  {
    title: 'UI/UX Design Fundamentals',
    description: 'Learn user interface and user experience design principles, tools, and create stunning designs.',
    category: 'Design',
    level: 'Beginner',
    duration: '10 weeks',
    skills: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research'],
    prerequisites: ['Creative thinking', 'Basic computer skills'],
    instructor: {
      name: 'Saurabh Gupta',
      bio: 'Senior UI/UX Designer with 7+ years experience in product design',
      rating: 4.7
    },
    thumbnail: 'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?w=400',
    modules: [
      {
        title: 'Design Principles',
        description: 'Understand fundamental design principles',
        order: 1,
        duration: '2 hours'
      }
    ],
    rating: 4.6,
    enrolledStudents: 950
  },
  {
    title: 'Business Analytics with Excel',
    description: 'Master Excel for business analytics, data visualization, and decision making.',
    category: 'Business',
    level: 'Beginner',
    duration: '6 weeks',
    skills: ['Excel', 'Data Analysis', 'Pivot Tables', 'Charts', 'Dashboard Creation'],
    prerequisites: ['Basic computer knowledge'],
    instructor: {
      name: 'Neha Jain',
      bio: 'Business analyst with 4+ years experience in corporate data analysis',
      rating: 4.4
    },
    thumbnail: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?w=400',
    modules: [
      {
        title: 'Excel Basics',
        description: 'Learn Excel fundamentals and formulas',
        order: 1,
        duration: '2 hours'
      }
    ],
    rating: 4.3,
    enrolledStudents: 1450
  }
];

// Sample job postings
const sampleJobs = [
  {
    title: 'Junior Web Developer',
    company: {
      name: 'TechStart Solutions',
      about: 'A growing startup focused on web development and digital solutions'
    },
    description: 'We are looking for a passionate Junior Web Developer to join our team. You will work on exciting projects using modern web technologies.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'Basic knowledge of HTML, CSS, JavaScript',
      'Familiarity with React or Angular',
      'Good communication skills'
    ],
    responsibilities: [
      'Develop and maintain web applications',
      'Collaborate with designers and backend developers',
      'Write clean, efficient code',
      'Participate in code reviews'
    ],
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    preferredSkills: ['Node.js', 'Git', 'Bootstrap'],
    location: {
      city: 'Indore',
      state: 'Madhya Pradesh',
      workType: 'Full-time',
      isRemote: false
    },
    salary: {
      min: 300000,
      max: 450000
    },
    experience: {
      min: 0,
      max: 2
    },
    education: 'Undergraduate',
    jobType: 'Software Development',
    benefits: ['Health Insurance', 'Flexible Hours', 'Learning Budget'],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    title: 'Data Analyst Intern',
    company: {
      name: 'DataInsights Corp',
      about: 'Leading data analytics company serving enterprises across India'
    },
    description: 'Join our data team as an intern and gain hands-on experience with real-world data projects.',
    requirements: [
      'Currently pursuing degree in Statistics, Mathematics, or Computer Science',
      'Knowledge of Excel and SQL',
      'Basic understanding of Python or R',
      'Analytical mindset'
    ],
    responsibilities: [
      'Assist in data collection and cleaning',
      'Create reports and visualizations',
      'Support senior analysts in projects',
      'Learn advanced analytics tools'
    ],
    requiredSkills: ['Excel', 'SQL', 'Python'],
    preferredSkills: ['Tableau', 'Power BI', 'Statistics'],
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      workType: 'Internship',
      isRemote: true
    },
    salary: {
      min: 15000,
      max: 25000
    },
    experience: {
      min: 0,
      max: 1
    },
    education: 'Undergraduate',
    jobType: 'Data Science',
    benefits: ['Mentorship', 'Certificate', 'Remote Work'],
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Digital Marketing Executive',
    company: {
      name: 'GrowthHackers Agency',
      about: 'Digital marketing agency helping businesses scale online presence'
    },
    description: 'We need a creative and data-driven Digital Marketing Executive to manage campaigns across multiple channels.',
    requirements: [
      'Graduation in Marketing, Business, or related field',
      'Understanding of SEO, SEM, and social media',
      'Knowledge of Google Analytics and Facebook Ads',
      'Creative and analytical thinking'
    ],
    responsibilities: [
      'Plan and execute digital marketing campaigns',
      'Manage social media accounts',
      'Analyze campaign performance',
      'Create engaging content'
    ],
    requiredSkills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
    preferredSkills: ['Content Writing', 'Graphic Design', 'Email Marketing'],
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      workType: 'Full-time',
      isRemote: false
    },
    salary: {
      min: 250000,
      max: 400000
    },
    experience: {
      min: 1,
      max: 3
    },
    education: 'Undergraduate',
    jobType: 'Digital Marketing',
    benefits: ['Performance Bonus', 'Skill Development', 'Health Insurance'],
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'UI/UX Designer',
    company: {
      name: 'DesignCraft Studio',
      about: 'Creative design studio specializing in user experience and interface design'
    },
    description: 'Looking for a talented UI/UX Designer to create beautiful and functional designs for web and mobile applications.',
    requirements: [
      'Portfolio demonstrating UI/UX design skills',
      'Proficiency in Figma, Adobe XD, or Sketch',
      'Understanding of user-centered design principles',
      'Knowledge of responsive design'
    ],
    responsibilities: [
      'Design user interfaces for web and mobile apps',
      'Create wireframes and prototypes',
      'Conduct user research and testing',
      'Collaborate with development teams'
    ],
    requiredSkills: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping'],
    preferredSkills: ['User Research', 'Adobe Creative Suite', 'HTML/CSS'],
    location: {
      city: 'Kochi',
      state: 'Kerala',
      workType: 'Full-time',
      isRemote: true
    },
    salary: {
      min: 350000,
      max: 600000
    },
    experience: {
      min: 1,
      max: 4
    },
    education: 'Undergraduate',
    jobType: 'Design',
    benefits: ['Creative Freedom', 'Latest Tools', 'Flexible Schedule'],
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Content Writer',
    company: {
      name: 'ContentCrafters',
      about: 'Content marketing agency creating engaging content for various industries'
    },
    description: 'We are seeking a skilled Content Writer to produce high-quality content for our clients across different industries.',
    requirements: [
      'Excellent English writing and grammar skills',
      'Experience in content writing or copywriting',
      'Research and fact-checking abilities',
      'SEO knowledge preferred'
    ],
    responsibilities: [
      'Write blog posts, articles, and web content',
      'Research industry topics and trends',
      'Optimize content for SEO',
      'Meet content deadlines'
    ],
    requiredSkills: ['Content Writing', 'Research', 'SEO', 'Grammar'],
    preferredSkills: ['WordPress', 'Social Media', 'Marketing'],
    location: {
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      workType: 'Part-time',
      isRemote: true
    },
    salary: {
      min: 20000,
      max: 35000
    },
    experience: {
      min: 1,
      max: 3
    },
    education: 'Undergraduate',
    jobType: 'Other',
    benefits: ['Flexible Hours', 'Work from Home', 'Skill Development'],
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@groweasyai.com',
      password: 'admin123',
      role: 'admin',
      profile: {
        location: {
          city: 'Mumbai',
          state: 'Maharashtra'
        }
      }
    });

    console.log('👤 Admin user created');

    // Clear existing data
    await Course.deleteMany({});
    await JobPosting.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed courses
    const courses = await Course.insertMany(sampleCourses);
    console.log(`📚 Created ${courses.length} courses`);

    // Seed jobs with admin user as poster
    const jobsWithPoster = sampleJobs.map(job => ({
      ...job,
      postedBy: adminUser._id
    }));
    
    const jobs = await JobPosting.insertMany(jobsWithPoster);
    console.log(`💼 Created ${jobs.length} job postings`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Admin user: admin@groweasyai.com (password: admin123)`);
    console.log(`- Courses: ${courses.length}`);
    console.log(`- Job postings: ${jobs.length}`);
    console.log('\n🚀 You can now start the server and test the application!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;