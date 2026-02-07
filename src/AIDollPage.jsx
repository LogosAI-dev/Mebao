import React, { useState, useRef, useEffect } from 'react';
import { LogosClient } from '@aidoll/logos-sdk';
import './AIDollPage.css';

const SERVER_URL = import.meta.env.VITE_LOGOS_SERVER_URL;
const API_KEY = import.meta.env.VITE_LOGOS_API_KEY;
const DEVICE_ID = import.meta.env.VITE_LOGOS_DEVICE_ID;

const AIDollPage = ({ profile }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sdkStatus, setSdkStatus] = useState('DISCONNECTED');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const scrollRef = useRef(null);
  const clientRef = useRef(null);

  // Initialize SDK
  useEffect(() => {
    // 1. Create client instance as per README
    const client = new LogosClient({
      serverUrl: SERVER_URL,
      apiKey: API_KEY,
      deviceId: DEVICE_ID,
      role: 'guardian',
      mode: 'trading', 
    });

    // 2. Setup listeners based on README Quick Start
    client.on('text', ({ aiText, isFinal }) => {
      console.log('AI Response:', aiText);
      setIsTyping(!isFinal);
      if (isFinal) {
        // Sync history from server when a conversation turn completes
        fetchHistory();
      }
    });

    client.on('audio', ({ text }) => {
      console.log('Play Speech:', text);
      // Integration point for Text-to-Speech if needed
    });

    client.on('status', (status) => {
      console.log('Current Status:', status);
      setSdkStatus(status);
    });

    client.on('error', (err) => {
      console.error('SDK Error:', err);
    });

    // 3. Connect to the Logos Backend
    client.connect();
    clientRef.current = client;

    // Initial load of guardian history
    fetchHistory();

    const historyInterval = setInterval(fetchHistory, 10000);

    return () => {
      client.disconnect();
      clearInterval(historyInterval);
    };
  }, [selectedDate]); // Re-fetch when date changes

  const fetchHistory = async () => {
    if (!clientRef.current) return;
    try {
      const historyList = await clientRef.current.getChatHistory({ 
        deviceId: DEVICE_ID, 
        date: selectedDate 
      });
      
      if (historyList && historyList.length > 0) {
        const formattedMessages = historyList.map(m => ({
          role: (m.role === 'ai' || m.role === 'model' || m.role === 'assistant') ? 'model' : 'user',
          text: m.content || m.text || '',
          time: m.created_at ? new Date(m.created_at) : new Date()
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to fetch history via SDK:', err);
    }
  };

  const handleShowSummary = async () => {
    if (!clientRef.current) return;
    try {
      const summary = await clientRef.current.getDailySummary({ 
        deviceId: DEVICE_ID, 
        date: selectedDate 
      });

      // Format and show summary in a readable way
      const summaryContent = `
=== Daily Summary for ${summary.summary_date} ===
Mode: ${summary.mode}
Conversations: ${summary.conversation_count}
Alerts: ${summary.alert_count}

Top Topics:
${summary.top_topics.map(t => `- ${t}`).join('\n')}

Mood: ${summary.mood_summary}

Summary:
${summary.overall_summary}
      `;
      
      alert(summaryContent);
    } catch (err) {
      console.error('Failed to show summary via SDK:', err);
      alert('Failed to fetch summary. Check console for details.');
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="ai-doll-view">
      <header className="page-header">
        <div className="header-info">
          <h1>Guardian Dashboard</h1>
          <p>Syncing with Device: <span className="device-tag">{DEVICE_ID}</span></p>
        </div>
        <div className="header-actions">
          <div className="date-picker-wrapper">
            <label htmlFor="date-filter">Filter Date:</label>
            <input 
              type="date" 
              id="date-filter" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="glass-input date-picker"
            />
          </div>
          <button className="glass-btn primary" onClick={handleShowSummary}>📄 Show Summary</button>
          <div className={`status-pill ${sdkStatus.toLowerCase()}`}>
            {sdkStatus}
          </div>
        </div>
      </header>

      <div className="chat-layout">
        <div className="chat-main glass-card">
          <div ref={scrollRef} className="chat-scroller">
            {messages.length === 0 ? (
              <div className="empty-state">No history recorded for this device.</div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`msg-row ${m.role}`}>
                  <div className="msg-bubble">
                    {m.text}
                    {m.time && (
                      <span className="msg-time">
                        {m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
            {isTyping && <div className="typing-indicator">MeBao is generating response...</div>}
          </div>
          
          <div className="chat-footer-note">
            History view enabled. Messaging is disabled in Guardian mode.
          </div>
        </div>

        <aside className="chat-sidebar">
          <div className="doll-status glass-card">
            <div className="doll-avatar">🧸</div>
            <h3>MeBao Physical</h3>
            <div className={`status-badge ${sdkStatus === 'IDLE' || sdkStatus === 'LISTENING' || sdkStatus === 'THINKING' ? 'online' : 'offline'}`}>
              {sdkStatus === 'DISCONNECTED' ? 'OFFLINE' : 'ONLINE'}
            </div>
            <p>
              {sdkStatus === 'LISTENING' ? 'Active listening...' : 
               sdkStatus === 'THINKING' ? 'Processing intelligence...' :
               'Doll is standby.'}
            </p>
          </div>
          
          <div className="saved-snippets glass-card">
            <h3>Monitoring Status</h3>
            <div className="status-grid">
              <div className="status-item">
                <label>VAD</label>
                <span>Active</span>
              </div>
              <div className="status-item">
                <label>Mode</label>
                <span>Trading</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AIDollPage;
