# BLACK GPT - Legal Sources and Compliance

## CRITICAL LEGAL NOTICE

**This application MUST NOT access, connect to, or retrieve data from:**
- Tor network or .onion domains
- Dark web marketplaces or illegal forums
- Any illicit or criminal data sources
- Unauthorized private networks or databases

## Allowed Data Sources

### 1. Public Forums and Communities (via Official APIs)
- **Reddit**: Use official Reddit API with proper authentication
- **Stack Exchange**: Use Stack Exchange API v2.3+
- **Discord/Telegram**: Only PUBLIC channels with explicit permission

### 2. Licensed News and Data Feeds
- **News APIs**: NewsAPI.org, Google News API, Bloomberg API (with license)
- **Financial Data**: Alpha Vantage, Yahoo Finance API, CoinGecko API
- **Social Media**: Twitter API v2 (with proper access level)

### 3. Blockchain and On-Chain Data
- **Ethereum**: Etherscan API, Infura
- **Bitcoin**: Blockchain.info API, BlockCypher
- **Multi-chain**: CoinMarketCap API, Messari API

### 4. Exchange and Trading Data
- **Public Exchanges**: Binance API, Coinbase API, Kraken API
- **OTC Feeds**: Only licensed and legally authorized feeds

### 5. Manual Human Uploads
- **Human-curated summaries**: Pre-vetted by authorized personnel
- **Licensed research reports**: From authorized providers only

## Provenance Tags

All data MUST include one of these approved provenance tags:
- `reddit:public`
- `twitter:api`
- `news:licensed`
- `blockchain:public`
- `exchange:api`
- `manual:human-upload`
- `research:licensed`

## Disallowed Patterns (Auto-Reject)

The system will automatically reject any input containing:
- References to `.onion` domains
- Tor browser instructions
- Dark web marketplace names
- Illegal activity instructions
- Hacking or exploitation techniques
- Personal data without consent
- Copyrighted material without license

## Escalation Process

If suspicious content is detected:

1. **Immediate Actions**:
   - Reject the input
   - Log the attempt with timestamp, user ID, and content hash
   - Flag the user account for review

2. **Human Review**:
   - Admin reviews the flagged content
   - Determine if it's malicious or accidental
   - Take appropriate action (warning, suspension, or legal report)

3. **Legal Reporting**:
   - If content involves illegal activity, report to appropriate authorities
   - Preserve audit logs for legal proceedings
   - Cooperate with law enforcement

## Audit Requirements

Every data ingestion MUST log:
- Source type and specific API/endpoint used
- Timestamp of retrieval
- User or service that initiated the request
- Provenance validation result
- Data hash for integrity verification

## Compliance Checklist

Before deploying any new data source integration:

- [ ] Verify the source is on the approved list
- [ ] Obtain necessary API keys and licenses
- [ ] Implement rate limiting per terms of service
- [ ] Add provenance tags to all retrieved data
- [ ] Test provenance validation catches disallowed patterns
- [ ] Document the integration in this file
- [ ] Get admin approval before production deployment

## Developer Guidelines

### DO:
✅ Use official APIs with proper authentication
✅ Respect rate limits and terms of service
✅ Implement robust error handling
✅ Log all data access for audit trails
✅ Validate all inputs for legal compliance
✅ Require human verification for sensitive operations

### DO NOT:
❌ Scrape websites without permission
❌ Access private or restricted networks
❌ Store or process illegal content
❌ Bypass API rate limits or authentication
❌ Remove or modify audit logs
❌ Deploy integrations without approval

## Updates and Maintenance

This document must be reviewed and updated:
- Before adding any new data source
- After any legal or compliance policy changes
- Quarterly during security audits
- Immediately if any unauthorized access is detected

**Last Updated**: 2024-01-08
**Approved By**: System Administrator
**Next Review**: 2024-04-08
