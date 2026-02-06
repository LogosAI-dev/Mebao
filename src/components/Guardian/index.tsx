import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Calendar, 
  MessageSquare, 
  ShieldAlert, 
  Mic, 
  History, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  RefreshCw,
  Clock,
  User,
  Bot,
  Settings
} from 'lucide-react';
import './styles.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY || 'sk-dev-test-123';

interface DailySummary {
  device_id: string;
  summary_date: string;
  mode: string;
  conversation_count: number;
  top_topics: string[];
  mood_summary: string;
  overall_summary: string;
  has_alerts: boolean;
  alert_count: number;
}

interface ChatMessage {
  id: number;
  role: string;
  content: string;
  created_at: string;
  mode: string;
}

interface Alert {
  id: number;
  alert_type: string;
  severity: string;
  keywords: string[];
  description: string;
  is_read: boolean;
  created_at: string;
}

export default function Guardian() {
  const [deviceId, setDeviceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'summary' | 'intercom' | 'history' | 'settings'>('summary');
  const [intercomText, setIntercomText] = useState('');
  
  // Settings State
  const [currentMode, setCurrentMode] = useState<'child' | 'senior'>('child');
  const [currentRole, setCurrentRole] = useState('companion');
  const [currentPersonality, setCurrentPersonality] = useState('enfj');
  const [vadAutoCalibrate, setVadAutoCalibrate] = useState(true);
  const [vadSensitivity, setVadSensitivity] = useState(5); 
  const [vadResponseSpeed, setVadResponseSpeed] = useState<'fast' | 'normal' | 'slow'>('fast');

  const [isDollOnline, setIsDollOnline] = useState(false);
  const [socketRef, setSocketRef] = useState<Socket | null>(null);

  const getDeviceId = useCallback(() => {
    let id = localStorage.getItem('guardian_device_id');
    if (!id) {
        id = 'device_testing'; // Default for dev
        localStorage.setItem('guardian_device_id', id);
    }
    return id;
  }, []);

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  useEffect(() => {
    const id = getDeviceId();
    setDeviceId(id);
    
    const socket = io(BACKEND_URL, { 
      transports: ['websocket'],
      auth: { apiKey: API_KEY }
    });
    setSocketRef(socket);

    socket.on('connect', () => {
      socket.emit('handshake', { role: 'guardian', deviceId: id });
    });

    socket.on('disconnect', () => {
      setIsDollOnline(false);
    });

    socket.on('room_update', (data: { type: 'join' | 'leave'; role: string, socketId: string }) => {
      if (data.role === 'doll') {
        setIsDollOnline(data.type === 'join');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [getDeviceId]);

  const fetchSummary = useCallback(async (force: boolean = false) => {
    if (!deviceId) return;
    setIsLoadingSummary(true);
    try {
      let url = `${BACKEND_URL}/api/guardian/summary?deviceId=${deviceId}&date=${selectedDate}&mode=${currentMode}`;
      if (force) {
        url += '&force=true';
      }
      
      const res = await fetch(url, {
        headers: {
          'x-api-key': API_KEY
        }
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
    setIsLoadingSummary(false);
  }, [deviceId, selectedDate, currentMode]);

  const fetchHistory = useCallback(async () => {
    if (!deviceId) return;
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/guardian/history?deviceId=${deviceId}&date=${selectedDate}&limit=100`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      setHistory(data.messages || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
    setIsLoadingHistory(false);
  }, [deviceId, selectedDate]);

  const fetchAlerts = useCallback(async () => {
    if (!deviceId) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/guardian/alerts?deviceId=${deviceId}`, {
        headers: {
          'x-api-key': API_KEY
        }
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  }, [deviceId]);

  useEffect(() => {
    if (deviceId) {
      if (activeTab === 'summary') fetchSummary();
      if (activeTab === 'history') fetchHistory();
      fetchAlerts();
    }
  }, [deviceId, selectedDate, activeTab, fetchSummary, fetchHistory, fetchAlerts]);

  const sendIntercom = () => {
    if (!intercomText.trim() || !socketRef) return;

    socketRef.emit('intercom', {
      text: intercomText,
      voiceStyle: 'mebao',
      mode: currentMode
    });

    setIntercomText('');
  };

  const updateSettings = (updates: Partial<{
    mode: 'child' | 'senior';
    roleId: string;
    personalityId: string;
    vadAutoCalibrate: boolean;
    vadSensitivity: number;
    vadResponseSpeed: 'fast' | 'normal' | 'slow';
  }>) => {
    if (updates.mode) setCurrentMode(updates.mode);
    if (updates.roleId) setCurrentRole(updates.roleId);
    if (updates.personalityId) setCurrentPersonality(updates.personalityId);
    if (updates.vadAutoCalibrate !== undefined) setVadAutoCalibrate(updates.vadAutoCalibrate);
    if (updates.vadSensitivity) setVadSensitivity(updates.vadSensitivity);
    if (updates.vadResponseSpeed) setVadResponseSpeed(updates.vadResponseSpeed);

    const payload: any = { ...updates };
    
    if (updates.vadResponseSpeed) {
      payload.vadTimeout = 
        updates.vadResponseSpeed === 'fast' ? 400 :
        updates.vadResponseSpeed === 'normal' ? 700 : 1200;
    }

    if (socketRef) {
      socketRef.emit('set_settings', payload);
    }
  };

  return (
    <div className="guardian-container">
      <header className="guardian-header">
        <div className="header-left">
           <ShieldAlert size={28} className="logo-icon" />
           <div className="header-titles">
             <h1 className="app-title">Me宝守护</h1>
             <span className="subtitle">远程监护中心</span>
           </div>
        </div>
        
        {activeTab !== 'intercom' && (
          <div className="date-picker-capsule">
            <button className="date-nav-btn" onClick={() => changeDate(-1)}>
              <ChevronLeft size={20} />
            </button>
            <div className="date-display">
              <Calendar size={16} />
              <span className="date-text">
                {new Date(selectedDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input-hidden"
              />
            </div>

            <button 
              className="date-nav-btn" 
              onClick={() => changeDate(1)} 
              disabled={selectedDate >= new Date().toISOString().split('T')[0]}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <div className="header-right">
           <div className={`status-pill ${isDollOnline ? 'online' : 'offline'}`}>
            <span className="status-dot"></span>
            {isDollOnline ? '设备在线' : '离线'}
          </div>
        </div>
      </header>

      {alerts.length > 0 && (
        <div className="alerts-banner" onClick={() => setActiveTab('history')}>
          <ShieldAlert size={18} />
          <span>发现 {alerts.length} 条新的安全提醒，点击查看详情</span>
        </div>
      )}

      <main className="guardian-main">
        {activeTab === 'summary' && (
          <div className="tab-content summary-view">
            <div className="section-header">
               <h2>📊 每日追踪</h2>
               <button className="refresh-icon-btn" onClick={() => fetchSummary(true)} disabled={isLoadingSummary}>
                 <RefreshCw size={18} className={isLoadingSummary ? 'listening' : ''} />
               </button>
            </div>

            {isLoadingSummary ? (
              <div className="skeleton-loader">Loading...</div>
            ) : summary ? (
              <>
                <div className="stats-grid">
                  <div className="stat-card blue">
                    <div className="stat-icon"><MessageSquare size={24} /></div>
                    <div className="stat-info">
                      <span className="value">{summary.conversation_count}</span>
                      <span className="label">今日对话</span>
                    </div>
                  </div>
                  <div className={`stat-card ${summary.has_alerts ? 'red' : 'green'}`}>
                    <div className="stat-icon"><Activity size={24} /></div>
                    <div className="stat-info">
                      <span className="value">{summary.has_alerts ? summary.alert_count : '安全'}</span>
                      <span className="label">健康状态</span>
                    </div>
                  </div>
                </div>

                <div className="summary-card">
                  <h3>🎯 热门话题</h3>
                  <div className="tags-cloud">
                    {summary.top_topics?.map((topic, i) => (
                      <span key={i} className="tag">#{topic}</span>
                    )) || <span className="empty-text">无</span>}
                  </div>
                </div>

                <div className="summary-card">
                  <h3>📝 智能摘要</h3>
                  <div className="summary-text-block">
                    <p className="mood-text">😊 <strong>情绪:</strong> {summary.mood_summary}</p>
                    <div className="divider"></div>
                    <p className="summary-text">{summary.overall_summary}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">Unable to load summary</div>
            )}
          </div>
        )}

        {activeTab === 'intercom' && (
          <div className="tab-content intercom-view">
            <div className="intercom-panel">
              <div className="panel-header">
                <Mic size={32} className="mic-icon" />
                <h2>远程传话</h2>
                <p>输入文字，Me宝会用它的声音说出来</p>
              </div>

              <div className="input-area">
                <textarea
                  value={intercomText}
                  onChange={(e) => setIntercomText(e.target.value)}
                  placeholder="说点什么吧..."
                  rows={4}
                />
                <button 
                  className="send-intercom-btn"
                  onClick={sendIntercom}
                  disabled={!intercomText.trim() || !isDollOnline}
                >
                  发送语音
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="tab-content history-view">
             <div className="section-header">
               <h2>📜 对话时光机</h2>
               <button className="refresh-icon-btn" onClick={fetchHistory} disabled={isLoadingHistory}>
                 <RefreshCw size={18} className={isLoadingHistory ? 'listening' : ''} />
               </button>
            </div>

            <div className="chat-stream">
              {history.map((msg) => (
                <div key={msg.id} className={`chat-bubble-wrapper ${msg.role}`}>
                  <div className="avatar">
                    {msg.role === 'user' ? <User size={16} /> : 
                     msg.role === 'guardian' ? <ShieldAlert size={16} /> : <Bot size={16} />}
                  </div>
                  <div className="chat-bubble">
                    <div className="bubble-content">{msg.content}</div>
                    <div className="bubble-time">
                      <Clock size={10} />
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content settings-view">
            <div className="settings-card">
              <h3>身份设定</h3>
              <div className="role-grid">
                {[
                  { id: 'explorer', name: '探险家', icon: '🔭' },
                  { id: 'companion', name: '伙伴', icon: '🐻' },
                  { id: 'guardian_angel', name: '天使', icon: '👼' }
                ].map((role) => (
                  <button 
                    key={role.id}
                    className={`role-card ${currentRole === role.id ? 'active' : ''}`}
                    onClick={() => updateSettings({ roleId: role.id })}
                  >
                    <span className="role-icon">{role.icon}</span>
                    <span className="role-name">{role.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-card">
              <h3>用户模式</h3>
              <div className="switch-toggle">
                <button 
                  className={currentMode === 'child' ? 'active' : ''}
                  onClick={() => updateSettings({ mode: 'child' })}
                >
                  👶 儿童
                </button>
                <button 
                  className={currentMode === 'senior' ? 'active' : ''}
                  onClick={() => updateSettings({ mode: 'senior' })}
                >
                  👴 长辈
                </button>
              </div>
            </div>

            <div className="settings-card">
              <h3>🎤 灵敏度</h3>
              <input
                type="range"
                min="1"
                max="10"
                value={vadSensitivity}
                onChange={(e) => updateSettings({ vadSensitivity: parseInt(e.target.value) })}
                className="vad-slider"
              />
            </div>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>
          <Activity size={24} />
          <span>简报</span>
        </button>
        <button className={activeTab === 'intercom' ? 'active' : ''} onClick={() => setActiveTab('intercom')}>
          <Mic size={24} />
          <span>对讲</span>
        </button>
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
          <History size={24} />
          <span>历史</span>
        </button>
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
          <Settings size={24} />
          <span>设置</span>
        </button>
      </nav>
    </div>
  );
}
