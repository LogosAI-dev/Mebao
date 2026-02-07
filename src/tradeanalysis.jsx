import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './tradeanalysis.css';
import { SUGGESTED_LESSONS } from './constant';

const TradeAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const trade = (location.state && location.state.trade) || null;

  // helper derivations
  const instrument = trade ? (trade.instrument === 'Custom' ? trade.customInstrument || 'Custom' : trade.instrument) : '—';
  const tradeType = trade ? trade.tradeType : '—';
  const timeframe = trade ? trade.timeframe : '—';
  const entry = trade ? trade.entryPrice : '—';
  const exit = trade ? trade.exitPrice : '—';
  const stop = trade && trade.stopLoss ? trade.stopLoss : null;

  const positivePoints = [];
  const reflectionPoints = [];

  if (trade) {
    if (trade.stopLoss) positivePoints.push('Stop loss was defined');
    if (trade.reason && trade.reason.length > 10) positivePoints.push('Trade reasoning documented');
    if (trade.entryPrice && trade.exitPrice) positivePoints.push('Entry and exit were recorded');

    // reflection heuristics
    if (trade.stopLoss && Math.abs(trade.entryPrice - trade.stopLoss) < Math.abs(trade.entryPrice - trade.exitPrice) * 0.25) {
      reflectionPoints.push('Stop loss was relatively close to entry');
    }
    if (!trade.reason || trade.reason.trim().length < 5) reflectionPoints.push('Trade reasoning was not well documented');
    const risk = trade.stopLoss ? Math.abs(trade.entryPrice - trade.stopLoss) : null;
    const reward = Math.abs(trade.exitPrice - trade.entryPrice);
    if (risk && reward && reward / risk < 1.5) reflectionPoints.push('Risk–reward ratio appears unfavourable');
  }

  return (
    <div className="tradeanalysis-page">
      <div className="page-header">
        <h1>Trade Reflection & Learning Insights</h1>
        <p className="subtitle">This reflection focuses on decision-making and learning, not trade outcomes.</p>
      </div>

      <div className="overview-card card">
        <h2>Trade Overview</h2>
        <p className="overview-line">You placed a {tradeType} trade on {instrument} on a {timeframe} timeframe with a defined entry and exit.</p>
        <div className="overview-grid">
          <div><strong>Instrument</strong><div>{instrument}</div></div>
          <div><strong>Type</strong><div>{tradeType}</div></div>
          <div><strong>Timeframe</strong><div>{timeframe}</div></div>
          <div><strong>Entry</strong><div>{entry}</div></div>
          <div><strong>Exit</strong><div>{exit}</div></div>
          <div><strong>Stop Loss</strong><div>{stop || '—'}</div></div>
        </div>
      </div>

      <div className="observations-row">
        <div className="card obs-card">
          <h3>What Was Planned Well</h3>
          {positivePoints.length ? (
            <ul>{positivePoints.map((p,i) => <li key={i}>{p}</li>)}</ul>
          ) : (
            <p>No clear planning strengths were identified in this trade.</p>
          )}
        </div>

        <div className="card obs-card">
          <h3>Areas to Reflect On</h3>
          {reflectionPoints.length ? (
            <ul>{reflectionPoints.map((p,i) => <li key={i}>{p}</li>)}</ul>
          ) : (
            <p>No obvious areas to reflect on from the provided details.</p>
          )}
        </div>
      </div>

      <div className="teachable card">
        <h3>Teachable Moment</h3>
        <p>A favourable risk–reward ratio allows traders to remain profitable even when not every trade wins. Planning this before entry helps improve long-term consistency.</p>
      </div>

      <div className="one-action card">
        <h3>One Action to Try Next Time</h3>
        <p>Before entering your next trade, define a stop loss that allows at least a 1:2 risk–reward ratio.</p>
      </div>

      <div className="suggested card">
        <h3>Suggested Learning Path</h3>
        <div className="lessons-grid">
          {SUGGESTED_LESSONS.map((l) => (
            <div className="lesson-card" key={l.id}>
              <h4>{l.title}</h4>
              <p>{l.desc}</p>
              <div className="lesson-actions">
                <button onClick={() => navigate('/lessons')} className="learn-btn">Learn This</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="visual card">
        <h3>Illustrative Trade Visualisation</h3>
        <div className="chart-placeholder">
          <div className="marker entry">Entry point</div>
          <div className="marker exit">Exit point</div>
          <div className="marker stop">Suggested stop buffer</div>
        </div>
        <p className="chart-note">This visualisation is illustrative and for educational purposes only.</p>
      </div>

      <p className="footer-disclaimer">This reflection is based on general trading principles and is intended for educational purposes only. It does not predict market behaviour or guarantee outcomes.</p>
    </div>
  );
};

export default TradeAnalysis;
