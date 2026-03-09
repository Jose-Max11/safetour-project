const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/weather?city=Paris
router.get('/', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    if (!city && !(lat && lon)) {
      return res.status(400).json({ error: 'Provide city or lat/lon parameters' });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const query = city ? `q=${encodeURIComponent(city)}` : `lat=${lat}&lon=${lon}`;
    const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${API_KEY}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      visibility: data.visibility,
      alerts: data.alerts || [],
      safety_tip: getSafetyTip(data.weather[0].main)
    });
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.response?.data?.message || 'Weather fetch failed' });
  }
});

// Weather-based safety tips
function getSafetyTip(weatherMain) {
  const tips = {
    Thunderstorm: 'Seek indoor shelter immediately. Avoid open fields and tall trees.',
    Drizzle: 'Roads may be slippery. Drive cautiously and carry an umbrella.',
    Rain: 'Heavy rain may cause flooding. Stay informed about local advisories.',
    Snow: 'Dress in warm layers. Roads may be icy — walk carefully.',
    Mist: 'Low visibility — stay on marked paths and use navigation apps.',
    Fog: 'Reduce speed if driving. Keep lights on. Use GPS navigation.',
    Clear: 'Great weather! Apply sunscreen and stay hydrated.',
    Clouds: 'Mild conditions. Great day for sightseeing!',
    Haze: 'Air quality may be poor. Sensitive travelers should wear masks.',
    Dust: 'Dust storm possible. Stay indoors and cover nose/mouth outside.',
    Tornado: '⚠️ DANGER: Seek underground shelter immediately!',
    Squall: 'High winds expected. Avoid coastal areas and open spaces.'
  };
  return tips[weatherMain] || 'Stay aware of your surroundings and follow local guidelines.';
}

module.exports = router;
