import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, CloudSun, AlertCircle, Bot, BookOpen, DollarSign, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/',          label: 'Home',      icon: Shield },
  { to: '/weather',   label: 'Weather',   icon: CloudSun },
  { to: '/emergency', label: 'Emergency', icon: AlertCircle },
  { to: '/assistant', label: 'AI Guide',  icon: Bot },
  { to: '/tips',      label: 'Tips',      icon: BookOpen },
  { to: '/currency',  label: 'Currency',  icon: DollarSign },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(8,12,20,0.95)' : 'rgba(8,12,20,0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
      transition: 'all 0.3s', height: 72,
      display: 'flex', alignItems: 'center', padding: '0 32px',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 48 }}>
        <div style={{
          width: 36, height: 36, background: 'rgba(0,212,170,0.15)',
          borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(0,212,170,0.3)'
        }}>
          <Shield size={18} color="#00d4aa" />
        </div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#f0f4ff' }}>
          Safe<span style={{ color: '#00d4aa' }}>Tour</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: 4, flex: 1 }} className="desktop-nav">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8, textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s',
              color: active ? '#00d4aa' : 'rgba(240,244,255,0.6)',
              background: active ? 'rgba(0,212,170,0.1)' : 'transparent',
              border: active ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
            }}>
              <Icon size={15} /> {label}
            </Link>
          );
        })}
      </div>

      {/* SOS Button */}
      <Link to="/emergency" style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
        background: 'rgba(255,71,87,0.12)', border: '1px solid rgba(255,71,87,0.3)',
        color: '#ff4757', fontWeight: 700, fontSize: '0.85rem',
        fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em',
        transition: 'all 0.2s',
      }}>
        <AlertCircle size={15} /> SOS
      </Link>
    </nav>
  );
}
