const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/safety/alerts?country=Thailand
router.get('/alerts', async (req, res) => {
  try {
    const { country } = req.query;
    if (!country) return res.status(400).json({ error: 'Country is required' });

    const API_KEY = process.env.NEWS_API_KEY;
    const query = encodeURIComponent(`${country} travel safety warning advisory`);
    const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=5&language=en&apiKey=${API_KEY}`;

    const response = await axios.get(url);
    const articles = response.data.articles.map(a => ({
      title: a.title,
      source: a.source.name,
      summary: a.description,
      url: a.url,
      published_at: a.publishedAt
    }));

    res.json({ country, alerts: articles, count: articles.length });
  } catch (err) {
    res.status(500).json({ error: 'Safety alerts fetch failed', detail: err.message });
  }
});

// GET /api/safety/tips?category=theft
router.get('/tips', (req, res) => {
  const { category = 'general' } = req.query;
  const tips = {
    general: [
      'Share your itinerary with a trusted contact back home.',
      'Keep digital and physical copies of all travel documents.',
      'Register with your country\'s embassy upon arrival.',
      'Avoid displaying expensive items like cameras or jewelry.',
      'Trust your instincts — if somewhere feels unsafe, leave.',
      'Keep emergency numbers saved offline on your phone.',
    ],
    theft: [
      'Use a money belt or hidden pouch for valuables.',
      'Don\'t keep all cash in one place — spread it across bags.',
      'Be vigilant in crowded tourist spots — pickpockets target them.',
      'Use ATMs inside banks or hotels, avoid street ATMs at night.',
      'Keep bag zippers visible and facing forward.',
    ],
    transport: [
      'Use only official taxis or verified ride-share apps.',
      'Share your ride details with someone before departing.',
      'Avoid traveling alone at night in unfamiliar areas.',
      'Keep valuables in overhead bins or under your seat.',
      'Research traffic laws if renting a vehicle.',
    ],
    health: [
      'Purchase comprehensive travel insurance before departure.',
      'Carry a basic first-aid kit and personal medications.',
      'Check required vaccinations for your destination.',
      'Drink bottled or filtered water in high-risk areas.',
      'Know the location of the nearest hospital to your accommodation.',
    ],
    natural_disaster: [
      'Research natural disaster risks for your destination.',
      'Know local emergency broadcast channels.',
      'Identify evacuation routes from your accommodation.',
      'Keep a 72-hour emergency kit in your bag.',
      'Follow instructions from local authorities immediately.',
    ],
    scams: [
      'Be wary of overly friendly strangers offering unsolicited help.',
      'Research common tourist scams before visiting a destination.',
      'Confirm taxi fares before getting in.',
      'Buy tickets from official vendors only.',
      'Don\'t accept food or drinks from strangers.',
    ]
  };

  const selectedTips = tips[category] || tips['general'];
  res.json({ category, tips: selectedTips });
});

module.exports = router;
