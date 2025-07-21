import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Briefcase, Brain, Users, Star, TrendingUp, MapPin, Zap, Target, Award, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AITutorChatWindow from '../components/AITutorChatWindow'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Get personalized tutoring with our advanced AI that understands your learning style and pace.',
      color: 'text-primary-600'
    },
    {
      icon: Target,
      title: 'Career Assessment',
      description: 'Discover your ideal career path through comprehensive AI-driven personality and skills analysis.',
      color: 'text-secondary-600'
    },
    {
      icon: Briefcase,
      title: 'Smart Job Matching',
      description: 'Find jobs that perfectly match your skills, location, and career goals with intelligent recommendations.',
      color: 'text-accent-600'
    },
    {
      icon: BookOpen,
      title: 'Interactive Courses',
      description: 'Learn through engaging modules, quizzes, and hands-on projects designed for Indian students.',
      color: 'text-purple-600'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Students Enrolled', icon: Users },
    { number: '500+', label: 'Courses Available', icon: BookOpen },
    { number: '2,000+', label: 'Job Opportunities', icon: Briefcase },
    { number: '95%', label: 'Success Rate', icon: TrendingUp }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Indore, MP',
      text: 'GrowEasyAI helped me transition from commerce to tech. The AI career assessment was spot-on!',
      rating: 5,
      course: 'Web Development'
    },
    {
      name: 'Rahul Kumar',
      location: 'Patna, Bihar',
      text: 'The AI tutor is amazing! It explains concepts in simple Hindi-English mix that I understand perfectly.',
      rating: 5,
      course: 'Digital Marketing'
    },
    {
      name: 'Sneha Patel',
      location: 'Rajkot, Gujarat',
      text: 'Got my first job through their job matching system. The salary was exactly what they predicted!',
      rating: 5,
      course: 'Data Science'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your AI-Powered Path to
              <span className="block text-yellow-300">Success in India</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Bridging the education-employment gap for students in Tier-2 & Tier-3 cities with personalized AI guidance, career assessment, and job matching.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up animation-delay-200">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Start Your Journey
                  <ArrowRight className="inline ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/courses"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
                >
                  Explore Courses
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRight className="inline ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/assessment"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-secondary-600 transition-all duration-200"
                >
                  Take AI Assessment
                </Link>
              </>
            )}
          </div>

          {/* Enhanced AI Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white animate-bounce-gentle">
            <Zap className="h-5 w-5 text-yellow-300" />
            <span className="font-medium">Powered by Advanced OpenAI Technology</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose GrowEasyAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge AI technology with deep understanding of the Indian job market to provide personalized guidance for your success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card text-center hover:scale-105 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Success Journey in 3 Steps
            </h2>
            <p className="text-xl text-gray-600">
              Simple, guided process to transform your career prospects
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Take AI Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete our comprehensive personality and skills assessment powered by advanced AI to understand your strengths and interests.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-600 text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Personalized Plan</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive AI-generated career recommendations, learning paths, and course suggestions tailored specifically for your profile and location.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-600 text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Land Your Dream Job</h3>
              <p className="text-gray-600 leading-relaxed">
                Apply for jobs matched to your skills and location, with AI-powered application tips and interview preparation guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Across India
            </h2>
            <p className="text-xl text-gray-600">
              Real students, real results from Tier-2 and Tier-3 cities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {testimonial.location}
                  </div>
                  <div className="text-sm text-primary-600 font-medium mt-1">
                    {testimonial.course} Graduate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Globe className="h-16 w-16 mx-auto mb-6 text-primary-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl mb-8 text-primary-100 leading-relaxed">
            Join thousands of students from Tier-2 and Tier-3 cities who are building successful careers with AI-powered guidance. Your journey to success starts here.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Free Today
                <ArrowRight className="inline ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/courses"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                Explore Courses
              </Link>
            </div>
          ) : (
            <Link
              to="/assessment"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center"
            >
              Take Your AI Assessment
              <Brain className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* AI Tutor Chat Window */}
      <AITutorChatWindow />
    </div>
  )
}

export default HomePage