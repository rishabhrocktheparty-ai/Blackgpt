# BLACK GPT - UI Design Documentation

## Design System

### Color Palette

```
Primary Background: #000000 (Pure Black)
Secondary Background: #0a0a0a (Near Black)
Card Borders: #1f1f1f (Dark Gray)
Text Primary: #ffffff (White)
Text Secondary: #9ca3af (Gray 400)
Accent Primary: #00ffff (Neon Teal)
Accent Secondary: #ffbf00 (Neon Amber)
Success: #4ade80 (Green 400)
Warning: #fbbf24 (Yellow 400)
Error: #f87171 (Red 400)
```

### Typography

```
Headings: Inter, 22-28px, Font Weight 700
Body: Inter, 16-18px, Font Weight 400
Small Text: Inter, 12-14px, Font Weight 400
Code/Mono: Fira Code, monospace
```

### Spacing

```
Padding (Cards): 1.5rem (24px)
Gap (Components): 1rem - 2rem (16-32px)
Border Radius: 0.5rem (8px)
```

## Components

### 1. Header

```
┌─────────────────────────────────────────────────────────┐
│  BLACK GPT                                              │
│  Hidden Market Signals • Legal Public Sources Only      │
└─────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: Pure black
- Border bottom: 1px solid gray-800
- Title: 3xl, bold, gradient text (teal to amber)
- Subtitle: Small, gray-400

### 2. Main Panel (Left Side)

```
┌─────────────────────────────────────┐
│  Upload Signal                      │
│                                     │
│  Script Name                        │
│  ┌─────────────────────────────┐   │
│  │ BTC-ETH-Arbitrage          │   │
│  └─────────────────────────────┘   │
│                                     │
│  From              To               │
│  ┌───────────┐   ┌───────────┐    │
│  │2024-01-01 │   │2024-01-02 │    │
│  └───────────┘   └───────────┘    │
│                                     │
│  Signal Gist                        │
│  ┌─────────────────────────────┐   │
│  │ Enter your market signal    │   │
│  │ summary...                  │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Provenance Tags                    │
│  [manual:human-upload] [reddit:..] │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Upload Signal           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Styling:**
- Card with gradient background
- Input fields: Black-secondary bg, gray-700 border
- Focus: Neon teal border
- Button: Neon teal bg, black text, hover scale effect
- Tags: Pill-shaped buttons, selected = teal bg

### 3. Gist Card (Right Side)

```
┌─────────────────────────────────────────────────────────┐
│  BTC-ETH-Arbitrage                  [Requires Attention]│
│  Jan 01, 2024 12:00 → Jan 02, 2024 12:00               │
│                                                         │
│  Dark-Signal Gist                                       │
│  ──────────────────────────────────────────────────── │
│  Bitcoin and Ethereum price correlation shows unusual   │
│  divergence, suggesting potential arbitrage opportunity.│
│  Public exchange data indicates 2.3% spread between     │
│  major platforms during UTC peak hours.                 │
│                                                         │
│  ─────────────────────────────────────────────────────│
│  Provenance: [exchange:api] [blockchain:public]         │
│  • Confidence: 75% • Status: Unverified                 │
│                                                         │
│  ┌─────────────────────────────────┐                   │
│  │  Require Human Verification     │                   │
│  └─────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

**Styling:**
- Left border: 4px solid teal (normal) or amber (attention required)
- Gist text: 16-18px, line-height relaxed
- Metadata: Small text, inline tags
- Confidence: Color coded (green ≥70%, yellow ≥50%, red <50%)
- Status colors: Yellow (Unverified), Green (HumanVerified), Teal (Correlated)

### 4. Verification Modal

```
┌────────────────────────────────────────────────────┐
│  Human Verification                            [×] │
│  Review and verify this signal                     │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │  BTC-ETH-Arbitrage                           │ │
│  │  Bitcoin and Ethereum price correlation...   │ │
│  │  [exchange:api] [blockchain:public]          │ │
│  │  Confidence: 75%                             │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  Verification Action                               │
│  ┌────────┐  ┌────────┐  ┌────────┐             │
│  │   ✓    │  │   ✕    │  │   ⚠    │             │
│  │ Accept │  │ Reject │  │Follow-up│             │
│  └────────┘  └────────┘  └────────┘             │
│                                                    │
│  Reviewer Notes                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Add your verification notes here...          │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────┐  ┌─────────────────────────────┐  │
│  │  Cancel  │  │  Submit Verification        │  │
│  └──────────┘  └─────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

**Styling:**
- Backdrop: Black with 80% opacity + blur
- Modal: Card with max-width, centered
- Action buttons: Border-2, selected = colored background
- Submit button: Neon teal, full width

### 5. Correlation Results Modal

```
┌────────────────────────────────────────────────────┐
│  Public Web Correlation Results                [×] │
│  Analyzed 8 public sources                         │
│                                                    │
│  Correlation Summary                               │
│  ┌──────────────────────────────────────────────┐ │
│  │  Correlation analysis confirms the signal.   │ │
│  │  Found 8 supporting sources from Reddit,     │ │
│  │  NewsAPI, and blockchain data.               │ │
│  │                                              │ │
│  │  Confidence: 82%    Model: gpt-4            │ │
│  │  Key Signals: [Pattern 1] [Pattern 2]       │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ⚠ Contradiction Detected                          │
│  Counter-evidence suggests potential false signal  │
│  Confidence: 45% • Requires additional review      │
│                                                    │
│  Public Sources (8)                                │
│  ┌──────────────────────────────────────────────┐ │
│  │ [reddit:public]           Relevance: 85%    │ │
│  │ Discussion about BTC-ETH correlation...      │ │
│  │ View source ↗                                │ │
│  └──────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────┐ │
│  │ [news:licensed]           Relevance: 78%    │ │
│  │ Bitcoin shows strong correlation with...     │ │
│  │ View source ↗                                │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │                  Close                       │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

**Styling:**
- Max height with scrollable sources
- Contradiction warning: Amber left border, amber/5 background
- Sources: Individual cards with metadata
- Links: Teal color with external icon

### 6. Audit Log

```
┌─────────────────────────────────────────────────────┐
│  Audit Trail                            [Expand ▼] │
│                                                     │
│  📝  CREATED                    Jan 01, 12:00:00   │
│      Signal created with provenance validation     │
│      by demo-user                                  │
│                                                     │
│  ✓   VERIFICATION_ACCEPT        Jan 01, 14:30:22   │
│      Signal verified and approved                  │
│      by reviewer-123                               │
│                                                     │
│  🔍  PUBLIC_CORRELATION         Jan 01, 15:45:10   │
│      Found 8 sources. Confidence: 82%.             │
│      by demo-user                                  │
│                                                     │
│  All actions are immutably logged for compliance   │
└─────────────────────────────────────────────────────┘
```

**Styling:**
- Collapsible with expand/collapse button
- Timeline with icons
- Action color coded (green accept, red reject, teal correlation)
- Timestamps in small text
- Legal notice at bottom

### 7. Fixed Button (Bottom Right)

```
                                    ┌──────────────────────────┐
                                    │ Re-search Public Web  → │
                                    └──────────────────────────┘
```

**Styling:**
- Fixed position: bottom-right
- Large padding (8px x 32px)
- Neon teal background
- Shadow: 2xl with teal glow
- Hover: Scale 105%
- Active: Scale 95%

### 8. Onboarding Tooltip

```
                        ┌────────────────────────────┐
                        │ ● Welcome to BLACK GPT     │
                        │   All signals require      │
                        │   human verification.      │
                        │   We only use legal        │
                        │   public data sources.     │
                        └────────────────────────────┘
```

**Styling:**
- Fixed top-right
- Fades in with animation
- Auto-dismisses after 5 seconds
- Pulse animation on dot indicator

## Responsive Behavior

### Desktop (≥1024px)
- Two-column layout
- Main panel: 33% width
- Gist card: 67% width
- All features visible

### Tablet (768px - 1023px)
- Single column layout
- Main panel full width
- Gist card full width, stacked below

### Mobile (<768px)
- Single column
- Reduced padding
- Smaller font sizes
- Touch-optimized buttons

## Accessibility

### WCAG AA Compliance
- Color contrast ratio: > 4.5:1
- Focus indicators: Visible teal outline
- Keyboard navigation: Full support
- Screen reader labels: All interactive elements
- Alt text: All icons and images

### Keyboard Shortcuts
- Tab: Navigate between fields
- Enter: Submit forms
- Escape: Close modals
- Arrow keys: Navigate lists

## Animation & Transitions

```css
/* Hover Effects */
button:hover {
  transform: scale(1.05);
  transition: all 150ms ease;
}

/* Active Effects */
button:active {
  transform: scale(0.95);
}

/* Fade In */
.fade-in {
  animation: fadeIn 300ms ease-in;
}

/* Card Hover */
.card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 255, 255, 0.1);
}
```

## Dark Theme Consistency

All elements follow the black theme:
- Background: Pure black (#000000)
- Cards: Subtle gradient from #0a0a0a
- Borders: Low-contrast grays
- Text: High-contrast white/gray
- Accents: Neon colors for important actions
- Shadows: Black with colored glows

## Legal & Compliance Indicators

Visual indicators throughout:
- ⚠️ Warning icons for attention required
- ✓ Checkmarks for verified status
- 🔍 Search icon for correlation
- 📝 Document icon for creation
- 🚫 Block icons for prohibited sources

All compliance text in small, gray font at bottom of sections.
