const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/currency/convert?from=USD&to=EUR&amount=100
router.get('/convert', async (req, res) => {
  try {
    const { from = 'USD', to = 'EUR', amount = 1 } = req.query;
    const url = `https://open.er-api.com/v6/latest/${from.toUpperCase()}`;

    const response = await axios.get(url);
    const rates = response.data.rates;

    if (!rates[to.toUpperCase()]) {
      return res.status(400).json({ error: `Currency ${to} not found` });
    }

    const rate = rates[to.toUpperCase()];
    const converted = (parseFloat(amount) * rate).toFixed(2);

    res.json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount: parseFloat(amount),
      converted: parseFloat(converted),
      rate: rate,
      last_updated: response.data.time_last_update_utc
    });
  } catch (err) {
    res.status(500).json({ error: 'Currency conversion failed', detail: err.message });
  }
});

// GET /api/currency/rates?base=USD
router.get('/rates', async (req, res) => {
  try {
    const { base = 'USD' } = req.query;
    const url = `https://open.er-api.com/v6/latest/${base.toUpperCase()}`;
    const response = await axios.get(url);
    const popularCurrencies = ['EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY', 'THB', 'SGD'];
    
    const filteredRates = {};
    popularCurrencies.forEach(c => {
      if (response.data.rates[c]) filteredRates[c] = response.data.rates[c];
    });

    res.json({ base: base.toUpperCase(), rates: filteredRates });
  } catch (err) {
    res.status(500).json({ error: 'Rates fetch failed' });
  }
});

module.exports = router;
