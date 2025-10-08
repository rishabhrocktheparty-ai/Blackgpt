# BLACK GPT - API Documentation

## Base URL

```
Production: https://api.blackgpt.yourdomain.com
Development: http://localhost:3000
```

All API endpoints are prefixed with `/api/v1`.

## Authentication

Currently, the API uses a demo user system. Full JWT authentication will be implemented in future versions.

For authenticated requests (when available):
```http
Authorization: Bearer <jwt_token>
```

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

## Rate Limiting

- Standard endpoints: 100 requests per 15 minutes
- Sensitive endpoints: 5 requests per minute

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704758400
```

## Endpoints

### Health Check

#### `GET /health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-08T12:00:00.000Z"
}
```

---

### Signals

#### `POST /api/v1/signals/upload`

Upload a new market signal.

**Request Body:**
```json
{
  "scriptName": "BTC-ETH-Arbitrage",
  "dateFrom": "2024-01-01T00:00:00Z",
  "dateTo": "2024-01-02T00:00:00Z",
  "gistText": "Bitcoin and Ethereum price correlation shows unusual divergence...",
  "provenanceTags": ["exchange:api", "blockchain:public"],
  "createdBy": "user-123"
}
```

**Validation Rules:**
- `scriptName`: Required, string, 3-100 characters
- `dateFrom`: Required, ISO 8601 datetime
- `dateTo`: Required, ISO 8601 datetime, must be after `dateFrom`
- `gistText`: Required, string, 10-500 characters
- `provenanceTags`: Required, array of valid provenance tags
- `createdBy`: Required, string

**Valid Provenance Tags:**
- `reddit:public`
- `twitter:api`
- `news:licensed`
- `blockchain:public`
- `exchange:api`
- `manual:human-upload`
- `research:licensed`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "scriptName": "BTC-ETH-Arbitrage",
    "dateFrom": "2024-01-01T00:00:00.000Z",
    "dateTo": "2024-01-02T00:00:00.000Z",
    "gistText": "Bitcoin and Ethereum price correlation...",
    "provenanceTags": ["exchange:api", "blockchain:public"],
    "confidenceScore": 50,
    "status": "Unverified",
    "createdBy": "user-123",
    "createdAt": "2024-01-08T12:00:00.000Z",
    "updatedAt": "2024-01-08T12:00:00.000Z"
  }
}
```

**Error Codes:**
- `400`: Invalid input or prohibited provenance tags
- `429`: Rate limit exceeded

---

#### `GET /api/v1/signals/:id`

Get details of a specific signal.

**Parameters:**
- `id` (path): Signal UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "scriptName": "BTC-ETH-Arbitrage",
    "dateFrom": "2024-01-01T00:00:00.000Z",
    "dateTo": "2024-01-02T00:00:00.000Z",
    "gistText": "Bitcoin and Ethereum price correlation...",
    "provenanceTags": ["exchange:api", "blockchain:public"],
    "confidenceScore": 75,
    "status": "HumanVerified",
    "createdBy": "user-123",
    "createdAt": "2024-01-08T12:00:00.000Z",
    "updatedAt": "2024-01-08T12:30:00.000Z",
    "audits": [
      {
        "id": "audit-id-1",
        "signalId": "550e8400-e29b-41d4-a716-446655440000",
        "actorId": "user-123",
        "action": "CREATED",
        "notes": "Signal created with provenance validation",
        "timestamp": "2024-01-08T12:00:00.000Z"
      }
    ],
    "correlationJobs": [
      {
        "jobId": "job-id-1",
        "signalId": "550e8400-e29b-41d4-a716-446655440000",
        "startedAt": "2024-01-08T12:15:00.000Z",
        "finishedAt": "2024-01-08T12:16:30.000Z",
        "resultGist": "Correlation analysis confirms...",
        "correlationConfidence": 75,
        "sourcesQueried": ["reddit:public", "news:licensed"]
      }
    ]
  }
}
```

**Error Codes:**
- `404`: Signal not found

---

#### `GET /api/v1/signals`

List signals with optional filters.

**Query Parameters:**
- `status` (optional): Filter by status (`Unverified`, `HumanVerified`, `Correlated`)
- `dateFrom` (optional): Filter by date range start (ISO 8601)
- `dateTo` (optional): Filter by date range end (ISO 8601)
- `minConfidence` (optional): Minimum confidence score (0-100)
- `maxConfidence` (optional): Maximum confidence score (0-100)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)

**Example Request:**
```
GET /api/v1/signals?status=Unverified&minConfidence=60&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "signal-id-1",
      "scriptName": "Signal 1",
      "confidenceScore": 75,
      "status": "Unverified",
      "createdAt": "2024-01-08T12:00:00.000Z",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

#### `POST /api/v1/signals/:id/verify`

Human verification of a signal (rate limited to 5 requests/minute).

**Parameters:**
- `id` (path): Signal UUID

**Request Body:**
```json
{
  "reviewerId": "reviewer-123",
  "action": "accept",
  "notes": "Signal verified and approved after review"
}
```

**Validation:**
- `reviewerId`: Required, string
- `action`: Required, one of: `accept`, `reject`, `followup`
- `notes`: Optional, string

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "signal-id",
    "status": "HumanVerified",
    ...
  }
}
```

**Error Codes:**
- `400`: Invalid action or missing fields
- `404`: Signal not found
- `429`: Rate limit exceeded (5 requests/minute)

---

#### `POST /api/v1/signals/:id/research-public`

Trigger public web correlation research.

**Parameters:**
- `id` (path): Signal UUID

**Request Body:**
```json
{
  "initiatedBy": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "jobId": "job-id",
      "signalId": "signal-id",
      "startedAt": "2024-01-08T12:00:00.000Z",
      "finishedAt": "2024-01-08T12:01:30.000Z",
      "resultGist": "Correlation analysis confirms the signal...",
      "correlationConfidence": 82,
      "sourcesQueried": ["reddit:public", "news:licensed", "coingecko:api"]
    },
    "summary": {
      "gist": "Correlation analysis confirms the signal. Found 8 supporting sources...",
      "confidenceScore": 82,
      "topSignals": ["Public forum consensus", "News correlation", "On-chain activity"],
      "modelUsed": "gpt-4",
      "tokensUsed": 250
    },
    "contradiction": {
      "hasContradiction": false,
      "confidence": 20,
      "counterEvidence": "No significant contradictions detected"
    },
    "sources": [
      {
        "source": "reddit:public",
        "content": "Discussion about BTC-ETH correlation...",
        "url": "https://reddit.com/r/CryptoCurrency/...",
        "timestamp": "2024-01-08T11:45:00.000Z",
        "relevance": 0.85
      }
    ]
  }
}
```

**Process:**
1. Queries legal public APIs (Reddit, NewsAPI, CoinGecko, etc.)
2. Aggregates and summarizes findings using LLM
3. Runs contradiction detection
4. Updates signal confidence score
5. Creates audit log entry

**Error Codes:**
- `404`: Signal not found
- `429`: Rate limit exceeded

---

### Audit

#### `GET /api/v1/audit/:signalId`

Get complete audit trail for a signal.

**Parameters:**
- `signalId` (path): Signal UUID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "audit-id-1",
      "signalId": "signal-id",
      "actorId": "user-123",
      "action": "CREATED",
      "notes": "Signal created with provenance validation",
      "timestamp": "2024-01-08T12:00:00.000Z"
    },
    {
      "id": "audit-id-2",
      "signalId": "signal-id",
      "actorId": "reviewer-456",
      "action": "VERIFICATION_ACCEPT",
      "notes": "Signal verified and approved",
      "timestamp": "2024-01-08T12:15:00.000Z"
    },
    {
      "id": "audit-id-3",
      "signalId": "signal-id",
      "actorId": "user-123",
      "action": "PUBLIC_CORRELATION",
      "notes": "Found 8 sources. Confidence: 82%. No contradictions",
      "timestamp": "2024-01-08T12:30:00.000Z"
    }
  ]
}
```

**Audit Actions:**
- `CREATED`: Signal initially created
- `VERIFICATION_ACCEPT`: Human reviewer accepted signal
- `VERIFICATION_REJECT`: Human reviewer rejected signal
- `VERIFICATION_FOLLOWUP`: Marked for follow-up review
- `PUBLIC_CORRELATION`: Public web research completed
- `STATUS_CHANGED`: Signal status updated

---

### Users

#### `GET /api/v1/users/me`

Get current user information (demo implementation).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "demo-user",
    "email": "demo@blackgpt.local",
    "roles": ["uploader", "reviewer"]
  }
}
```

---

## Data Models

### Signal

```typescript
{
  id: string;                    // UUID
  scriptName: string;            // Trading script or signal name
  dateFrom: Date;                // Start of time range
  dateTo: Date;                  // End of time range
  gistText: string;              // Signal summary (max 500 chars)
  provenanceTags: string[];      // Source tags (legal only)
  confidenceScore: number;       // 0-100
  status: SignalStatus;          // Unverified | HumanVerified | Correlated
  createdBy: string;             // User ID
  createdAt: Date;
  updatedAt: Date;
  audits?: Audit[];
  correlationJobs?: CorrelationJob[];
}
```

### Audit

```typescript
{
  id: string;
  signalId: string;
  actorId: string;               // User who performed action
  action: string;                // Action type
  notes: string | null;          // Optional notes
  timestamp: Date;
}
```

### CorrelationJob

```typescript
{
  jobId: string;
  signalId: string;
  startedAt: Date;
  finishedAt: Date | null;
  resultGist: string | null;
  correlationConfidence: number | null;
  sourcesQueried: string[];      // List of provenance tags queried
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "message": "Detailed error message"
  }
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (not authorized)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

---

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

// Upload signal
async function uploadSignal() {
  const response = await axios.post(`${API_URL}/signals/upload`, {
    scriptName: 'BTC-ETH-Arbitrage',
    dateFrom: '2024-01-01T00:00:00Z',
    dateTo: '2024-01-02T00:00:00Z',
    gistText: 'Market signal detected...',
    provenanceTags: ['exchange:api'],
    createdBy: 'user-123'
  });
  
  return response.data.data;
}

// Research public web
async function researchSignal(signalId) {
  const response = await axios.post(
    `${API_URL}/signals/${signalId}/research-public`,
    { initiatedBy: 'user-123' }
  );
  
  return response.data.data;
}
```

### Python

```python
import requests

API_URL = 'http://localhost:3000/api/v1'

# Upload signal
def upload_signal():
    response = requests.post(f'{API_URL}/signals/upload', json={
        'scriptName': 'BTC-ETH-Arbitrage',
        'dateFrom': '2024-01-01T00:00:00Z',
        'dateTo': '2024-01-02T00:00:00Z',
        'gistText': 'Market signal detected...',
        'provenanceTags': ['exchange:api'],
        'createdBy': 'user-123'
    })
    
    return response.json()['data']

# List signals
def list_signals(status='Unverified'):
    response = requests.get(
        f'{API_URL}/signals',
        params={'status': status, 'limit': 20}
    )
    
    return response.json()['data']
```

### cURL

```bash
# Upload signal
curl -X POST http://localhost:3000/api/v1/signals/upload \
  -H "Content-Type: application/json" \
  -d '{
    "scriptName": "BTC-ETH-Arbitrage",
    "dateFrom": "2024-01-01T00:00:00Z",
    "dateTo": "2024-01-02T00:00:00Z",
    "gistText": "Market signal detected...",
    "provenanceTags": ["exchange:api"],
    "createdBy": "user-123"
  }'

# Get signal
curl http://localhost:3000/api/v1/signals/550e8400-e29b-41d4-a716-446655440000

# List signals
curl "http://localhost:3000/api/v1/signals?status=Unverified&limit=20"

# Verify signal
curl -X POST http://localhost:3000/api/v1/signals/550e8400-e29b-41d4-a716-446655440000/verify \
  -H "Content-Type: application/json" \
  -d '{
    "reviewerId": "reviewer-123",
    "action": "accept",
    "notes": "Approved"
  }'
```

---

## Webhooks (Future)

Planned webhooks for:
- Signal status changes
- Correlation job completion
- High-confidence signals
- Contradiction detection alerts

---

## Legal & Compliance

### Allowed Data Sources

All API endpoints ONLY access legal, public sources:
- ✅ Reddit API (public forums)
- ✅ Twitter API (public tweets)
- ✅ NewsAPI (licensed news)
- ✅ CoinGecko (crypto data)
- ✅ Blockchain APIs (public data)

### Prohibited

❌ The API will NEVER:
- Access Tor or .onion domains
- Connect to dark web marketplaces
- Process illegal content
- Bypass terms of service
- Access unauthorized sources

All inputs are validated against [legal_sources.md](../legal_sources.md).

---

## Support

- API Issues: https://github.com/rishabhrocktheparty-ai/Blackgpt/issues
- Documentation: https://docs.blackgpt.io
- Email: api@blackgpt.io
