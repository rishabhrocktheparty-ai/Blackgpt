# BLACK GPT - Hidden Market Signals Platform

⚠️ **LEGAL NOTICE**: This application does NOT access dark web, Tor, .onion domains, or any illicit sources. All data must come from legal, auditable public sources only.

## Overview

BLACK GPT is a production-ready full-stack application that collects, summarizes, and verifies market signals from legal public sources. It features a minimal black-themed UI, human verification workflows, provenance tracking, and comprehensive audit logging.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  Black Theme UI • Signal Upload • Verification • Correlation     │
└──────────────────────┬──────────────────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────────────────┐
│                    Backend (Node.js/Express)                     │
│  Controllers • Services • Provenance Validation • Rate Limiting  │
└──────┬────────┬──────────────┬──────────────┬───────────────────┘
       │        │              │              │
       │        │              │              │
   ┌───▼──┐  ┌──▼───┐    ┌────▼─────┐   ┌───▼────────┐
   │ DB   │  │Redis │    │ NLP      │   │ Public APIs│
   │(PG)  │  │Cache │    │ Service  │   │ (Legal)    │
   └──────┘  └──────┘    └──────────┘   └────────────┘
                              │
                         ┌────▼─────┐
                         │ OpenAI / │
                         │ LLM API  │
                         └──────────┘
```

## Data Flow

1. **Signal Ingestion**: User uploads signal with provenance tags
2. **Validation**: Provenance validator checks for legal sources only
3. **Storage**: Signal stored in PostgreSQL with audit log
4. **Correlation**: On-demand public web research via legal APIs
5. **Summarization**: LLM generates concise gist and confidence score
6. **Contradiction Detection**: Secondary model checks for conflicts
7. **Human Verification**: Required before marking as actionable
8. **Audit Trail**: Every action immutably logged

## Features

### ✅ Security & Compliance
- Provenance validation (rejects illicit sources)
- Human verification workflow
- Immutable audit logging
- Rate limiting and input sanitization
- Role-based access control (RBAC)
- Contradiction detection for false signals

### ✅ Data Sources (Legal Only)
- Reddit API (public forums)
- Twitter API v2 (public tweets)
- NewsAPI (licensed news feeds)
- CoinGecko (cryptocurrency data)
- Blockchain APIs (Etherscan, Infura)
- Manual human uploads

### ✅ User Interface
- Pure black theme (#000000) with neon accents
- Minimal, accessible design (WCAG AA)
- Two main controls: Script Name + Date Range
- Dark-Signal Gist display panel
- Metadata bar (provenance, confidence, status)
- Human verification modal
- Public web correlation results
- Audit log viewer

### ✅ Backend API
- `POST /api/v1/signals/upload` - Upload new signal
- `GET /api/v1/signals/:id` - Get signal details
- `GET /api/v1/signals` - List signals with filters
- `POST /api/v1/signals/:id/verify` - Human verification
- `POST /api/v1/signals/:id/research-public` - Correlate with public web
- `GET /api/v1/audit/:signalId` - Get audit trail

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **ORM**: Prisma
- **NLP**: OpenAI API (configurable)
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (ready)

## Installation

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis (or use Docker)

### Quick Start with Docker

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/blackgpt.git
   cd blackgpt
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start all services**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

### Manual Development Setup

1. **Install backend dependencies**:
   ```bash
   cd apps/backend
   npm install
   ```

2. **Install frontend dependencies**:
   ```bash
   cd apps/frontend
   npm install
   ```

3. **Setup database**:
   ```bash
   cd prisma
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start backend** (in apps/backend):
   ```bash
   npm run dev
   ```

5. **Start frontend** (in apps/frontend):
   ```bash
   npm run dev
   ```

## Configuration

### Environment Variables

Key variables in `.env`:

```env
# Database
DATABASE_URL=postgresql://blackgpt:password@localhost:5432/blackgpt

# API Keys (Legal Public Sources)
REDDIT_CLIENT_ID=your-reddit-client-id
TWITTER_BEARER_TOKEN=your-twitter-token
NEWS_API_KEY=your-newsapi-key
OPENAI_API_KEY=your-openai-key

# Demo Mode (uses mock data)
DEMO_MODE=true

# Security
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

See `.env.example` for full configuration options.

### Demo Mode

Set `DEMO_MODE=true` to:
- Disable external API calls
- Use mock correlation data
- Skip API key requirements
- Perfect for local testing

## Legal & Compliance

### Allowed Sources

See [legal_sources.md](./legal_sources.md) for complete list:
- ✅ Reddit API (public)
- ✅ Twitter API (public)
- ✅ NewsAPI (licensed)
- ✅ Blockchain APIs (public)
- ✅ Exchange APIs (authorized)
- ✅ Manual human uploads

### Prohibited Sources

❌ **NEVER ACCESS**:
- Tor network / .onion domains
- Dark web marketplaces
- Illegal forums or sources
- Unauthorized private networks
- Hacked or leaked databases

### Provenance Validation

Every signal is validated against:
- Approved provenance tag list
- Disallowed pattern detection
- Content scanning for illegal keywords
- Automatic rejection of suspicious inputs

### Audit Trail

All actions are logged:
- Signal creation
- Human verification (accept/reject/followup)
- Public web correlation
- Status changes
- User actions with timestamps

Logs are immutable and stored in PostgreSQL for compliance.

## API Documentation

### Upload Signal

```bash
curl -X POST http://localhost:3000/api/v1/signals/upload \
  -H "Content-Type: application/json" \
  -d '{
    "scriptName": "BTC-ETH-Arbitrage",
    "dateFrom": "2024-01-01T00:00:00Z",
    "dateTo": "2024-01-02T00:00:00Z",
    "gistText": "Bitcoin shows strong correlation with Ethereum movements...",
    "provenanceTags": ["manual:human-upload"],
    "createdBy": "demo-user"
  }'
```

### Get Signal

```bash
curl http://localhost:3000/api/v1/signals/{id}
```

### List Signals

```bash
curl "http://localhost:3000/api/v1/signals?status=Unverified&page=1&limit=20"
```

### Human Verification

```bash
curl -X POST http://localhost:3000/api/v1/signals/{id}/verify \
  -H "Content-Type: application/json" \
  -d '{
    "reviewerId": "reviewer-123",
    "action": "accept",
    "notes": "Signal verified and approved"
  }'
```

### Public Web Research

```bash
curl -X POST http://localhost:3000/api/v1/signals/{id}/research-public \
  -H "Content-Type: application/json" \
  -d '{
    "initiatedBy": "demo-user"
  }'
```

## Testing

### Run Backend Tests
```bash
cd apps/backend
npm test
```

### Run E2E Tests
```bash
cd tests/e2e
npm test
```

## Deployment

### Docker

```bash
# Build images
docker-compose build

# Start production
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Kubernetes

See [k8s/](./k8s/) directory for Kubernetes manifests.

```bash
kubectl apply -f k8s/
```

### CI/CD

GitHub Actions workflows in [.github/workflows/](./.github/workflows/):
- `ci.yml` - Tests and linting
- `cd.yml` - Build and deploy

## Security

### Input Sanitization
- All inputs validated with Zod schemas
- XSS prevention
- SQL injection protection (Prisma ORM)

### Rate Limiting
- API: 100 requests per 15 minutes
- Verification: 5 requests per minute

### Authentication
- JWT tokens (7-day expiry)
- OAuth 2.0 ready (GitHub/Google)

### Audit Logging
- Winston logger
- Immutable audit trail
- Log rotation and archival

## Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps db

# View database logs
docker-compose logs db

# Reset database
docker-compose down -v
docker-compose up -d db
cd prisma && npx prisma migrate deploy
```

### Frontend Build Failed
```bash
# Clear cache and rebuild
cd apps/frontend
rm -rf node_modules dist
npm install
npm run build
```

### API Keys Not Working
- Ensure `.env` file exists
- Check API key validity
- Enable `DEMO_MODE=true` for testing without keys

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes (follow existing code style)
4. Add tests
5. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Meaningful commit messages
- Documentation for new features

## License

MIT License - See [LICENSE](./LICENSE)

## Support

- GitHub Issues: https://github.com/rishabhrocktheparty-ai/Blackgpt/issues
- Documentation: https://docs.blackgpt.io
- Email: support@blackgpt.io

---

**Remember**: This application is for legal market analysis only. Never integrate with dark web, Tor, or illicit sources. All data sources must be approved and auditable.

**Last Updated**: 2024-01-08