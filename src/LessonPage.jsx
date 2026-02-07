
import React from 'react';
import { MOCK_LESSONS } from './constant';
import { Link } from 'react-router-dom';
import './LessonPage.css';

const LessonsPage = () => {
  return (
    <div className="lessons-view">
      <header className="lessons-header">
        <h1>Your Learning Roadmap</h1>
        <p>Master the markets, one level at a time.</p>
      </header>

      <div className="lessons-grid">
        {MOCK_LESSONS.map((lesson) => (
          <Link 
            key={lesson.id} 
            to={lesson.status === 'locked' ? '#' : `/lessons/${lesson.id}`}
            className={`lesson-card glass-card ${lesson.status}`}
            style={{ '--accent': lesson.color }}
          >
            <div className="lesson-top">
              <span className="lesson-badge">{lesson.status.toUpperCase()}</span>
              <span className="lesson-time">{lesson.duration}</span>
            </div>
            <h3>{lesson.title}</h3>
            <p>Master the logic behind {lesson.title.toLowerCase()} and boost your performance.</p>
            <div className="lesson-footer">
              <span className="xp-tag">Earn 500 XP</span>
              <span className="arrow">➔</span>
            </div>
            {lesson.status === 'locked' && <div className="lock-overlay">🔒</div>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
