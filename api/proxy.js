// Serverless function to proxy requests to OpenFoodFacts API
export default async function handler(req, res) {
  const targetUrl = 'https://world.openfoodfacts.org';
  const path = req.url.replace(/^\/api/, '');
  
  try {
    const response = await fetch(`${targetUrl}${path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FoodDataBrowser/1.0',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch from OpenFoodFacts API' });
  }
}