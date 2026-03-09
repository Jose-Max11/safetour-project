import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowLeftRight, TrendingUp } from 'lucide-react';
import { currencyAPI } from '../utils/api';

const currencies = ['USD','EUR','GBP','JPY','INR','AUD','CAD','CHF','CNY','THB','SGD','AED','BRL','MXN','KRW'];

export default function Currency() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    currencyAPI.getRates('USD').then(r => setRates(r.rates)).catch(() => {});
  }, []);

  const convert = async () => {
    setLoading(true);
    try {
      const res = await currencyAPI.convert(from, to, amount);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    setFrom(to); setTo(from); setResult(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>💱 Currency Converter</h1>
        <p>Accurate exchange rates to avoid tourist overcharging</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Converter */}
        <div className="card">
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarSign size={18} color="#a29bfe" /> Convert Currency
          </h2>

          <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(240,244,255,0.5)', marginBottom: 8, fontWeight: 500 }}>
                Amount
              </label>
              <input
                className="input"
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(240,244,255,0.5)', marginBottom: 8, fontWeight: 500 }}>From</label>
                <select className="input" value={from} onChange={e => setFrom(e.target.value)} style={{ background: 'var(--bg-card2)' }}>
                  {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={swap} style={{
                width: 40, height: 40, borderRadius: 10, cursor: 'pointer', border: 'none',
                background: 'rgba(162,155,254,0.1)', color: '#a29bfe', display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              }}>
                <ArrowLeftRight size={16} />
              </button>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(240,244,255,0.5)', marginBottom: 8, fontWeight: 500 }}>To</label>
                <select className="input" value={to} onChange={e => setTo(e.target.value)} style={{ background: 'var(--bg-card2)' }}>
                  {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={convert} disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
            {loading ? 'Converting...' : 'Convert'}
          </button>

          {result && (
            <div style={{
              marginTop: 24, padding: '28px', borderRadius: 14, textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(162,155,254,0.08), rgba(74,158,255,0.08))',
              border: '1px solid rgba(162,155,254,0.2)',
            }}>
              <div style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.85rem', marginBottom: 8 }}>
                {result.amount} {result.from} =
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#a29bfe' }}>
                {result.converted.toLocaleString()} {result.to}
              </div>
              <div style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.8rem', marginTop: 8 }}>
                1 {result.from} = {result.rate.toFixed(4)} {result.to}
              </div>
            </div>
          )}
        </div>

        {/* Quick Rates */}
        <div className="card">
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="#00d4aa" /> Live Rates (vs USD)
          </h2>
          <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.82rem', marginBottom: 20 }}>
            Know the real rate before exchanging money at airports or hotels
          </p>

          {rates ? (
            <div style={{ display: 'grid', gap: 8 }}>
              {Object.entries(rates).map(([currency, rate]) => (
                <div key={currency} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{currency}</span>
                  <span style={{ color: '#00d4aa', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                    {rate.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="spinner" />
          )}

          <div style={{
            marginTop: 20, padding: '14px', borderRadius: 10,
            background: 'rgba(255,165,2,0.06)', border: '1px solid rgba(255,165,2,0.15)',
            fontSize: '0.82rem', color: 'rgba(255,165,2,0.8)', lineHeight: 1.6,
          }}>
            💡 <strong>Tip:</strong> Always compare with official rates before exchanging. Airport and hotel kiosks often charge 5–15% more.
          </div>
        </div>
      </div>
    </div>
  );
}
