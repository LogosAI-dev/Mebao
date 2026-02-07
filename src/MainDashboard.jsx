import React from 'react';  
import { KPIS } from './constant';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './MainDashboard.css';

const chartData = [
  { name: 'M', p: 20 }, { name: 'T', p: 35 }, { name: 'W', p: 25 }, 
  { name: 'T', p: 55 }, { name: 'F', p: 40 }, { name: 'S', p: 75 }, { name: 'S', p: 90 }
];

const MainDashboard = ({ profile }) => {
  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <div className="welcome-text">
          <h1>Hey, {profile.name}! 👋</h1>
          <p>MeBao is currently "Vibrating Yellow" – ready to trade!</p>
        </div>
        <div className="action-buttons">
          <Link to="/lessons" className="neon-btn-pink">Continue Learning</Link>
          <Link to="/tradelearning" className="neon-btn-orange">Learn from a Trade</Link>
        </div>
      </header>

      <div className="kpi-grid">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className={`kpi-card neon-border-${kpi.color}`}>
            <span className="kpi-icon">{kpi.icon}</span>
            <div className="kpi-content">
              <p className="kpi-value">{kpi.value}</p>
              <p className="kpi-label">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="main-chart glass-card">
          <div className="card-header">
            <h3>Knowledge Momentum</h3>
            <span className="badge">UP +12%</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bf00ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#bf00ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{backgroundColor: '#203354', border: 'none', borderRadius: '12px'}}
                   itemStyle={{color: '#ff00ff'}}
                />
                <Area type="monotone" dataKey="p" stroke="#bf00ff" fillOpacity={1} fill="url(#colorP)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="history-card glass-card">
          <h3>Recent Insights</h3>
          <div className="history-list">
            {[
              { t: 'Pips & Points', d: 'Today', c: 'pink' },
              { t: 'Bullish Engulfing', d: 'Yesterday', c: 'orange' },
              { t: 'Mental Stop Loss', d: '2 days ago', c: 'purple' }
            ].map((h, i) => (
              <div key={i} className="history-item">
                <div className={`indicator bg-${h.c}`}></div>
                <div className="item-info">
                  <p className="item-title">{h.t}</p>
                  <p className="item-date">{h.d}</p>
                </div>
                <Link to="/ai-doll" className="view-btn">➔</Link>
              </div>
            ))}
          </div>
          <button className="expand-btn">View All History</button>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
