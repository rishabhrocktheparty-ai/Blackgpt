# BLACK GPT - Complete Setup Guide

This guide will help you get BLACK GPT running locally on your machine.

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** and npm installed
- **Docker** and **Docker Compose** installed
- **Git** installed
- At least **4GB of free disk space**
- Port 3000, 5173, 5432, and 6379 available

## Quick Start (Recommended)

The fastest way to get started is using Docker Compose, which will:
- Start PostgreSQL database
- Start Redis cache
- Run database migrations
- Start the backend API
- Start the frontend UI

### 1. Clone the Repository

```bash
git clone https://github.com/rishabhrocktheparty-ai/Blackgpt.git
cd Blackgpt
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env if you want to customize settings
# For local development, the defaults work fine
nano .env  # or use your preferred editor
```

### 3. Start All Services

```bash
# Start everything in detached mode
docker-compose up -d

# Watch logs (optional)
docker-compose logs -f
```

### 4. Wait for Services to Start

The first time you run this, it will:
- Pull Docker images (~500MB)
- Install dependencies
- Run database migrations
- Start all services

This takes about 2-3 minutes.

### 5. Access the Application

Once services are running:

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### 6. Test with Demo Data

```bash
# Generate a demo signal
node scripts/generate-signal.js

# Or use a custom file
node scripts/generate-signal.js --from-file scripts/demo.txt
```

## Alternative: Local Development Setup

If you prefer to run services locally without Docker:

### 1. Install Dependencies

```bash
# Install all dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start PostgreSQL and Redis

You can use Docker for just the databases:

```bash
docker-compose up -d db redis
```

Or install and run them natively.

### 3. Run Database Migrations

```bash
npx prisma migrate dev --schema=./prisma/schema.prisma
```

### 4. Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will start on http://localhost:3000

### 5. Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will start on http://localhost:5173

## Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status":"healthy","timestamp":"2024-..."}
```

### 2. Test Signal Creation

```bash
curl -X POST http://localhost:3000/api/v1/signals/upload \
  -H "Content-Type: application/json" \
  -d '{
    "scriptName": "Test Signal",
    "dateFrom": "2024-01-01T00:00:00Z",
    "dateTo": "2024-01-07T23:59:59Z",
    "gistText": "This is a test signal to verify the system is working correctly.",
    "provenanceTags": ["manual", "test"],
    "sourceType": "MANUAL_UPLOAD",
    "uploaderUserId": 1
  }'
```

Should return success with signal ID.

### 3. Open Frontend

Navigate to http://localhost:5173 in your browser. You should see:

- Black themed UI
- "BLACK GPT" header with "Signal Intelligence Platform"
- Signal creation form on the left
- Signal list below the form
- Empty gist display on the right

## Using the Application

### Creating a Signal

1. Fill in the **Signal Creation Form**:
   - **Script Name**: Give your signal a descriptive name
   - **Date From/To**: Select the date range for your signal
   - **Source Type**: Choose from available legal sources
   - **Signal Gist**: Enter the signal description (10-5000 characters)

2. Click **"Create Signal"**

3. Your signal will appear in the list below

### Viewing Signal Details

1. Click on any signal in the list
2. The right panel will show:
   - Full gist content
   - Provenance tags
   - Confidence score
   - Status badge
   - Any warnings or flags

### Human Verification

1. Click the **"Verify"** button on a signal
2. Review the signal details
3. Choose an action:
   - ✓ **Accept**: Mark as verified
   - ⚠️ **Follow-up**: Flag for additional review
   - ✕ **Reject**: Mark as invalid
4. Optionally add notes
5. Click **"Submit Verification"**

### Public Web Correlation

1. View any signal
2. Click the **"🔍 Re-search Public Web"** button (bottom-right)
3. The system will:
   - Query legal public APIs (NewsAPI, CoinGecko, etc.)
   - Generate correlation confidence score
   - Display findings in a new panel

### Viewing Audit Log

1. View any signal
2. Click **"Audit Log"**
3. See complete history of:
   - Creation
   - Verifications
   - Correlations
   - All actions with timestamps

## Development Commands

### Backend

```bash
cd backend

# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Frontend

```bash
cd frontend

# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database

```bash
# Generate Prisma client
npx prisma generate --schema=./prisma/schema.prisma

# Create new migration
npx prisma migrate dev --schema=./prisma/schema.prisma

# Apply migrations
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Open Prisma Studio (database GUI)
npx prisma studio --schema=./prisma/schema.prisma
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :5173
lsof -i :5432

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Failed

```bash
# Ensure PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend Can't Connect to Backend

1. Check backend is running: http://localhost:3000/health
2. Check CORS settings in `.env`
3. Verify proxy configuration in `frontend/vite.config.ts`

### Docker Build Issues

```bash
# Clean up and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Migration Issues

```bash
# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d db
npx prisma migrate reset --schema=./prisma/schema.prisma
```

## Environment Variables

Key environment variables you might want to customize:

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for authentication tokens

### Optional (for full functionality)
- `NEWS_API_KEY`: Get from https://newsapi.org
- `OPENAI_API_KEY`: Get from https://platform.openai.com
- `REDDIT_CLIENT_ID`: Get from https://www.reddit.com/prefs/apps
- `TWITTER_API_KEY`: Get from https://developer.twitter.com

### Demo Mode
- `DEMO_MODE=true`: Disables external APIs, uses canned responses

## Production Deployment

For production deployment, see:

- **Docker**: Use production `Dockerfile.backend` and `Dockerfile.frontend`
- **Kubernetes**: Apply manifests in `k8s/` directory
- **CI/CD**: GitHub Actions workflows in `.github/workflows/`

Refer to the main [README.md](./README.md) for detailed deployment instructions.

## Security Notes

⚠️ **IMPORTANT**: This application only processes legal, auditable data sources.

- Never add Tor/.onion connectors
- Never integrate dark web scrapers
- All data sources must be approved (see [legal_sources.md](./legal_sources.md))
- Review all signals before marking as actionable
- Maintain audit logs for compliance

## Getting Help

If you encounter issues:

1. Check this setup guide
2. Review logs: `docker-compose logs`
3. Check the main [README.md](./README.md)
4. Review [legal_sources.md](./legal_sources.md) for compliance
5. Open an issue on GitHub (for public repo)

## Next Steps

Once you have the application running:

1. ✅ Create a test signal
2. ✅ Verify the signal
3. ✅ Run public correlation
4. ✅ View audit log
5. ✅ Explore different source types
6. ✅ Test with the demo script

Enjoy using BLACK GPT! 🚀
