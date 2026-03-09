const express = require('express');
const router = express.Router();
const axios = require('axios');

// Maps our type names to OpenStreetMap amenity tags
const typeToOSM = {
  hospital: '["amenity"="hospital"]',
  pharmacy: '["amenity"="pharmacy"]',
  police: '["amenity"="police"]',
  fire_station: '["amenity"="fire_station"]',
  atm: '["amenity"="atm"]',
  hotel: '["tourism"="hotel"]'
};
// GET /api/places/nearby?lat=9.14&lon=77.83&type=hospital
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, type = 'hospital', radius = 5000 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }

    const osmTag = typeToOSM[type] || '["amenity"="hospital"]';

    // Overpass QL query — finds nodes & ways within radius
    const query = `
      [out:json][timeout:15];
      (
        node${osmTag}(around:${radius},${lat},${lon});
        way${osmTag}(around:${radius},${lat},${lon});
      );
      out center 8;
    `;

    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      `data=${encodeURIComponent(query)}`,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 20000
      }
    );

    const elements = response.data.elements || [];

    const places = elements.slice(0, 8).map((el, i) => {
      const placeLat = el.lat ?? el.center?.lat;
      const placeLon = el.lon ?? el.center?.lon;
      return {
        id: String(el.id),
        name: el.tags?.name || el.tags?.['name:en'] || `${type.replace('_', ' ')} ${i + 1}`,
        address: [
          el.tags?.['addr:housenumber'],
          el.tags?.['addr:street'],
          el.tags?.['addr:city']
        ].filter(Boolean).join(', ') || el.tags?.['addr:full'] || 'Address not available',
        rating: null,
        open_now: el.tags?.opening_hours ? undefined : undefined,
        lat: placeLat,
        lon: placeLon,
        phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
        types: [type]
      };
    });

    res.json({ places, count: places.length });

  } catch (err) {
    console.error('Places fetch error:', err.message);

    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Map service timed out. Please try again.' });
    }

    res.status(500).json({ error: 'Places fetch failed', detail: err.message });
  }
});

// GET /api/places/emergency-numbers?country=FR
router.get('/emergency-numbers', (req, res) => {
  const { country = 'US' } = req.query;
  const numbers = {
    US: { police: '911',  ambulance: '911',  fire: '911',  tourist_helpline: '1-800-TRAVELER' },
    UK: { police: '999',  ambulance: '999',  fire: '999',  tourist_helpline: '0845 600 3001' },
    FR: { police: '17',   ambulance: '15',   fire: '18',   tourist_helpline: '3975' },
    IN: { police: '100',  ambulance: '108',  fire: '101',  tourist_helpline: '1800-111-363' },
    DE: { police: '110',  ambulance: '112',  fire: '112',  tourist_helpline: '+49 30 2500 2333' },
    JP: { police: '110',  ambulance: '119',  fire: '119',  tourist_helpline: '050-3816-2787' },
    AU: { police: '000',  ambulance: '000',  fire: '000',  tourist_helpline: '131 450' },
    IT: { police: '113',  ambulance: '118',  fire: '115',  tourist_helpline: '1515' },
    ES: { police: '112',  ambulance: '112',  fire: '112',  tourist_helpline: '+34 902 102 112' },
    TH: { police: '191',  ambulance: '1669', fire: '199',  tourist_helpline: '1155' },
    BR: { police: '190',  ambulance: '192',  fire: '193',  tourist_helpline: '0800-020-0256' },
    SG: { police: '999',  ambulance: '995',  fire: '995',  tourist_helpline: '1800-736-2000' },
  };
  const result = numbers[country.toUpperCase()] || numbers['US'];
  res.json({ country: country.toUpperCase(), numbers: result });
});

module.exports = router;