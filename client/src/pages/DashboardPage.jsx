import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Briefcase, 
  Brain, 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  Users,
  Star,
  ArrowRight,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import AITutorChatWindow from '../components/AITutorChatWindow'

const DashboardPage = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    enrolledCourses: [],
    appliedJobs: [],
    recommendations: [],
    insights: null,
    loading: true
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, jobsRes, insightsRes] = await Promise.allSettled([
        axios.get(`${import.meta.env.VITE_API_URL}/courses/user/enrolled`),
        axios.get(`${import.meta.env.VITE_API_URL}/jobs/user/applications`),
        axios.get(`${import.meta.env.VITE_API_URL}/ai/insights`).catch(() => ({ data: { data: null } }))
      ])

      setDashboardData({
        enrolledCourses: coursesRes.status === 'fulfilled' ? coursesRes.value.data.data : [],
        appliedJobs: jobsRes.status === 'fulfilled' ? jobsRes.value.data.data : [],
        insights: insightsRes.status === 'fulfilled' ? insightsRes.value.data.data : null,
        loading: false
      })
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
      setDashboardData(prev => ({ ...prev, loading: false }))
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const stats = [
    {
      title: 'Courses Enrolled',
      value: dashboardData.enrolledCourses.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Jobs Applied',
      value: dashboardData.appliedJobs.length,
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Skills Learned',
      value: user?.profile?.skills?.length || 0,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Profile Completion',
      value: `${user?.assessmentResults ? 85 : 45}%`,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back to your learning journey. Here's your progress overview.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg">
              <Zap className="h-5 w-5" />
              <span className="font-medium">AI-Powered Dashboard</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card text-center hover:scale-105 transition-all duration-200">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-lg mb-4`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            )
          })}
        </div>

        {/* Assessment CTA */}
        {!user?.assessmentResults && (
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Complete Your AI Career Assessment</h3>
                <p className="text-primary-100 mb-4">
                  Unlock personalized career recommendations and learning paths with our advanced AI analysis.
                </p>
                <Link
                  to="/assessment"
                  className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Take Assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
              <div className="hidden md:block">
                <Brain className="h-24 w-24 text-primary-200" />
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enrolled Courses */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  My Courses
                </h2>
                <Link
                  to="/courses"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                >
                  Browse All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {dashboardData.enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.enrolledCourses.slice(0, 3).map((course, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <span className="text-sm text-gray-500">{course.category}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{course.enrollmentData?.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(course.enrollmentData?.progress || 0)}`}
                              style={{ width: `${course.enrollmentData?.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <Link
                          to={`/courses/${course._id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          Continue
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                  <Link
                    to="/courses"
                    className="btn-primary inline-flex items-center"
                  >
                    Explore Courses
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              )}
            </div>

            {/* Job Applications */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                  Job Applications
                </h2>
                <Link
                  to="/jobs"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                >
                  Find Jobs
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {dashboardData.appliedJobs.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.appliedJobs.slice(0, 3).map((job, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.applicationData?.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                          job.applicationData?.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                          job.applicationData?.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                          job.applicationData?.status === 'Selected' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {job.applicationData?.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{job.company?.name}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Applied {new Date(job.applicationData?.appliedAt).toLocaleDateString()}</span>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't applied to any jobs yet.</p>
                  <Link
                    to="/jobs"
                    className="btn-primary inline-flex items-center"
                  >
                    Find Jobs
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            {dashboardData.insights && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  AI Insights
                </h3>
                <div className="space-y-4 text-sm">
                  {dashboardData.insights.learningRecommendations && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Learning Recommendations</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {dashboardData.insights.learningRecommendations.substring(0, 150)}...
                      </p>
                    </div>
                  )}
                  {dashboardData.insights.jobSearchTips && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Job Search Tips</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {dashboardData.insights.jobSearchTips.substring(0, 150)}...
                      </p>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <span className="text-xs text-gray-500">
                      Powered by {dashboardData.insights.aiProvider || 'AI'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/assessment"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Brain className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium text-gray-900">AI Assessment</span>
                </Link>
                <Link
                  to="/courses"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Browse Courses</span>
                </Link>
                <Link
                  to="/jobs"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Briefcase className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">Find Jobs</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Users className="h-5 w-5 text-orange-600 mr-3" />
                  <span className="font-medium text-gray-900">Update Profile</span>
                </Link>
              </div>
            </div>

            {/* Achievement Badge */}
            {user?.assessmentResults && (
              <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
                <div className="text-center">
                  <Award className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Assessment Complete!</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    You've completed your AI career assessment. Your personality type: 
                    <span className="font-medium text-primary-600 ml-1">
                      {user.assessmentResults.personalityType}
                    </span>
                  </p>
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    Profile 85% Complete
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Tutor Chat Window */}
      <AITutorChatWindow />
    </div>
  )
}

export default DashboardPage