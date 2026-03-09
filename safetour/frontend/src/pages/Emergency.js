import React, { useState } from 'react';
import { Phone, AlertCircle, MapPin, Building2, Pill, ShieldAlert } from 'lucide-react';
import { placesAPI } from '../utils/api';
import { useLocation } from '../context/LocationContext';

const countries = ['US','UK','FR','IN','DE','JP','AU','IT','ES','TH','BR','SG'];
const placeTypes = [
  { type: 'hospital',        label: 'Hospitals',    icon: Building2, color: '#ff4757' },
  { type: 'pharmacy',        label: 'Pharmacies',   icon: Pill,      color: '#00d4aa' },
  { type: 'police',          label: 'Police',       icon: ShieldAlert, color: '#4a9eff' },
  { type: 'fire_station',    label: 'Fire Stations',icon: AlertCircle, color: '#ffa502' },
];

export default function Emergency() {
  const { location } = useLocation();
  const [country, setCountry] = useState('US');
  const [numbers, setNumbers] = useState(null);
  const [places, setPlaces] = useState([]);
  const [activeType, setActiveType] = useState('hospital');
  const [loading, setLoading] = useState(false);

  const fetchNumbers = async () => {
    try {
      const result = await placesAPI.getEmergencyNumbers(country);
      setNumbers(result.numbers);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNearby = async (type) => {
    if (!location) return alert('Enable location access to find nearby services.');
    setLoading(true); setActiveType(type); setPlaces([]);
    try {
      const result = await placesAPI.getNearby(location.lat, location.lon, type);
      setPlaces(result.places);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ color: '#ff4757' }}>🚨 Emergency Hub</h1>
        <p>Emergency numbers, nearby services, and quick-dial access</p>
      </div>

      {/* SOS Banner */}
      <div style={{
        padding: '24px', borderRadius: 16, marginBottom: 32,
        background: 'rgba(255,71,87,0.08)', border: '2px solid rgba(255,71,87,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertCircle size={28} color="#ff4757" />
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>In immediate danger?</div>
            <div style={{ color: 'rgba(240,244,255,0.6)', fontSize: '0.9rem' }}>Call emergency services immediately</div>
          </div>
        </div>
        <a href="tel:112" className="btn btn-danger" style={{ fontSize: '1rem', fontWeight: 700 }}>
          <Phone size={18} /> CALL 112 (International)
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Emergency Numbers */}
        <div className="card">
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone size={18} color="#00d4aa" /> Emergency Numbers
          </h2>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <select
              className="input"
              value={country}
              onChange={e => setCountry(e.target.value)}
              style={{ flex: 1, background: 'var(--bg-card2)' }}
            >
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="btn btn-primary" onClick={fetchNumbers}>Get Numbers</button>
          </div>

          {numbers && (
            <div style={{ display: 'grid', gap: 12 }}>
              {Object.entries(numbers).map(([key, val]) => (
                <a href={`tel:${val}`} key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 10, textDecoration: 'none',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'all 0.2s', cursor: 'pointer',
                }}>
                  <span style={{ color: 'rgba(240,244,255,0.7)', textTransform: 'capitalize', fontSize: '0.9rem' }}>
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#ff4757' }}>
                    {val}
                  </span>
                </a>
              ))}
            </div>
          )}

          {!numbers && (
            <p style={{ color: 'rgba(240,244,255,0.4)', textAlign: 'center', padding: '20px 0' }}>
              Select a country and click "Get Numbers"
            </p>
          )}
        </div>

        {/* Nearby Services */}
        <div className="card">
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={18} color="#4a9eff" /> Nearby Services
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {placeTypes.map(({ type, label, icon: Icon, color }) => (
              <button key={type} onClick={() => fetchNearby(type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                  borderRadius: 8, cursor: 'pointer', border: 'none', fontSize: '0.85rem', fontWeight: 500,
                  background: activeType === type ? `${color}20` : 'rgba(255,255,255,0.04)',
                  color: activeType === type ? color : 'rgba(240,244,255,0.6)',
                  outline: activeType === type ? `1px solid ${color}40` : 'none',
                  transition: 'all 0.2s',
                }}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          {loading && <div className="spinner" />}

          {!location && !loading && (
            <p style={{ color: 'rgba(240,244,255,0.4)', textAlign: 'center', padding: '20px 0', fontSize: '0.9rem' }}>
              📍 Enable location access to find nearby services
            </p>
          )}

          {places.length > 0 && (
            <div style={{ display: 'grid', gap: 10, maxHeight: 340, overflowY: 'auto' }}>
              {places.map(place => (
                <div key={place.id} style={{
                  padding: '14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.95rem' }}>{place.name}</div>
                  <div style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.82rem' }}>{place.address}</div>
                  {place.open_now !== undefined && (
                    <span className={`badge ${place.open_now ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: 6 }}>
                      {place.open_now ? '● Open' : '● Closed'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
