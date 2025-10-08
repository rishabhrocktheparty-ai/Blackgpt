# Legal Sources and Compliance Guidelines

## ⚠️ CRITICAL COMPLIANCE NOTICE

**This application MUST NOT access, connect to, or integrate with:**
- Tor network or .onion domains
- Dark web marketplaces or hidden services
- Any illegal or illicit content sources
- Unauthorized data scraping or harvesting
- Any service that violates applicable laws

## Allowed Data Sources

### 1. Public Forums (with official APIs)
- **Reddit** - via official Reddit API with proper authentication
- **Stack Exchange** - via official Stack Exchange API
- **Hacker News** - via official Hacker News API

### 2. News and Media
- **NewsAPI** - aggregated news from legitimate sources
- **Google News API** - public news articles
- **Twitter/X API** - public tweets only (with proper authentication)

### 3. Financial and Trading Data
- **Public blockchain explorers** (Bitcoin, Ethereum via official APIs)
- **CoinGecko API** - cryptocurrency market data
- **Alpha Vantage** - stock market data
- **Binance Public API** - trading data from authorized exchanges
- **CoinMarketCap API** - cryptocurrency data

### 4. Licensed Feeds
- Paid data providers with proper licensing agreements
- Enterprise data feeds with documented terms of service

### 5. Manual Human Uploads
- Verified user submissions
- Curated content with explicit provenance tags
- Internal research summaries

## Disallowed Source Patterns

### Automatic Rejection Criteria
The provenance validator will reject any signal containing:
- `tor://`, `.onion`, or references to Tor
- Phrases like "dark web", "darknet market", "illicit marketplace"
- Instructions for illegal activities
- References to prohibited substances or services
- Malware, exploits, or hacking tools (except in security research context with proper authorization)

## Escalation Checklist for Suspicious Content

If suspicious content is detected:

1. **Immediate Actions**
   - Flag signal with status "REQUIRES_REVIEW"
   - Notify admin users via alert system
   - Prevent any automated processing or correlation
   - Log incident with full context

2. **Review Process**
   - Human reviewer examines content within 24 hours
   - Determine if content violates policies
   - Document decision and rationale

3. **Response Actions**
   - **If legitimate**: Mark as verified and proceed
   - **If suspicious but legal**: Request additional provenance, limit distribution
   - **If illegal**: Delete permanently, log incident, consider reporting to authorities
   - **If unclear**: Escalate to legal/compliance team

4. **Post-Incident**
   - Update detection rules if needed
   - Review similar signals for patterns
   - Document lessons learned

## Developer Guidelines

### Code Reviews
- Every data source integration MUST be reviewed by at least 2 developers
- Legal/compliance team approval required for new source types
- Document API terms of service compliance

### Audit Requirements
- Log all data ingestion with full provenance
- Maintain immutable audit trail
- Enable export for compliance investigations

### Testing
- Use only sanitized demo data in tests
- Never include real illicit content in examples
- Validate provenance checks in unit tests

## API Key Management

- Store all API keys in environment variables or secure vault
- Never commit credentials to version control
- Rotate keys regularly
- Limit API key permissions to minimum required

## Data Retention

- Signals: Retain for maximum 90 days unless flagged for review
- Audit logs: Retain for minimum 2 years
- Deleted content: Purge completely, maintain only metadata for audit

## Reporting Violations

If you discover potential violations:
1. Do NOT interact with the content
2. Immediately notify security@company.com
3. Document what you observed
4. Preserve evidence if safe to do so

## Legal References

- Computer Fraud and Abuse Act (CFAA)
- Digital Millennium Copyright Act (DMCA)
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)

**Last Updated:** 2024
**Review Frequency:** Quarterly
