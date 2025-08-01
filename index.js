const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const XANO_LOOKUP_ENDPOINT = 'https://api.byfloo.com/api:eqgvB67E/imgget-lookup';
const API_KEY = 'your-xano-api-key';

app.get('/imgget', async (req, res) => {
  const id = req.query.id;
  const key = req.query.key || '';

  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }

  try {
    const xanoRes = await fetch(`${XANO_LOOKUP_ENDPOINT}?id=${encodeURIComponent(id)}&key=${encodeURIComponent(key)}`);
    const data = await xanoRes.json();

    if (!xanoRes.ok || !data.url) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.redirect(302, data.url);
  } catch (err) {
    console.error('Redirection error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
