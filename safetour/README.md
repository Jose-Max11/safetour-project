# 🌍 SafeTour — Tourist Safety Platform

> **Travel Safe. Explore Fearlessly.**
> An AI-powered tourist safety companion with real-time weather, emergency services, AI guidance, and currency tools.

---

## 📸 Features

| Feature | Description |
|---|---|
| 🌤️ **Live Weather** | Real-time weather with safety alerts per city |
| 🚨 **Emergency Hub** | Country emergency numbers + nearby hospitals/police |
| 🤖 **AI Safety Guide** | 24/7 OpenAI-powered travel safety chatbot |
| 📚 **Safety Tips** | Expert tips for theft, scams, health, disasters |
| 💱 **Currency Converter** | Live exchange rates to avoid tourist overcharging |
| 🗺️ **Nearby Services** | Find hospitals, pharmacies, fire stations near you |

---

## 🏗️ Project Structure

```
safetour/
├── backend/                  ← Node.js + Express API
│   ├── routes/
│   │   ├── weather.js        ← OpenWeatherMap API
│   │   ├── places.js         ← Google Places API + Emergency Numbers
│   │   ├── assistant.js      ← OpenAI GPT API
│   │   ├── safety.js         ← NewsAPI + Static Tips
│   │   └── currency.js       ← Exchange Rate API
│   ├── server.js             ← Express server entry point
│   ├── .env.example          ← Environment variable template
│   └── package.json
│
├── frontend/                 ← React.js App
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js     ← Navigation bar
│   │   ├── context/
│   │   │   └── LocationContext.js  ← Geolocation state
│   │   ├── pages/
│   │   │   ├── Home.js       ← Landing page
│   │   │   ├── Weather.js    ← Weather + safety alerts
│   │   │   ├── Emergency.js  ← Emergency numbers + nearby
│   │   │   ├── Assistant.js  ← AI chat interface
│   │   │   ├── SafetyTips.js ← Tips + travel advisories
│   │   │   └── Currency.js   ← Currency converter
│   │   ├── utils/
│   │   │   └── api.js        ← Axios API calls
│   │   ├── styles/
│   │   │   └── global.css    ← Global design system
│   │   ├── App.js            ← Router + providers
│   │   └── index.js          ← React entry point
│   └── package.json
│
├── package.json              ← Root scripts (runs both servers)
└── README.md
```

---

## 🔑 API Keys Required

Get these free API keys before running:

| API | Where to Get | Used For |
|---|---|---|
| **OpenWeatherMap** | https://openweathermap.org/api | Weather data |
| **Google Maps/Places** | https://console.cloud.google.com | Nearby services |
| **OpenAI** | https://platform.openai.com | AI chat assistant |
| **NewsAPI** | https://newsapi.org | Travel advisories |
| **Exchange Rate API** | https://open.er-api.com | Currency (FREE, no key needed!) |

---

## 🚀 Setup & Run

### Step 1: Clone or copy this project
```bash
# Navigate to the project folder
cd safetour
```

### Step 2: Install dependencies
```bash
# Install root dependencies
npm install

# Install all (backend + frontend)
npm run install-all
```

### Step 3: Configure environment variables

```bash
# Backend
cd backend
cp .env.example .env
# Now edit .env and add your API keys

# Frontend
cd ../frontend
cp .env.example .env
# Add your Google Maps key
```

### Step 4: Run the project
```bash
# From root folder — runs both servers simultaneously
cd ..
npm run dev

# OR run separately:
npm run start-backend   # Backend on http://localhost:5000
npm run start-frontend  # Frontend on http://localhost:3000
```

---

## 🔧 Available Endpoints

```
GET  /api/health                          Health check
GET  /api/weather?city=Paris             Weather by city
GET  /api/weather?lat=48.85&lon=2.35     Weather by coordinates
GET  /api/places/nearby?lat=&lon=&type=  Nearby hospitals/police etc.
GET  /api/places/emergency-numbers?country=US
GET  /api/safety/tips?category=general
GET  /api/safety/alerts?country=Thailand
GET  /api/currency/convert?from=USD&to=EUR&amount=100
GET  /api/currency/rates?base=USD
POST /api/assistant/chat                  AI safety chat
```

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router v6, TanStack Query, Framer Motion, Lucide Icons, React Toastify

**Backend:** Node.js, Express, Axios, Helmet (security), Morgan (logging), Rate Limiting

**APIs:** OpenWeatherMap, Google Places, OpenAI GPT-3.5, NewsAPI, Open Exchange Rates

---

## 🎨 Design System

- **Theme:** Dark, luxurious travel-tech aesthetic
- **Fonts:** Syne (headings) + DM Sans (body)
- **Colors:** `#00d4aa` (teal accent), `#4a9eff` (blue), `#ff4757` (emergency red)
- **CSS Variables:** Fully customizable via `:root` in `global.css`

---

## 📦 Deployment

**Frontend:** Deploy to Vercel, Netlify, or GitHub Pages
```bash
cd frontend && npm run build
```

**Backend:** Deploy to Railway, Render, or Heroku
```bash
cd backend && npm start
```

---

*Built for the Tourism & Safety Hackathon 🏆*
