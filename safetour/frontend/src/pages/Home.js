import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CloudSun, AlertCircle, Bot, BookOpen, DollarSign, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: CloudSun,    color: '#4a9eff', label: 'Live Weather',        desc: 'Real-time weather with safety alerts and travel recommendations.', to: '/weather' },
  { icon: AlertCircle, color: '#ff4757', label: 'Emergency Hub',       desc: 'Instant access to local emergency numbers and nearby hospitals.', to: '/emergency' },
  { icon: Bot,         color: '#00d4aa', label: 'AI Travel Guide',     desc: '24/7 AI assistant for safety queries, route advice, and emergencies.', to: '/assistant' },
  { icon: BookOpen,    color: '#ffa502', label: 'Safety Tips',         desc: 'Expert advice on avoiding scams, theft, and travel hazards.', to: '/tips' },
  { icon: DollarSign,  color: '#a29bfe', label: 'Currency Converter',  desc: 'Avoid scams with instant accurate exchange rates.', to: '/currency' },
  { icon: MapPin,      color: '#fd79a8', label: 'Nearby Services',     desc: 'Find hospitals, pharmacies, and police stations near you.', to: '/emergency' },
];

const stats = [
  { value: '195+', label: 'Countries Covered' },
  { value: '24/7', label: 'AI Support' },
  { value: '1M+', label: 'Travelers Helped' },
  { value: '98%', label: 'Satisfaction Rate' },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 0 80px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 100,
          background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)',
          color: '#00d4aa', fontSize: '0.8rem', fontWeight: 600,
          letterSpacing: '0.05em', marginBottom: 32,
        }}>
          <Shield size={13} /> TRAVEL SAFE · EXPLORE FEARLESSLY
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.1,
          letterSpacing: '-0.03em', marginBottom: 24,
        }}>
          Your Safety<br />
          <span style={{
            background: 'linear-gradient(135deg, #00d4aa, #4a9eff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Companion Abroad</span>
        </h1>

        <p style={{
          color: 'rgba(240,244,255,0.55)', fontSize: '1.15rem',
          maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7,
        }}>
          Real-time weather alerts, emergency services, AI-powered guidance, and safety tools — everything a traveler needs in one platform.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/assistant" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
            <Bot size={18} /> Talk to AI Guide <ArrowRight size={16} />
          </Link>
          <Link to="/emergency" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
            <AlertCircle size={18} /> Emergency Hub
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
        background: 'rgba(255,255,255,0.05)', borderRadius: 16,
        overflow: 'hidden', marginBottom: 80, border: '1px solid rgba(255,255,255,0.07)',
      }}>
        {stats.map(({ value, label }) => (
          <div key={label} style={{ padding: '32px 24px', textAlign: 'center', background: 'var(--bg-card)' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#00d4aa' }}>{value}</div>
            <div style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.85rem', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: 80 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>
          Everything You Need
        </h2>
        <p style={{ color: 'rgba(240,244,255,0.5)', marginBottom: 32 }}>
          Comprehensive travel safety tools at your fingertips.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {features.map(({ icon: Icon, color, label, desc, to }) => (
            <Link key={label} to={to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 16,
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 8, fontSize: '1.05rem' }}>{label}</h3>
                <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, color, fontSize: '0.8rem', fontWeight: 600 }}>
                  Explore <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust Banner */}
      <div style={{
        padding: '40px', background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(74,158,255,0.06))',
        borderRadius: 20, border: '1px solid rgba(0,212,170,0.15)', textAlign: 'center',
      }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.5rem', marginBottom: 16 }}>
          Travel with Confidence
        </h3>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', color: 'rgba(240,244,255,0.7)', fontSize: '0.9rem' }}>
          {['Real-time data', 'AI-powered safety', 'Global coverage', 'Free to use'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={15} color="#00d4aa" /> {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
