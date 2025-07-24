import React, { useState } from 'react';
import axios from 'axios';

const ResumeBuilder = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [resumeInput, setResumeInput] = useState({
    name: user?.name || '',
    email: user?.email || '',
    education: '',
    experience: '',
    skills: ''
  });
  const [resumeResult, setResumeResult] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);

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

  return (
    <div>
      <button className="btn-primary mb-4" onClick={() => setShowModal(true)}>Build Resume with AI</button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
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
  );
};

export default ResumeBuilder; 