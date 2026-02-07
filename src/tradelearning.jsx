import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './tradelearning.css';
import { MOCK_TRADE } from './constant';

const TradeLearning = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(MOCK_TRADE);
  const [customInstrumentEnabled, setCustomInstrumentEnabled] = useState(false);
  const [errors, setErrors] = useState({});

  const instruments = ['BTC/USD', 'EUR/USD', 'AAPL', 'NASDAQ', 'Custom'];
  const timeframes = ['1 minute','5 minutes','15 minutes','1 hour','4 hours','Daily'];

  function handleChange(e) {
    const { name, value, type } = e.target;
    setForm((s) => ({ ...s, [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value }));
  }

  function validate() {
    const err = {};
    if (!form.instrument) err.instrument = 'Instrument is required';
    if (!form.tradeType) err.tradeType = 'Trade type required';
    if (!form.timeframe) err.timeframe = 'Timeframe required';
    if (form.entryPrice === '' || form.entryPrice === undefined) err.entryPrice = 'Entry price required';
    if (form.exitPrice === '' || form.exitPrice === undefined) err.exitPrice = 'Exit price required';
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    // simulate submission and navigate
    navigate('/tradeanalysis', { state: { trade: form } });
  }

  return (
    <div className="tradelearning-page">
      <div className="page-header">
        <h1>Add a Trade for Learning</h1>
        <p className="subtitle">Submit a past trade to reflect on your decision-making and learn from general trading principles. This is for education only.</p>
      </div>

      <form className="trade-card" onSubmit={handleSubmit}>
        <section className="section">
          <h2>Trade Basics</h2>

          <label className="field">
            <span>Instrument</span>
            <select name="instrument" value={form.instrument} onChange={(e) => {
              handleChange(e);
              setCustomInstrumentEnabled(e.target.value === 'Custom');
            }}>
              <option value="">Select instrument</option>
              {instruments.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            {errors.instrument && <div className="field-error">{errors.instrument}</div>}
          </label>

          {customInstrumentEnabled && (
            <label className="field">
              <span>Custom instrument</span>
              <input name="customInstrument" value={form.customInstrument} onChange={handleChange} placeholder="e.g. SOL/USD" />
            </label>
          )}

          <label className="field">
            <span>Trade Type</span>
            <div className="radio-row">
              <label><input type="radio" name="tradeType" value="Buy" checked={form.tradeType === 'Buy'} onChange={handleChange} /> Buy</label>
              <label><input type="radio" name="tradeType" value="Sell" checked={form.tradeType === 'Sell'} onChange={handleChange} /> Sell</label>
            </div>
            {errors.tradeType && <div className="field-error">{errors.tradeType}</div>}
          </label>

          <label className="field">
            <span>Timeframe</span>
            <select name="timeframe" value={form.timeframe} onChange={handleChange}>
              <option value="">Select timeframe</option>
              {timeframes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.timeframe && <div className="field-error">{errors.timeframe}</div>}
          </label>
        </section>

        <section className="section">
          <h2>Trade Prices</h2>
          <label className="field">
            <span>Entry Price</span>
            <input type="number" name="entryPrice" value={form.entryPrice} onChange={handleChange} placeholder="e.g. 42000" />
            {errors.entryPrice && <div className="field-error">{errors.entryPrice}</div>}
          </label>

          <label className="field">
            <span>Exit Price</span>
            <input type="number" name="exitPrice" value={form.exitPrice} onChange={handleChange} placeholder="e.g. 41850" />
            {errors.exitPrice && <div className="field-error">{errors.exitPrice}</div>}
          </label>

          <label className="field">
            <span>Stop Loss</span>
            <input type="number" name="stopLoss" value={form.stopLoss} onChange={handleChange} placeholder="Optional but recommended" />
            <small className="helper">Using a stop loss helps manage risk.</small>
          </label>
        </section>

        <section className="section">
          <h2>Trade Planning</h2>
          <label className="field full">
            <span>Reason for Entering the Trade (optional)</span>
            <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="What made you enter this trade? (e.g. breakout, trend continuation, emotion, news)"></textarea>
          </label>
        </section>

        <section className="section">
          <h2>Optional Context</h2>
          <label className="field">
            <span>Upload trade screenshot (optional)</span>
            <input type="file" accept="image/*" name="screenshot" />
          </label>

          <label className="field full">
            <span>If no screenshot, describe what you observed on the chart.</span>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="If no screenshot, describe what you observed on the chart."></textarea>
          </label>
        </section>

        <div className="cta-row">
          <button type="submit" className="primary-btn">Reflect on This Trade</button>
        </div>

        <p className="safety">This feature provides educational reflections based on general trading principles. It does not provide financial advice or predict market outcomes.</p>
      </form>
    </div>
  );
};

export default TradeLearning;
