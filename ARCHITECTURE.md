# BLACK GPT - Architecture Documentation

## System Overview

BLACK GPT is a full-stack TypeScript application for legal signal intelligence collection, verification, and correlation. The system enforces strict compliance controls and maintains complete audit trails.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ MainPanel    │ GistCard     │ VerificationPanel        │ │
│  │ SignalForm   │ MetadataBar  │ CorrelationResults       │ │
│  │ SignalList   │ AuditLog     │ OnboardingTooltip        │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
│              Vite + Tailwind CSS + TypeScript                │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Express)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Controllers & Routes                       │   │
│  │  • /api/v1/signals/upload                           │   │
│  │  • /api/v1/signals/:id                              │   │
│  │  • /api/v1/signals/:id/verify                       │   │
│  │  • /api/v1/signals/:id/research-public              │   │
│  │  • /api/v1/signals/:id/audit                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Services Layer                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Signal Service                                │   │   │
│  │  │  - Create, retrieve, verify signals          │   │   │
│  │  │  - Status management                          │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Provenance Validator                         │   │   │
│  │  │  - Pattern matching for illegal content      │   │   │
│  │  │  - Source type validation                    │   │   │
│  │  │  - Keyword flagging                          │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Correlation Service                          │   │   │
│  │  │  - Public API integration                    │   │   │
│  │  │  - Confidence scoring                        │   │   │
│  │  │  - Result aggregation                        │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware Layer                         │   │
│  │  • Authentication (JWT)                              │   │
│  │  • Rate Limiting                                     │   │
│  │  • Error Handling                                    │   │
│  │  • Request Validation (Zod)                          │   │
│  │  • CORS                                              │   │
│  │  • Helmet (Security Headers)                         │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────┬──────────────────────┬──────────────────────────┘
            │                      │
            ▼                      ▼
┌──────────────────────┐  ┌──────────────────────┐
│   PostgreSQL DB      │  │      Redis           │
│  ┌────────────────┐  │  │  ┌────────────────┐  │
│  │ Signals        │  │  │  │ Cache          │  │
│  │ Audits         │  │  │  │ Sessions       │  │
│  │ Users          │  │  │  │ Queue Jobs     │  │
│  │ Correlations   │  │  │  └────────────────┘  │
│  │ Settings       │  │  │                      │
│  └────────────────┘  │  └──────────────────────┘
└──────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────────┐
│              External Public APIs (Legal Only)                │
│  • NewsAPI (news articles)                                   │
│  • CoinGecko (crypto prices)                                 │
│  • Reddit API (public discussions)                           │
│  • Twitter API (public tweets)                               │
│  • Blockchain Explorers (on-chain data)                      │
└──────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build and dev server
- Tailwind CSS for styling
- Axios for API communication

**Key Components:**

1. **MainPanel** - Central layout container
   - Orchestrates SignalForm, SignalList, and GistCard
   - Manages selected signal state

2. **SignalForm** - Signal creation interface
   - Form validation
   - Source type selection
   - Date range picker
   - Real-time validation feedback

3. **GistCard** - Signal detail viewer
   - Displays full signal content
   - Shows metadata and provenance
   - Hosts verification and correlation controls

4. **VerificationPanel** - Human review modal
   - Accept/Reject/Follow-up actions
   - Notes entry
   - Signal context display

5. **CorrelationResults** - Shows correlation findings
   - Public source results
   - Confidence scoring
   - Source attribution

6. **AuditLog** - Immutable action history
   - Chronological event list
   - Actor identification
   - Detailed notes display

**State Management:**
- Component-level state with React hooks
- Prop drilling for shared state
- API service layer for data fetching

### Backend Architecture

**Technology Stack:**
- Node.js 18+ with TypeScript
- Express.js web framework
- Prisma ORM
- Winston for logging
- Zod for validation

**Layers:**

1. **Controller Layer** (`src/controllers/`)
   - HTTP request/response handling
   - Input validation with Zod schemas
   - Error handling and status codes

2. **Service Layer** (`src/services/`)
   - Business logic implementation
   - Database operations via Prisma
   - External API integration
   - Provenance validation
   - Correlation processing

3. **Middleware** (`src/middleware/`)
   - Authentication (JWT)
   - Rate limiting
   - Error handling
   - CORS
   - Security headers (Helmet)

4. **Configuration** (`src/config/`)
   - Database connection
   - Logger setup
   - Environment variables

### Database Schema

**Tables:**

1. **User**
   - Authentication and authorization
   - Role-based access control
   - API key management

2. **Signal**
   - Core signal data
   - Provenance tags
   - Status tracking
   - Confidence scores
   - Flags and warnings

3. **Audit**
   - Immutable action log
   - Actor tracking
   - Timestamps
   - Notes and metadata

4. **CorrelationJob**
   - Async job tracking
   - Results storage
   - Source attribution
   - Status monitoring

5. **Setting**
   - System configuration
   - Feature flags
   - Rate limits

**Relationships:**
- User → Signal (1:N creator relationship)
- Signal → Audit (1:N)
- Signal → CorrelationJob (1:N)
- User → Audit (1:N actor relationship)

### Security Architecture

**Input Validation:**
- Zod schemas for all endpoints
- Type-safe validation
- Sanitization of user inputs

**Provenance Validation:**
- Pattern matching for disallowed content
- Source type whitelisting
- Keyword flagging
- Automatic rejection of illegal patterns

**Authentication & Authorization:**
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing (bcrypt)
- Token expiration and refresh

**Rate Limiting:**
- Per-IP rate limiting
- Configurable thresholds
- Protection against abuse

**Audit Trail:**
- Immutable logs
- Complete action history
- Actor identification
- Tamper-evident

**Data Protection:**
- Encrypted connections (HTTPS)
- Secure headers (Helmet)
- CORS configuration
- SQL injection prevention (Prisma)
- XSS prevention

### API Design

**RESTful Principles:**
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response
- Meaningful status codes

**Endpoints:**

```
POST   /api/v1/signals/upload
  Request: { scriptName, dateFrom, dateTo, gistText, ... }
  Response: { success: true, data: Signal }
  
GET    /api/v1/signals/:id
  Response: { success: true, data: Signal (with relations) }
  
GET    /api/v1/signals?filters
  Query: status, dateFrom, dateTo, minConfidence, limit, offset
  Response: { success: true, data: Signal[], pagination: {...} }
  
POST   /api/v1/signals/:id/verify
  Request: { reviewerId, action, notes? }
  Response: { success: true, data: Signal }
  
POST   /api/v1/signals/:id/research-public
  Request: { actorId }
  Response: { success: true, data: CorrelationResult }
  
GET    /api/v1/signals/:id/audit
  Response: { success: true, data: Audit[] }
```

**Error Responses:**
```json
{
  "success": false,
  "error": "Error message",
  "details": [/* validation errors */]
}
```

### Correlation Pipeline

**Flow:**

1. User triggers correlation
2. Extract keywords from signal gist
3. Query public APIs in parallel:
   - NewsAPI for news articles
   - CoinGecko for crypto data
   - Reddit API for discussions
4. Aggregate results
5. Calculate confidence scores
6. Generate summary gist
7. Store in CorrelationJob
8. Update signal status
9. Create audit entry

**Data Sources (Legal Only):**
- NewsAPI - News articles
- CoinGecko - Cryptocurrency data
- Reddit API - Public discussions
- Twitter API - Public tweets
- Blockchain explorers - On-chain data

**Confidence Scoring:**
- Based on number of sources
- Result quality and relevance
- Sentiment analysis
- Cross-source correlation

### Deployment Architecture

**Development:**
```
Docker Compose
├── PostgreSQL (port 5432)
├── Redis (port 6379)
├── Backend (port 3000)
└── Frontend (port 5173)
```

**Production (Kubernetes):**
```
Kubernetes Cluster
├── Namespace: blackgpt
├── PostgreSQL StatefulSet
├── Redis Deployment
├── Backend Deployment (2+ replicas)
├── Frontend Deployment (2+ replicas)
├── Ingress (HTTPS)
└── Secrets (credentials)
```

**CI/CD Pipeline:**
1. GitHub Actions triggers on push
2. Run linters and tests
3. Build Docker images
4. Push to container registry
5. Deploy to staging
6. Manual approval for production
7. Deploy to production
8. Health checks and monitoring

### Monitoring & Logging

**Logging:**
- Winston structured logging
- Log levels: error, warn, info, debug
- Contextual metadata
- Centralized log aggregation

**Metrics:**
- Request rates
- Response times
- Error rates
- Database query performance
- Cache hit rates

**Alerts:**
- High error rates
- Suspicious content flagged
- Service downtime
- Database issues

### Scalability Considerations

**Horizontal Scaling:**
- Stateless backend services
- Load balancing across replicas
- Session storage in Redis
- Database connection pooling

**Performance Optimization:**
- Redis caching for frequent queries
- Database indexes on key fields
- Lazy loading of large datasets
- Pagination for list endpoints

**Future Enhancements:**
- Message queue for async processing (BullMQ)
- WebSocket for real-time updates
- CDN for frontend assets
- Read replicas for database

## Development Guidelines

### Code Organization

```
backend/
├── src/
│   ├── controllers/    # HTTP handlers
│   ├── services/       # Business logic
│   ├── middleware/     # Express middleware
│   ├── config/         # Configuration
│   └── index.ts        # Entry point
frontend/
├── src/
│   ├── components/     # React components
│   ├── services/       # API client
│   ├── types/          # TypeScript types
│   └── styles/         # CSS files
```

### Testing Strategy

**Unit Tests:**
- Service layer functions
- Provenance validation
- Utility functions
- Jest test framework

**Integration Tests:**
- API endpoints
- Database operations
- External API mocking

**E2E Tests:**
- User flows
- Critical paths
- Playwright framework

### Coding Standards

**TypeScript:**
- Strict mode enabled
- Explicit types
- No `any` without justification
- ESLint for code quality

**React:**
- Functional components
- Hooks for state management
- Props validation
- Accessibility (a11y)

**CSS:**
- Tailwind utility classes
- Consistent spacing
- Responsive design
- Dark theme adherence

## Security Checklist

- [x] Input validation on all endpoints
- [x] Provenance validation for signals
- [x] Rate limiting enabled
- [x] CORS configured properly
- [x] Security headers (Helmet)
- [x] Authentication implemented
- [x] Authorization checks
- [x] Audit logging
- [x] Secure password hashing
- [x] SQL injection prevention (Prisma)
- [x] XSS prevention
- [x] Secrets in environment variables
- [x] HTTPS in production
- [x] Regular dependency updates

## Compliance Requirements

### Data Sources
- Only legal, auditable sources
- Explicit provenance tagging
- Source validation on ingestion
- Rejection of illegal patterns

### Human Verification
- Mandatory for actionable signals
- Documented decision process
- Audit trail of verifications
- Multiple approval levels

### Audit Trail
- Immutable logs
- Complete action history
- Retention for 2+ years
- Export capability

### Incident Response
- Flagging suspicious content
- Admin notification
- Review within 24 hours
- Escalation procedures

## Maintenance

### Regular Tasks
- Database backups (daily)
- Log rotation
- Dependency updates
- Security patches
- Performance monitoring

### Database Migrations
- Version controlled schemas
- Tested in staging first
- Rollback capability
- Data migration scripts

### Monitoring
- Uptime checks
- Error tracking
- Performance metrics
- User analytics

## Conclusion

BLACK GPT is designed with security, compliance, and maintainability as core principles. The architecture supports scalability while maintaining strict controls over data sources and processing.

For questions or contributions, refer to the main [README.md](./README.md) and [legal_sources.md](./legal_sources.md).
