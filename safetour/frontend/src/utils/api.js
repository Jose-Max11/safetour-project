// utils/api.js — Frontend API utility
// Place this at: src/utils/api.js

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// ─── Helper ──────────────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    // Throw with the backend's actual error message so UI can show it
    throw new Error(data.error || `Request failed with status code ${res.status}`);
  }

  return data;
}

// ─── Weather ─────────────────────────────────────────────────────────────────
export const weatherAPI = {
  getByCity: (city) =>
    request(`/weather?city=${encodeURIComponent(city)}`),
  getByCoords: (lat, lon) =>
    request(`/weather?lat=${lat}&lon=${lon}`),
};

// ─── Assistant ────────────────────────────────────────────────────────────────
export const assistantAPI = {
  chat: (message, location, history = []) =>
    request('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,           // ← this is what the backend expects
        location,
        history,
      }),
    }),
};

// ─── Currency ─────────────────────────────────────────────────────────────────
export const currencyAPI = {
  convert: (from, to, amount) =>
    request(`/currency/convert?from=${from}&to=${to}&amount=${amount}`),
  getRates: (base = 'USD') =>
    request(`/currency/rates?base=${base}`),
};

// ─── Places / Emergency ───────────────────────────────────────────────────────
export const placesAPI = {
  getNearby: (lat, lon, type) =>
    request(`/places/nearby?lat=${lat}&lon=${lon}&type=${type}`),
  getEmergencyNumbers: (country) =>
    request(`/places/emergency-numbers?country=${country}`),
};

// ─── Safety ───────────────────────────────────────────────────────────────────
export const safetyAPI = {
  getTips: (category) =>
    request(`/safety/tips?category=${category}`),
  getAlerts: (country) =>
    request(`/safety/alerts?country=${encodeURIComponent(country)}`),
};