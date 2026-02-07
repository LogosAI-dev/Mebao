import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Onboarding from './OnboardingPage';
import MainDashboard from './MainDashboard';
import AIDollPage from './AIDollPage';
import LessonsPage from './LessonPage';
import LessonsDetail from './LessonsDetail'; 
import TradeLearning from './tradelearning';
import TradeAnalysis from './tradeanalysis';
import './App.css';

// Sidebar component
const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/lessons', label: 'Lessons', icon: '📚' },
    { path: '/tradelearning', label: 'Learn from a trade', icon: '📈' },
    { path: '/ai-doll', label: 'AI Companion', icon: '🤖' },
  ];

  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">M</div>
        <h1 className="logo-text">MeBao</h1>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="user-profile-mini">
        <div className="user-avatar">User</div>
        <div className="user-info">
          <p className="user-name">Kishant R</p>
          <p className="user-status">Student</p>
        </div>
      </div>
    </div>
  );
};

// Layout component
const Layout = ({ children }) => {
  const location = useLocation();
  if (location.pathname === '/onboarding') return <>{children}</>;
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

// App component
const App = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('mebao_profile');
    return saved
      ? JSON.parse(saved)
      : {
          name: '',
          experience: 'Beginner',
          instruments: [],
          goal: '',
          deviceId: '',
          hasOnboarded: false
        };
  });

  // Persist profile
  useEffect(() => {
    localStorage.setItem('mebao_profile', JSON.stringify(profile));
  }, [profile]);

  // 🔥 RESET ONLY WHEN ENTERING ONBOARDING
  const handleOnboardingEntry = () => {
    localStorage.removeItem('mebao_profile');
    setProfile({
      name: '',
      experience: 'Beginner',
      instruments: [],
      goal: '',
      deviceId: '',
      hasOnboarded: false
    });
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={profile.hasOnboarded ? "/onboarding" : "/dashboard"} />}
          />

          <Route
            path="/onboarding"
            element={
              <Onboarding
                profile={profile}
                setProfile={setProfile}
                onEnter={handleOnboardingEntry}
              />
            }
          />

          <Route
            path="/dashboard"
            element={profile.hasOnboarded ? <MainDashboard profile={profile} /> : <Navigate to="/onboarding" />}
          />

          <Route
            path="/ai-doll"
            element={profile.hasOnboarded ? <AIDollPage profile={profile} /> : <Navigate to="/onboarding" />}
          />

          <Route
            path="/tradelearning"
            element={profile.hasOnboarded ? <TradeLearning /> : <Navigate to="/onboarding" />}
          />

          <Route
            path="/tradeanalysis"
            element={profile.hasOnboarded ? <TradeAnalysis /> : <Navigate to="/onboarding" />}
          />

          <Route
            path="/lessons"
            element={profile.hasOnboarded ? <LessonsPage /> : <Navigate to="/onboarding" />}
          />

          <Route
            path="/lessons/:id"
            element={profile.hasOnboarded ? <LessonsDetail /> : <Navigate to="/onboarding" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
