import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, MapPin, Sparkles } from 'lucide-react';
import { assistantAPI } from '../utils/api';
import { useLocation } from '../context/LocationContext';

const suggestions = [
  'Is it safe to travel to Bangkok right now?',
  'What should I do if my passport is stolen?',
  'How to avoid tourist scams in Paris?',
  'What vaccinations do I need for Africa?',
  'Emergency phrases in Japanese?',
  'Is solo travel safe for women in Morocco?',
];

export default function Assistant() {
  const { location } = useLocation();
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "👋 Hi! I'm your SafeTour AI Guide. I can help you with travel safety, emergency advice, local tips, and more. What can I help you with today?"
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text = input) => {
    const msg = text.trim();
    if (!msg || loading) return;

    const locationStr = location ? `${location.lat.toFixed(3)}, ${location.lon.toFixed(3)}` : 'Unknown';
    const userMsg = { role: 'user', content: msg };
    const history = messages.filter(m => m.role !== 'system');

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await assistantAPI.chat(msg, locationStr, history);
      setMessages(prev => [...prev, { role: 'assistant', content: result.reply }]);
    } catch (e) {
      // Show actual error message from backend for debugging
      const errorMessage = e.message || 'Unknown error';
      console.error('Assistant error:', errorMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${errorMessage}\n\nFor emergencies, please call local emergency services (112 internationally).`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <h1>🤖 AI Safety Guide</h1>
        <p>Ask me anything about travel safety, emergencies, or local tips</p>
      </div>

      {/* Chat Window */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(0,212,170,0.04)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={20} color="#00d4aa" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>SafeTour AI</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#00d4aa' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', display: 'inline-block' }} />
              Online · Travel Safety Expert
            </div>
          </div>
          {location && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(240,244,255,0.4)', fontSize: '0.78rem' }}>
              <MapPin size={12} /> Location active
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ height: 440, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: msg.role === 'user' ? 'rgba(74,158,255,0.15)' : 'rgba(0,212,170,0.12)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(74,158,255,0.2)' : 'rgba(0,212,170,0.2)'}`,
              }}>
                {msg.role === 'user' ? <User size={16} color="#4a9eff" /> : <Bot size={16} color="#00d4aa" />}
              </div>
              <div style={{
                maxWidth: '75%', padding: '14px 18px', borderRadius: 14,
                background: msg.role === 'user' ? 'rgba(74,158,255,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(74,158,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
                fontSize: '0.93rem', lineHeight: 1.65, color: 'rgba(240,244,255,0.9)',
                borderTopRightRadius: msg.role === 'user' ? 4 : 14,
                borderTopLeftRadius: msg.role === 'user' ? 14 : 4,
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#00d4aa" />
              </div>
              <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#00d4aa',
                    animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${d}s`, opacity: 0.6,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div style={{ padding: '0 28px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {suggestions.slice(0, 3).map(s => (
            <button key={s} onClick={() => send(s)} style={{
              padding: '6px 12px', borderRadius: 20, cursor: 'pointer', border: 'none',
              background: 'rgba(0,212,170,0.08)', color: 'rgba(0,212,170,0.8)',
              fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.2s',
            }}>
              <Sparkles size={11} style={{ marginRight: 4 }} />{s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '16px 28px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="input"
              placeholder="Ask about safety, emergencies, local laws, health tips..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              disabled={loading}
            />
            <button
              className="btn btn-primary"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{ padding: '12px 18px' }}
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } }`}</style>
    </div>
  );
}
