/**
 * Serverless function to proxy requests to OpenFoodFacts API
 * This avoids CORS issues when deployed on Vercel
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the path from the query parameter
    const { path } = req.query;
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }

    // Construct the URL to the OpenFoodFacts API
    const url = `https://world.openfoodfacts.org/${path}`;
    
    console.log(`Proxying request to: ${url}`);
    
    // Fetch data from OpenFoodFacts API
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FoodDataBrowser/1.0 (https://food-data-browser.vercel.app)'
      }
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the data
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch data from OpenFoodFacts API' });
  }
}