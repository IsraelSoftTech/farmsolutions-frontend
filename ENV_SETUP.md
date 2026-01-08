# Frontend Environment Setup Guide

## Production Environment Variables

Create a `.env.production` file in the `frontend` directory with the following content:

```env
# API Configuration
REACT_APP_API_URL=https://api.farmsolutionss.com
REACT_APP_API_VERSION=v1

# Frontend URL
REACT_APP_FRONTEND_URL=https://farmsolutionss.com

# Environment
REACT_APP_ENV=production
```

## Development Environment Variables

Create a `.env.development` file in the `frontend` directory with the following content:

```env
# API Configuration (Development)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_VERSION=v1

# Frontend URL (Development)
REACT_APP_FRONTEND_URL=http://localhost:3000

# Environment
REACT_APP_ENV=development
```

## Installation

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Create the environment files as shown above.

3. Start the development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```
