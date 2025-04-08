// api/offproxy.js

// Use dynamic import for node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const OPENFOODFACTS_BASE_URL = 'https://world.openfoodfacts.org';

export default async function handler(req, res) {
  // Allow requests from your Vercel domain (and localhost for development)
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://food-data-browser.vercel.app', // Your production domain
    'http://localhost:5173', // Your development domain (adjust port if needed)
  ];

  // Set CORS headers
  // Allow specific origin if it's in the list, otherwise don't set (blocks others)
  // In development, allow '*' for simplicity if origin is missing (e.g. server-side calls)
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin && process.env.NODE_ENV !== 'production') {
    // Be careful with '*' in production, but okay for dev/testing if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Ensure it's a GET request after handling OPTIONS
  if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET', 'OPTIONS']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
  }

  // Get the target URL path and query string from the request
  // Example: Frontend calls /api/offproxy/api/v0/product/123.json?fields=...
  // req.url will contain everything after /api/offproxy
  const targetPathAndQuery = req.url; // e.g., /api/v0/product/123.json?fields=...

  if (!targetPathAndQuery || targetPathAndQuery === '/') {
      res.status(400).json({ message: 'Target path is missing in proxy request' });
      return;
  }

  const targetUrl = `${OPENFOODFACTS_BASE_URL}${targetPathAndQuery}`;

  console.log(`Proxying request to: ${targetUrl}`); // Optional: Log the target

  try {
    const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
            'User-Agent': 'FoodDataBrowser-Proxy/1.0 (via Vercel Serverless)', // Identify your proxy
        }
    });

    // Check if the request was successful
    if (!response.ok) {
      console.error(`OFF API Error: ${response.status} ${response.statusText} for ${targetUrl}`);
      // Forward the status code and status text from the target API
      res.status(response.status).json({ message: response.statusText || 'Failed to fetch from OpenFoodFacts' });
      return;
    }

    const data = await response.json();

    // Send the response back to the frontend
    // Set cache headers - cache for 5 mins on CDN, 1 hour in browser
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600, max-age=3600');
    res.status(200).json(data);

  } catch (error) {
    console.error('Error in proxy function:', error);
    // Check if it's a fetch error (e.g., DNS resolution, network issue)
    if (error.code) {
       res.status(502).json({ message: `Bad Gateway: Upstream fetch error (${error.code})` });
    } else {
       res.status(500).json({ message: 'Internal Server Error in Proxy' });
    }
  }
}