# Food Product Explorer

A modern web application that allows users to search, filter, and view detailed information about food products using the OpenFoodFacts API.

## Features

- **Product Listing**: Browse food products with pagination and smooth loading states
- **Search Functionality**: Search products by name with debounced API requests
- **Barcode Search**: Find products by scanning or entering barcodes
- **Advanced Filtering & Sorting**: Filter by multiple categories, nutritional values, and sort by various criteria
- **Detailed Product View**: View comprehensive product information including ingredients, nutrition facts, and labels
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Performance Optimized**: Implements caching, lazy loading, and efficient API handling

## Technology Stack

- **React**: Frontend library for building the user interface
- **React Router**: For navigation and routing
- **React Query**: For efficient API state management and caching
- **Axios**: For HTTP requests
- **Tailwind CSS**: For styling with utility classes
- **Glassmorphism UI**: Modern UI design with blur effects and transparency

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd food-product-explorer
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

- **Home Page**: Browse popular food categories and products
- **Search Page**: Search for products by name
- **Barcode Page**: Find products by entering a barcode
- **Filter Page**: Use advanced filtering and sorting options
- **Product Detail**: Click on any product to view detailed information

## API Integration

This application uses the [OpenFoodFacts API](https://world.openfoodfacts.org/) to fetch food product data:

- Get Products by Category: `https://world.openfoodfacts.org/category/{category}.json`
- Search Products by Name: `https://world.openfoodfacts.org/cgi/search.pl?search_terms={name}&json=true`
- Get Product by Barcode: `https://world.openfoodfacts.org/api/v0/product/{barcode}.json`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
food-product-explorer/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── product/     # Product-specific components
│   │   └── ui/          # Generic UI components with glassmorphism
│   ├── lib/             # Utility functions and API clients
│   │   └── api/         # API integration
│   ├── pages/           # Page components
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── DEPLOYMENT.md        # Deployment instructions
└── README.md            # Project documentation
```

## Performance Optimizations

- Lazy loading of page components
- API response caching with React Query
- Debounced search to prevent excessive API calls
- Error boundary for graceful error handling
- Optimized image loading with fallbacks

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [OpenFoodFacts](https://world.openfoodfacts.org/) for providing the API
- All the contributors who have helped with the development of this project
