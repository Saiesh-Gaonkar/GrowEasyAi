import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import AITutorChatWindow from '../components/AITutorChatWindow';

const JobsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobRecs, setJobRecs] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeInput, setResumeInput] = useState({ name: user?.name || '', email: user?.email || '', education: '', experience: '', skills: '' });
  const [resumeResult, setResumeResult] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (isAuthenticated && user?.role === 'student') {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/user/recommendations`);
          setJobRecs(res.data.data.recommendations || []);
          setRecommendedCourses(res.data.data.recommendedCourses || []);
        } else {
          // For unauthenticated users, fetch general jobs and popular courses
          const jobsRes = await axios.get(`${import.meta.env.VITE_API_URL}/jobs?limit=6`);
          setJobRecs(jobsRes.data.data.jobs || []);
          const coursesRes = await axios.get(`${import.meta.env.VITE_API_URL}/courses?limit=6`);
          setRecommendedCourses(coursesRes.data.data.courses || []);
        }
      } catch (err) {
        setJobRecs([]);
        setRecommendedCourses([]);
      }
      setLoading(false);
    };
    fetchRecommendations();
  }, [isAuthenticated, user]);

  const handleResumeBuild = async (e) => {
    e.preventDefault();
    setResumeLoading(true);
    setResumeResult('');
    try {
      const prompt = `Build a professional resume for the following details:\nName: ${resumeInput.name}\nEmail: ${resumeInput.email}\nEducation: ${resumeInput.education}\nExperience: ${resumeInput.experience}\nSkills: ${resumeInput.skills}`;
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/ai/chat`, { message: prompt, context: 'resume_builder' });
      setResumeResult(res.data.data.response);
    } catch (err) {
      setResumeResult('Failed to generate resume. Please try again.');
    }
    setResumeLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading jobs portal...</div>;
  }

  // Student view
  if (isAuthenticated && user?.role === 'student') {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Recommended Jobs & Projects</h1>
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Skill-Building Projects</h2>
          {jobRecs.length === 0 ? (
            <p>No recommended projects found. Update your profile skills for better matches!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobRecs.map(job => (
                <div key={job._id} className="card p-4 border rounded-lg shadow hover:shadow-lg transition">
                  <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company?.name || 'Project'}</p>
                  <div className="mb-2 text-sm text-gray-500">{job.location?.city || 'Remote'}</div>
                  <div className="mb-2 text-xs text-primary-600">{job.matchScore}% match</div>
                  <a href={`/jobs/${job._id}`} className="text-blue-600 hover:underline text-sm">View Details</a>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recommended Courses to Build Your Skills</h2>
          {recommendedCourses.length === 0 ? (
            <p>No recommended courses found. Update your profile skills for better matches!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">AI Resume Builder</h2>
          <button className="btn-primary mb-4" onClick={() => setShowResumeModal(true)}>Build Resume with AI</button>
          {showResumeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowResumeModal(false)}>&times;</button>
                <h3 className="text-xl font-bold mb-4">AI Resume Builder</h3>
                <form onSubmit={handleResumeBuild} className="space-y-3">
                  <input className="w-full border rounded px-3 py-2" placeholder="Name" value={resumeInput.name} onChange={e => setResumeInput({ ...resumeInput, name: e.target.value })} required />
                  <input className="w-full border rounded px-3 py-2" placeholder="Email" value={resumeInput.email} onChange={e => setResumeInput({ ...resumeInput, email: e.target.value })} required />
                  <input className="w-full border rounded px-3 py-2" placeholder="Education" value={resumeInput.education} onChange={e => setResumeInput({ ...resumeInput, education: e.target.value })} required />
                  <input className="w-full border rounded px-3 py-2" placeholder="Experience" value={resumeInput.experience} onChange={e => setResumeInput({ ...resumeInput, experience: e.target.value })} required />
                  <input className="w-full border rounded px-3 py-2" placeholder="Skills (comma separated)" value={resumeInput.skills} onChange={e => setResumeInput({ ...resumeInput, skills: e.target.value })} required />
                  <button type="submit" className="btn-primary w-full" disabled={resumeLoading}>{resumeLoading ? 'Generating...' : 'Generate Resume'}</button>
                </form>
                {resumeResult && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Generated Resume:</h4>
                    <textarea className="w-full border rounded p-2 text-sm" rows={10} value={resumeResult} readOnly />
                    <button className="btn-secondary mt-2" onClick={() => navigator.clipboard.writeText(resumeResult)}>Copy Resume</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Employer view
  if (isAuthenticated && (user.role === 'admin' || user.role === 'employer')) {
    return (
      <div className="py-12 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Employer Jobs Portal</h1>
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Post a Job or Internship</h2>
          <Link to="/jobs/post" className="btn-primary">Post a New Job</Link>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upskill Your Team</h2>
          <p className="mb-4">Browse recommended courses to help your employees grow their skills:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard course={{ title: 'Leadership Essentials', description: 'Develop leadership skills for team success.', category: 'Business', level: 'Intermediate', rating: 4.7, enrolledStudents: 1200, thumbnail: '', price: 0, isFree: true }} />
            <CourseCard course={{ title: 'Effective Communication', description: 'Improve communication skills for the workplace.', category: 'Business', level: 'Beginner', rating: 4.8, enrolledStudents: 900, thumbnail: '', price: 0, isFree: true }} />
            <CourseCard course={{ title: 'Project Management', description: 'Master project management fundamentals.', category: 'Business', level: 'Advanced', rating: 4.6, enrolledStudents: 800, thumbnail: '', price: 0, isFree: true }} />
          </div>
        </div>
      </div>
    );
  }

  // Public/unauthenticated view
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Jobs & Projects</h1>
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Featured Jobs & Projects</h2>
        {jobRecs.length === 0 ? (
          <p>No jobs or projects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobRecs.map(job => (
              <div key={job._id} className="card p-4 border rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.company?.name || 'Project'}</p>
                <div className="mb-2 text-sm text-gray-500">{job.location?.city || 'Remote'}</div>
                <a href={`/jobs/${job._id}`} className="text-blue-600 hover:underline text-sm">View Details</a>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Popular Courses</h2>
        {recommendedCourses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
      <AITutorChatWindow />
    </div>
  );
};

export default JobsPage; 