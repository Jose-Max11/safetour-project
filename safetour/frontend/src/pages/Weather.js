import React, { useState } from 'react';
import { CloudSun, Wind, Droplets, Eye, Thermometer, Search, AlertTriangle } from 'lucide-react';
import { weatherAPI } from '../utils/api';

export default function Weather() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!city.trim()) return;
    setLoading(true); setError(''); setData(null);
    try {
      const result = await weatherAPI.getByCity(city);
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherGradient = (desc = '') => {
    if (desc.includes('rain') || desc.includes('drizzle')) return 'linear-gradient(135deg, #1a2a4a, #2d3a5a)';
    if (desc.includes('cloud')) return 'linear-gradient(135deg, #1e2533, #2a3040)';
    if (desc.includes('clear') || desc.includes('sun')) return 'linear-gradient(135deg, #1a2a1a, #1f3a2a)';
    if (desc.includes('snow')) return 'linear-gradient(135deg, #1a2535, #253045)';
    if (desc.includes('storm') || desc.includes('thunder')) return 'linear-gradient(135deg, #1a1a2a, #2a1a2a)';
    return 'linear-gradient(135deg, #141d2b, #1a2535)';
  };

  const getSafetyColor = (tip = '') => {
    if (tip.includes('DANGER') || tip.includes('⚠️')) return '#ff4757';
    if (tip.includes('slippery') || tip.includes('may')) return '#ffa502';
    return '#00d4aa';
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌤️ Weather & Safety</h1>
        <p>Real-time weather conditions with travel safety recommendations</p>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: 32 }}>
        <div className="input-group">
          <input
            className="input"
            placeholder="Search city... (e.g. Tokyo, Paris, New York)"
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
          />
          <button className="btn btn-primary" onClick={search} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
            <Search size={16} /> {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: 20, background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: 12, color: '#ff4757', marginBottom: 24 }}>
          ⚠️ {error}
        </div>
      )}

      {loading && <div className="spinner" />}

      {data && (
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Main Weather Card */}
          <div style={{
            padding: '40px', borderRadius: 20,
            background: getWeatherGradient(data.description),
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontWeight: 500 }}>
                📍 {data.city}, {data.country}
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, lineHeight: 1 }}>
                {data.temperature}°C
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8, textTransform: 'capitalize', fontSize: '1.1rem' }}>
                {data.description}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: 4 }}>
                Feels like {data.feels_like}°C
              </div>
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              alt={data.description}
              style={{ width: 100, height: 100, opacity: 0.9 }}
            />
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: Wind,        label: 'Wind Speed',  value: `${data.wind_speed} m/s` },
              { icon: Droplets,    label: 'Humidity',    value: `${data.humidity}%` },
              { icon: Eye,         label: 'Visibility',  value: `${(data.visibility / 1000).toFixed(1)} km` },
              { icon: Thermometer, label: 'Feels Like',  value: `${data.feels_like}°C` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(74,158,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color="#4a9eff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(240,244,255,0.5)', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Tip */}
          <div style={{
            padding: '24px', borderRadius: 16,
            background: `${getSafetyColor(data.safety_tip)}10`,
            border: `1px solid ${getSafetyColor(data.safety_tip)}25`,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <AlertTriangle size={20} color={getSafetyColor(data.safety_tip)} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 6, color: getSafetyColor(data.safety_tip) }}>
                  Safety Recommendation
                </div>
                <p style={{ color: 'rgba(240,244,255,0.75)', lineHeight: 1.6 }}>{data.safety_tip}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!data && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '80px 40px', color: 'rgba(240,244,255,0.3)' }}>
          <CloudSun size={60} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: '1.1rem' }}>Search for a city to see weather and safety info</p>
        </div>
      )}
    </div>
  );
}
