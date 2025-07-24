import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  ArrowLeft,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  Play,
  CheckCircle,
  AlertCircle,
  User,
  Calendar
} from 'lucide-react';
import { translateText } from '../utils/translate';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'mr', label: 'Marathi' }
];

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [apiKey, setApiKey] = useState(''); // Set this from props or context if needed
  const [translatedContent, setTranslatedContent] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/courses/${id}`);
        setCourse(response.data.data.course);
        
        // Check if user is enrolled
        if (isAuthenticated && user) {
          const enrolled = user.enrolledCourses?.some(
            enrollment => enrollment.course === id
          );
          setIsEnrolled(enrolled);
        }
      } catch (err) {
        setError('Course not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/courses/enroll/${id}`);
      setIsEnrolled(true);
      alert('Successfully enrolled in course!');
    } catch (err) {
      alert('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleTranslateContent = async () => {
    if (targetLang === 'en') {
      setTranslatedContent(course.description);
      return;
    }
    try {
      setTranslatedContent('Translating...');
      const translated = await translateText(course.description, targetLang, apiKey);
      setTranslatedContent(translated);
    } catch (err) {
      setTranslatedContent('Translation failed.');
    }
  };

  const getDifficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The course you are looking for does not exist.'}</p>
          <button 
            onClick={() => navigate('/courses')}
            className="btn-primary"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Course Header */}
              <div className="relative">
                <img
                  src={course.thumbnail || 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?w=800'}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all duration-200">
                    <Play className="h-8 w-8 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                {/* Course Title and Meta */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                      {course.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <label htmlFor="lang-select" className="text-sm">Translate course description to:</label>
                    <select id="lang-select" value={targetLang} onChange={e => setTargetLang(e.target.value)} className="border rounded px-2 py-1">
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                      ))}
                    </select>
                    <button className="btn-secondary" onClick={handleTranslateContent}>Translate</button>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {translatedContent || course.description}
                  </p>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-semibold">{course.duration}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Students</div>
                    <div className="font-semibold">{course.enrolledStudents}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Star className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Rating</div>
                    <div className="font-semibold">{course.rating}/5</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Modules</div>
                    <div className="font-semibold">{course.modules?.length || 0}</div>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Prerequisites</h2>
                    <ul className="space-y-2">
                      {course.prerequisites.map((prerequisite, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="h-2 w-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700">{prerequisite}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Course Modules */}
                {course.modules && course.modules.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
                    <div className="space-y-3">
                      {course.modules.map((module, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {module.order}. {module.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{module.duration}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{module.description}</p>
                          {module.quiz && module.quiz.length > 0 && (
                            <div className="mt-2 flex items-center space-x-2 text-sm text-primary-600">
                              <Award className="h-4 w-4" />
                              <span>{module.quiz.length} quiz questions</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructor Info */}
                <div className="border-t pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Instructor</h2>
                  <div className="flex items-start space-x-4">
                    <img
                      src={course.instructor.avatar || 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=100'}
                      alt={course.instructor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {course.instructor.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(course.instructor.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {course.instructor.rating}/5
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{course.instructor.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">Free</div>
              </div>

              {/* Enroll Button */}
              {isEnrolled ? (
                <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 mb-4" disabled>
                  <CheckCircle className="h-5 w-5" />
                  <span>Enrolled</span>
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full btn-primary py-3 mb-4 disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-primary-600 hover:underline"
                  >
                    Login
                  </button> to enroll in this course
                </p>
              )}

              {/* Course Features */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Self-paced learning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>Community support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Lifetime access</span>
                </div>
              </div>

              {/* Share */}
              <div className="border-t pt-4 mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Share this course</h4>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors duration-200">
                    Facebook
                  </button>
                  <button className="flex-1 bg-blue-400 text-white py-2 px-3 rounded text-sm hover:bg-blue-500 transition-colors duration-200">
                    Twitter
                  </button>
                  <button className="flex-1 bg-blue-700 text-white py-2 px-3 rounded text-sm hover:bg-blue-800 transition-colors duration-200">
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;