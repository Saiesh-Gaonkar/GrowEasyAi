import React, { useState } from "react";
import { translateText } from '../utils/translate';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'mr', label: 'Marathi' }
];

const AIAssessmentPage = () => {
  const [targetLang, setTargetLang] = useState('en');
  const [apiKey, setApiKey] = useState(''); // Set this from props or context if needed
  const [translatedAssessment, setTranslatedAssessment] = useState('');
  const [assessmentText, setAssessmentText] = useState(''); // Assuming you have some assessment text state

  const handleTranslateAssessment = async (text) => {
    if (targetLang === 'en') {
      setTranslatedAssessment(text);
      return;
    }
    try {
      setTranslatedAssessment('Translating...');
      const translated = await translateText(text, targetLang, apiKey);
      setTranslatedAssessment(translated);
    } catch (err) {
      setTranslatedAssessment('Translation failed.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">AI Assessment</h1>
      <p>Welcome to the AI Assessment page! Add your assessment content here.</p>
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="lang-select" className="text-sm">Translate assessment to:</label>
        <select id="lang-select" value={targetLang} onChange={e => setTargetLang(e.target.value)} className="border rounded px-2 py-1">
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
        <button className="btn-secondary" onClick={() => handleTranslateAssessment(assessmentText)}>
          Translate
        </button>
      </div>
      <div className="mt-2">
        <p className="text-gray-700 text-base">
          {translatedAssessment || assessmentText}
        </p>
      </div>
    </div>
  );
};

export default AIAssessmentPage;