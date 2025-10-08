# BLACK GPT - Features & User Guide

## Overview

BLACK GPT is a signal intelligence platform that helps you collect, verify, and correlate information from legal public sources. This guide explains all features and how to use them.

## Core Features

### 1. Signal Creation 📝

**What it does:**
Create new signals from various legal data sources with complete provenance tracking.

**How to use:**
1. Fill in the "Script Name" (e.g., "Bitcoin Trading Analysis")
2. Select date range using "Date From" and "Date To" pickers
3. Choose a "Source Type" from the dropdown:
   - Manual Upload
   - Reddit
   - Twitter
   - News API
   - Blockchain
   - Licensed Feed
   - Exchange OTC
4. Enter your signal description in "Signal Gist" (10-5000 characters)
5. Click "Create Signal"

**Validation:**
- All fields are required
- Gist must be 10-5000 characters
- Provenance is automatically validated
- Illegal patterns are automatically rejected

**Example Signal:**
```
Script Name: Bitcoin Price Surge
Date From: 2024-01-01 00:00
Date To: 2024-01-07 23:59
Source Type: Manual Upload
Gist: Observed significant trading volume increase across 
major exchanges. Social sentiment analysis shows 75% positive 
mentions. On-chain metrics indicate whale accumulation.
```

### 2. Signal List & Selection 📋

**What it does:**
Browse all created signals and select one to view details.

**Features:**
- Shows signal name, status, and confidence score
- Color-coded status indicators:
  - 🔴 Red: Rejected
  - 🟡 Yellow: Requires Review
  - 🔵 Blue: Correlated
  - 🟢 Green: Human Verified
  - ⚪ Gray: Unverified
- ⚠️ Warning icon for signals requiring attention
- Auto-selects first signal on load

**How to use:**
1. View list on left side of screen
2. Click any signal to view full details
3. Selected signal is highlighted with teal border

### 3. Dark-Signal Gist Display 🎯

**What it does:**
Displays complete signal information in a clean, readable format.

**Information shown:**
- Script name and date range
- Full gist content (center panel with teal border)
- Provenance tags (source labels)
- Confidence score (0-100%)
- Status badge
- Creator information
- Timestamps

**Metadata indicators:**
- **Provenance**: Source tags showing data origin
- **Confidence**: Percentage score with color coding:
  - 🟢 Green: ≥70% (high confidence)
  - 🟡 Yellow: 40-70% (medium confidence)
  - 🔴 Red: <40% (low confidence)
- **Status**: Current signal state
- **Requires Attention**: Yellow warning if flagged
- **Contradiction Flag**: Red warning if AI detected issues

### 4. Human Verification 👤

**What it does:**
Enables human review and approval of signals before they become actionable.

**How to use:**
1. Click "Verify" button on any signal
2. Review signal details in modal:
   - Script name and source
   - Provenance tags
   - Confidence score
   - Full gist content
3. Choose verification action:
   - ✓ **Accept**: Signal is legitimate and verified
   - ⚠️ **Follow-up**: Needs additional review
   - ✕ **Reject**: Signal is invalid or problematic
4. Add optional notes explaining your decision
5. Click "Submit Verification"

**What happens:**
- Signal status is updated
- Audit log entry is created
- Reviewer is recorded
- Timestamp is saved
- Notes are preserved

**Best practices:**
- Always review provenance tags
- Check confidence scores
- Look for suspicious patterns
- Add detailed notes for rejections
- Flag uncertain cases for follow-up

### 5. Public Web Correlation 🔍

**What it does:**
Cross-references signals with publicly available data from legal sources.

**How to use:**
1. View any signal
2. Click the **"🔍 Re-search Public Web"** button (bottom-right, fixed position)
3. Wait for correlation to complete (usually 5-10 seconds)
4. View results in new panel below gist

**Data sources queried:**
- **NewsAPI**: Recent news articles
- **CoinGecko**: Cryptocurrency market data
- **Reddit**: Public discussions (when configured)
- **Twitter**: Public tweets (when configured)
- **Blockchain**: On-chain data

**Correlation results show:**
- Summary of findings
- Correlation confidence score
- List of sources queried
- Timestamp of correlation
- Detailed findings from each source

**Confidence scoring:**
- Based on number of matching sources
- Quality and relevance of results
- Cross-source validation
- Sentiment analysis

**Example output:**
```
Correlation analysis:
NewsAPI: Found 8 related items (confidence: 80%)
CoinGecko: Found 5 related items (confidence: 70%)

Original signal relevance appears high based on public data.
```

### 6. Audit Log 📜

**What it does:**
Displays complete, immutable history of all actions on a signal.

**How to use:**
1. Click "Audit Log" button on any signal
2. View chronological list of events
3. Each entry shows:
   - Action type (Created, Verified, Correlated, etc.)
   - Actor (who performed the action)
   - Timestamp
   - Notes (if provided)

**Action types:**
- ➕ **CREATED**: Signal was created
- ✓ **VERIFIED**: Human verification completed
- ✕ **REJECTED**: Signal was rejected
- 🔍 **CORRELATED**: Public correlation performed
- ⚠️ **FLAGGED**: Flagged for review
- 📝 **UPDATED**: Signal was modified
- 🗑️ **DELETED**: Signal was deleted

**Use cases:**
- Compliance audits
- Understanding signal history
- Tracking who did what
- Investigating issues
- Demonstrating accountability

### 7. Onboarding & Help 💡

**What it does:**
First-time user tutorial explaining key concepts.

**Shown on:**
- First visit to application
- Can be closed and won't show again

**Topics covered:**
- Legal sources only policy
- Human verification requirement
- Public web correlation feature
- Audit trail capabilities
- Compliance warnings

**How to see again:**
Clear browser localStorage and refresh page.

## UI Design Features

### Black Theme 🎨

**Color scheme:**
- Pure black background (#000000)
- Dark cards (#0a0a0a) with subtle borders
- Teal accent (#00d4aa) for primary actions
- Amber accent (#ffa500) for warnings
- White text on black for maximum readability

**Typography:**
- Headlines: 22-28px, bold
- Gist content: 18px, readable
- Body text: 16px
- Metadata: 14px, gray

**Accessibility:**
- WCAG AA compliant (4.5:1 contrast)
- Keyboard navigation supported
- Screen reader friendly
- Focus indicators on all interactive elements

### Layout

```
┌─────────────────────────────────────────────────────┐
│  BLACK GPT          Signal Intelligence Platform    │
│                                     ✓ Legal Sources │
├──────────────────┬──────────────────────────────────┤
│                  │                                   │
│  Signal Form     │         Gist Display              │
│  ┌────────────┐  │  ┌─────────────────────────┐     │
│  │ Name       │  │  │ Dark-Signal Gist        │     │
│  │ Date Range │  │  │                         │     │
│  │ Source     │  │  │ [Full signal content]   │     │
│  │ Gist       │  │  │                         │     │
│  │ [Create]   │  │  └─────────────────────────┘     │
│  └────────────┘  │  Provenance • Confidence • Status│
│                  │                                   │
│  Signal List     │  [Verify] [Audit Log]            │
│  ┌────────────┐  │                                   │
│  │ Signal 1   │  │  Correlation Results             │
│  │ Signal 2 ⚠│  │  ┌─────────────────────────┐     │
│  │ Signal 3   │  │  │ [Correlation data]      │     │
│  └────────────┘  │  └─────────────────────────┘     │
│                  │                                   │
└──────────────────┴──────────────────────────────────┘
                             [🔍 Re-search Public Web]
```

## Advanced Features

### Status Workflow

Signal progresses through states:

```
UNVERIFIED
    ↓ (human verify: accept)
HUMAN_VERIFIED
    ↓ (research public)
CORRELATED
```

Or alternatively:
```
UNVERIFIED
    ↓ (provenance flags)
REQUIRES_REVIEW
    ↓ (human verify: accept)
HUMAN_VERIFIED
```

Or rejection:
```
UNVERIFIED
    ↓ (human verify: reject)
REJECTED
```

### Flagging System

Signals are automatically flagged when:
- Confidence score < 60%
- Provenance contains low-trust sources
- Suspicious keywords detected
- Contradiction detector finds issues

Flagged signals show:
- ⚠️ "Requires Attention" badge
- Yellow warning message
- Cannot be correlated until verified
- Must be reviewed by human

### API Integration

**For developers:**

All features are backed by REST API:

```bash
# Create signal
POST /api/v1/signals/upload

# Get signal
GET /api/v1/signals/:id

# List signals
GET /api/v1/signals?status=UNVERIFIED&limit=10

# Verify signal
POST /api/v1/signals/:id/verify

# Correlate
POST /api/v1/signals/:id/research-public

# Audit log
GET /api/v1/signals/:id/audit
```

See [README.md](./README.md) for full API documentation.

## Keyboard Shortcuts

- `Tab`: Navigate between fields
- `Enter`: Submit forms
- `Esc`: Close modals
- Arrow keys: Navigate signal list

## Tips & Best Practices

### Creating Good Signals

✅ **Do:**
- Provide clear, concise descriptions
- Include specific dates
- Tag sources accurately
- Add relevant context
- Use proper formatting

❌ **Don't:**
- Use vague descriptions
- Mix multiple timeframes
- Omit source information
- Include illegal content
- Add personal opinions without data

### Verification Guidelines

✅ **Accept when:**
- Source is legitimate and verified
- Confidence score is high
- Data is corroborated by multiple sources
- Provenance is clear

⚠️ **Flag for follow-up when:**
- Confidence is medium
- Source needs additional verification
- Data seems unusual but not invalid
- More research needed

❌ **Reject when:**
- Source is questionable or illegal
- Data appears fabricated
- Provenance cannot be verified
- Violates policies

### Correlation Best Practices

- Run correlation after human verification
- Review correlation confidence scores
- Check which sources found matches
- Note any discrepancies
- Re-run if external data changes

## Troubleshooting

### Signal Creation Fails

**Problem:** Error message when creating signal

**Solutions:**
1. Check all required fields are filled
2. Ensure gist is 10-5000 characters
3. Verify source type is selected
4. Check for illegal keywords
5. Review error message details

### No Correlation Results

**Problem:** Correlation returns no data

**Possible reasons:**
1. Signal topic too niche
2. External APIs are down
3. No matching public data
4. Rate limits reached
5. API keys not configured

**What to do:**
- Try again later
- Check backend logs
- Verify API keys in .env
- Enable demo mode for testing

### Verification Not Working

**Problem:** Cannot verify signal

**Check:**
1. Signal exists and is loaded
2. You have reviewer permissions
3. Backend is running
4. Database is accessible

## Demo Mode

For testing without external APIs:

1. Set `DEMO_MODE=true` in `.env`
2. Restart backend
3. Correlation will use canned responses
4. No API keys required

## Support

Need help?

- 📖 Read [SETUP.md](./SETUP.md) for installation
- 🏗️ Check [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- 📋 Review [README.md](./README.md) for overview
- ⚖️ See [legal_sources.md](./legal_sources.md) for compliance

## Feature Roadmap

Coming soon:
- [ ] WebSocket real-time updates
- [ ] Email notifications
- [ ] Advanced filtering
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Analytics dashboard
- [ ] Mobile responsive design
- [ ] Multi-language support

---

**Remember:** BLACK GPT only processes legal, auditable data sources. Never attempt to integrate dark web, Tor, or illicit sources. 🔒
