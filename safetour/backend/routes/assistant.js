const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/assistant/chat
router.post('/chat', async (req, res) => {
  try {
    console.log('Assistant request body:', JSON.stringify(req.body));

    const { message, location, history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message field is required' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
      return res.status(500).json({
        error: 'AI not configured. Get a FREE Groq key at https://console.groq.com'
      });
    }

    const systemPrompt = `You are SafeTour AI, a specialized travel safety assistant. Your role is to:
1. Provide real-time safety advice for travelers
2. Help identify potential risks at tourist destinations
3. Give emergency guidance and first-aid basics
4. Recommend safe routes, neighborhoods, and areas to avoid
5. Advise on local laws, customs, and cultural sensitivities
6. Help with lost documents, theft, or medical emergencies

Current traveler location: ${location || 'Unknown'}
Always be concise, actionable, and calm. Prioritize safety above all else.
Format responses clearly. Use bullet points for lists. Keep responses under 200 words.`;

    // ── Sanitize history ──────────────────────────────────────────────────────
    // Groq only accepts roles: 'user' or 'assistant' (not 'system' in history)
    // Messages must strictly alternate: user → assistant → user → assistant
    // We rebuild a clean alternating array to avoid any 400 errors
    const cleanHistory = [];
    const filtered = history
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .filter(m => m.content && m.content.trim())
      .slice(-6); // last 3 exchanges

    for (let i = 0; i < filtered.length; i++) {
      const msg = filtered[i];
      // Skip consecutive same-role messages (Groq rejects them)
      if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === msg.role) {
        continue;
      }
      cleanHistory.push({ role: msg.role, content: msg.content.trim() });
    }

    // Ensure history doesn't end with 'user' (the new message will be user)
    if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === 'user') {
      cleanHistory.pop();
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...cleanHistory,
      { role: 'user', content: message.trim() }
    ];

    console.log('Sending to Groq:', JSON.stringify(messages, null, 2));

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 300,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const reply = response.data.choices[0].message.content;
    console.log('Groq reply OK:', reply.slice(0, 80));
    res.json({ reply, role: 'assistant' });

  } catch (err) {
    // Log the full Groq error response for debugging
    console.error('Groq error status:', err.response?.status);
    console.error('Groq error body:', JSON.stringify(err.response?.data, null, 2));
    console.error('Groq error message:', err.message);

    if (err.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid Groq API key. Check GROQ_API_KEY in your .env file.' });
    }
    if (err.response?.status === 429) {
      return res.status(500).json({ error: 'Rate limit hit. Please wait a moment and try again.' });
    }
    if (err.response?.status === 400) {
      const detail = err.response?.data?.error?.message || 'unknown';
      console.error('Groq 400 detail:', detail);
      return res.status(500).json({ error: `Groq API error: ${detail}` });
    }

    res.status(500).json({ error: err.message || 'AI assistant unavailable. Please try again.' });
  }
});

module.exports = router;