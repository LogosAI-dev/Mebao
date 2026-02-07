
import React, { useState } from 'react';
import { INITIAL_ASSESSMENT } from './constant';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.css';

const Onboarding = ({ profile, setProfile }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleAssessmentSubmit = () => {
    setProfile({ ...profile, hasOnboarded: true });
    navigate('/dashboard');
  };

  const toggleInstrument = (inst) => {
    // Allow only one selection at a time
    const isSelected = profile.instruments.includes(inst);
    const newInsts = isSelected ? [] : [inst];
    setProfile({ ...profile, instruments: newInsts });
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card glass-card">
        {step === 1 ? (
          <form onSubmit={handleProfileSubmit} className="onboarding-form">
            <header className="onboarding-header">
              <h1>Welcome to <span>MeBao</span></h1>
              <p>Personalize your AI Trading Doll</p>
            </header>

            <div className="input-group">
              <label>Your Name</label>
              <input
                required
                type="text"
                placeholder="How should MeBao call you?"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Experience Level</label>
              <div className="level-grid">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`level-btn ${profile.experience === level ? 'selected' : ''}`}
                    onClick={() => setProfile({ ...profile, experience: level })}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label>What do you want to trade?</label>
              <div className="chips-grid">
                {['Forex', 'Crypto', 'Stocks', 'Options'].map((inst) => (
                  <button
                    key={inst}
                    type="button"
                    className={`chip ${profile.instruments.includes(inst) ? 'active' : ''}`}
                    onClick={() => toggleInstrument(inst)}
                  >
                    {inst}
                  </button>
                ))}
              </div>
              {profile.instruments && profile.instruments.length > 0 && (
                <div className="input-group">
                  <label>Tell us more (optional)</label>
                  <input
                    type="text"
                    placeholder={`Describe your interest in ${profile.instruments[0]}`}
                    value={profile.instrumentDetail || ''}
                    onChange={(e) => setProfile({ ...profile, instrumentDetail: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="input-group">
              <label>Your Trading Goal</label>
              <textarea
                placeholder="What's your dream? (e.g. Save for a bike, Learn finance...)"
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>MeBao Device ID</label>
              <input
                required
                type="text"
                placeholder="MB-XXXX-XXXX"
                value={profile.deviceId}
                onChange={(e) => setProfile({ ...profile, deviceId: e.target.value })}
                className="mono-input"
              />
            </div>

            <button type="submit" className="neon-btn-pink w-full">Start Assessment</button>
          </form>
        ) : (
          <div className="assessment-container">
            <header className="onboarding-header">
              <h1>Quick Assessment</h1>
              <p>Let's check your knowledge!</p>
            </header>

            <div className="questions-list">
              {INITIAL_ASSESSMENT.map((q, idx) => (
                <div key={q.id} className="question-item">
                  <h3>{idx + 1}. {q.question}</h3>
                  <div className="options-grid">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        className={`option-btn ${answers[q.id] === optIdx ? 'selected' : ''}`}
                        onClick={() => setAnswers({ ...answers, [q.id]: optIdx })}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAssessmentSubmit}
              disabled={Object.keys(answers).length < INITIAL_ASSESSMENT.length}
              className={`neon-btn-orange w-full ${Object.keys(answers).length < INITIAL_ASSESSMENT.length ? 'disabled' : ''}`}
            >
              Finish Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
