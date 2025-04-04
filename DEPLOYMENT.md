# Food Product Explorer - Deployment Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or pnpm package manager
- Git

## Local Development
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

## Building for Production
To create a production build:

```bash
pnpm run build
```

This will generate optimized files in the `dist` directory.

## Deployment Options

### Vercel Deployment
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. For production deployment:
```bash
vercel --prod
```

### Netlify Deployment
1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy to Netlify:
```bash
netlify deploy
```

3. For production deployment:
```bash
netlify deploy --prod
```

### AWS Amplify Deployment
1. Install AWS Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

2. Configure Amplify:
```bash
amplify configure
```

3. Initialize Amplify in your project:
```bash
amplify init
```

4. Add hosting:
```bash
amplify add hosting
```

5. Deploy to AWS:
```bash
amplify publish
```

## Environment Variables
No environment variables are required for this application as it uses the public OpenFoodFacts API.

## Continuous Integration/Continuous Deployment
The repository is set up with GitHub Actions for CI/CD. Any push to the main branch will trigger:
1. Code linting
2. Building the application
3. Automated deployment to the configured platform

## Troubleshooting
- If you encounter CORS issues, this is likely because the OpenFoodFacts API has rate limiting. Wait a few minutes and try again.
- If the API is unresponsive, check the OpenFoodFacts API status at their website.
