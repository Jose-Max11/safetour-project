import React, { useState } from 'react';
import { BookOpen, Shield, CreditCard, Bus, Heart, Cpu, UserX } from 'lucide-react';
import { safetyAPI } from '../utils/api';

const categories = [
  { id: 'general',          label: 'General',       icon: Shield,   color: '#00d4aa' },
  { id: 'theft',            label: 'Theft & Scams', icon: UserX,    color: '#ffa502' },
  { id: 'transport',        label: 'Transport',     icon: Bus,      color: '#4a9eff' },
  { id: 'health',           label: 'Health',        icon: Heart,    color: '#ff6b9d' },
  { id: 'natural_disaster', label: 'Disasters',     icon: Cpu,      color: '#a29bfe' },
  { id: 'scams',            label: 'Scam Alert',    icon: CreditCard, color: '#ff4757' },
];

export default function SafetyTips() {
  const [active, setActive] = useState('general');
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);

  const fetchTips = async (cat) => {
    setActive(cat); setLoading(true);
    try {
      const res = await safetyAPI.getTips(cat);
      setTips(res.tips);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    if (!country.trim()) return;
    setAlertsLoading(true); setAlerts([]);
    try {
      const res = await safetyAPI.getAlerts(country);
      setAlerts(res.alerts);
    } catch (e) {
      console.error(e);
    } finally {
      setAlertsLoading(false);
    }
  };

  const activeCategory = categories.find(c => c.id === active);

  return (
    <div className="page">
      <div className="page-header">
        <h1>📚 Safety Tips</h1>
        <p>Expert guidance for staying safe during your travels</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Tips Section */}
        <div>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {categories.map(({ id, label, icon: Icon, color }) => (
              <button key={id} onClick={() => fetchTips(id)} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
                borderRadius: 10, cursor: 'pointer', border: 'none', fontSize: '0.85rem', fontWeight: 500,
                background: active === id ? `${color}18` : 'rgba(255,255,255,0.04)',
                color: active === id ? color : 'rgba(240,244,255,0.6)',
                outline: active === id ? `1px solid ${color}35` : 'none',
                transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
              }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {loading && <div className="spinner" />}

          {tips.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                {activeCategory && (
                  <>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: `${activeCategory.color}15`, border: `1px solid ${activeCategory.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <activeCategory.icon size={18} color={activeCategory.color} />
                    </div>
                    <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                      {activeCategory.label} Safety Tips
                    </h2>
                  </>
                )}
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {tips.map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: `${activeCategory?.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.75rem',
                      color: activeCategory?.color,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <p style={{ lineHeight: 1.65, color: 'rgba(240,244,255,0.8)', fontSize: '0.93rem' }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tips.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(240,244,255,0.3)' }}>
              <BookOpen size={50} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Select a category to view safety tips</p>
            </div>
          )}
        </div>

        {/* Travel Advisories */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16 }}>
              🌐 Travel Advisories
            </h3>
            <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.85rem', marginBottom: 16 }}>
              Get latest safety news for any destination
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                className="input"
                placeholder="Enter country name..."
                value={country}
                onChange={e => setCountry(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchAlerts()}
              />
              <button className="btn btn-secondary" onClick={fetchAlerts} disabled={alertsLoading} style={{ width: '100%', justifyContent: 'center' }}>
                {alertsLoading ? 'Loading...' : 'Get Advisories'}
              </button>
            </div>
          </div>

          {alerts.length > 0 && (
            <div style={{ display: 'grid', gap: 12 }}>
              {alerts.map((a, i) => (
                <a key={i} href={a.url} target="_blank" rel="noreferrer" style={{
                  padding: '16px', borderRadius: 12, textDecoration: 'none',
                  background: 'rgba(255,165,2,0.05)', border: '1px solid rgba(255,165,2,0.15)',
                  transition: 'all 0.2s', display: 'block',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f0f4ff', marginBottom: 6, lineHeight: 1.4 }}>{a.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(240,244,255,0.4)' }}>{a.source} · {new Date(a.published_at).toLocaleDateString()}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
