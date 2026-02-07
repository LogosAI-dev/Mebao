
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './LessonsDetail.css';

const LessonsDetail = () => {
  const { id } = useParams();
  const [quizMode, setQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = [
    { q: "Risk per trade should ideally be...", opts: ["1-2%", "50%", "10%", "All in"], ans: 0 },
    { q: "A Stop Loss protects you from...", opts: ["Profit", "Unlimited Loss", "Taxes", "Winning"], ans: 1 },
    { q: "MeBao turns Orange when the market is...", opts: ["Volatile", "Closed", "Boring", "Flat"], ans: 0 }
  ];

  const handleAnswer = (idx) => {
    if (idx === questions[currentQ].ans) setScore(s => s + 1);
    if (currentQ < questions.length - 1) setCurrentQ(q => q + 1);
    else setFinished(true);
  };

  return (
    <div className="lesson-detail">
      <Link to="/lessons" className="back-link">← Roadmap</Link>
      
      {!quizMode ? (
        <div className="content-container">
          <header>
            <span className="category">Psychology</span>
            <h1>Managing Your Emotions</h1>
          </header>
          
          <div className="prose glass-card">
            <h2>The "Fear & Greed" Cycle</h2>
            <p>Trading isn't just about math; it's about your brain! When you see green, you get excited (Greed). When you see red, you get scared (Fear).</p>
            
            <div className="interactive-example">
               <div className="emoji-row">😱 ➔ 🤖 ➔ 😎</div>
               <p>MeBao helps you stay in the <strong>Robot Phase</strong> – calm and logical.</p>
            </div>

            <h3>MeBao Doll Integration</h3>
            <p>Your doll will pulse <strong>Blue</strong> when you are trading too fast. This is a reminder to breathe and re-evaluate your setup.</p>
            
            <button onClick={() => setQuizMode(true)} className="neon-btn-purple start-quiz">Start Assessment Quiz</button>
          </div>
        </div>
      ) : finished ? (
        <div className="quiz-finished glass-card">
          <h2>Level Complete! 🎊</h2>
          <div className="score-circle">{score}/{questions.length}</div>
          <p>MeBao is glowing Gold! You've unlocked the next tier of trading knowledge.</p>
          <Link to="/lessons" className="neon-btn-pink">Return to Roadmap</Link>
        </div>
      ) : (
        <div className="quiz-container glass-card">
          <div className="progress-bar"><div style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div></div>
          <h2>{questions[currentQ].q}</h2>
          <div className="options">
            {questions[currentQ].opts.map((o, i) => (
              <button key={i} onClick={() => handleAnswer(i)}>{o}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsDetail;
