import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Star
} from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${id}`);
        setJob(response.data.data.job);
        
        // Check if user has already applied
        if (isAuthenticated && user) {
          const applied = response.data.data.job.applicants?.some(
            applicant => applicant.user === user._id
          );
          setHasApplied(applied);
        }
      } catch (err) {
        setError('Job not found');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user, isAuthenticated]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/jobs/apply/${id}`);
      setHasApplied(true);
      alert('Application submitted successfully!');
    } catch (err) {
      alert('Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min, max) => {
    const formatAmount = (amount) => {
      if (amount >= 100000) {
        return `${(amount / 100000).toFixed(1)}L`;
      }
      return `${amount / 1000}K`;
    };
    return `₹${formatAmount(min)} - ₹${formatAmount(max)}`;
  };

  const getDaysLeft = (date) => {
    const days = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    if (days === 0) return 'Today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The job you are looking for does not exist.'}</p>
          <button 
            onClick={() => navigate('/jobs')}
            className="btn-primary"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={job.company.logo || 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?w=80'}
                  alt={job.company.name}
                  className="w-16 h-16 rounded-lg object-cover bg-white p-2"
                />
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <p className="text-xl opacity-90">{job.company.name}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location.city}, {job.location.state}</span>
                    </div>
                    {job.location.isRemote && (
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                        Remote
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold mb-1">
                  {formatSalary(job.salary.min, job.salary.max)}
                </div>
                <div className="text-sm opacity-80">per year</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Building className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-semibold">{job.location.workType}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Briefcase className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Experience</div>
                    <div className="font-semibold">{job.experience.min}-{job.experience.max} years</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Education</div>
                    <div className="font-semibold">{job.education}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Deadline</div>
                    <div className="font-semibold">{getDaysLeft(job.applicationDeadline)}</div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About the Role</h2>
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                  <ul className="space-y-2">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Info */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About {job.company.name}</h2>
                  <p className="text-gray-700 leading-relaxed">{job.company.about}</p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Apply Button */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  {hasApplied ? (
                    <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2" disabled>
                      <CheckCircle className="h-5 w-5" />
                      <span>Applied</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full btn-primary py-3 disabled:opacity-50"
                    >
                      {applying ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      <button 
                        onClick={() => navigate('/login')}
                        className="text-primary-600 hover:underline"
                      >
                        Login
                      </button> to apply for this job
                    </p>
                  )}
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred Skills */}
                {job.preferredSkills && job.preferredSkills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Preferred Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.preferredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Benefits</h3>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Job Stats */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Job Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applications:</span>
                      <span className="font-medium">{job.applicants?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span className="font-medium">{job.views || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted:</span>
                      <span className="font-medium">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage; 