#!/usr/bin/env node

/**
 * Demo Signal Generator
 * Generates sample signals for testing BLACK GPT
 * 
 * Usage: node scripts/generate-signal.js [--from-file demo.txt]
 */

const fs = require('fs');
const path = require('path');

const DEMO_SIGNALS = [
  {
    scriptName: 'BTC-ETH-Arbitrage',
    dateFrom: new Date('2024-01-01T00:00:00Z'),
    dateTo: new Date('2024-01-02T00:00:00Z'),
    gistText: 'Bitcoin and Ethereum price correlation shows unusual divergence, suggesting potential arbitrage opportunity. Public exchange data indicates 2.3% spread between major platforms during UTC peak hours.',
    provenanceTags: ['exchange:api', 'blockchain:public'],
    createdBy: 'demo-script'
  },
  {
    scriptName: 'DeFi-TVL-Surge',
    dateFrom: new Date('2024-01-05T00:00:00Z'),
    dateTo: new Date('2024-01-06T00:00:00Z'),
    gistText: 'DeFi Total Value Locked increased by 15% across top 10 protocols. Reddit discussions show increased interest in yield farming strategies. CoinGecko data confirms protocol token price appreciation.',
    provenanceTags: ['reddit:public', 'coingecko:api', 'blockchain:public'],
    createdBy: 'demo-script'
  },
  {
    scriptName: 'Whale-Movement-Alert',
    dateFrom: new Date('2024-01-10T00:00:00Z'),
    dateTo: new Date('2024-01-11T00:00:00Z'),
    gistText: 'Large wallet transfers detected on Ethereum mainnet. 50,000 ETH moved to exchange addresses according to Etherscan. Twitter sentiment analysis shows bearish indicators.',
    provenanceTags: ['etherscan:api', 'twitter:api', 'blockchain:public'],
    createdBy: 'demo-script'
  }
];

async function createSignal(signal) {
  const API_URL = process.env.API_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${API_URL}/api/v1/signals/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signal)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create signal');
    }

    const result = await response.json();
    console.log('✓ Signal created:', result.data.id, '-', signal.scriptName);
    return result.data;
  } catch (error) {
    console.error('✗ Failed to create signal:', signal.scriptName);
    console.error('  Error:', error.message);
    return null;
  }
}

async function main() {
  console.log('BLACK GPT - Demo Signal Generator');
  console.log('===================================\n');

  const args = process.argv.slice(2);
  let signals = DEMO_SIGNALS;

  // Check for --from-file option
  if (args.includes('--from-file')) {
    const fileIndex = args.indexOf('--from-file');
    const filename = args[fileIndex + 1];
    
    if (!filename) {
      console.error('Error: --from-file requires a filename');
      process.exit(1);
    }

    const filePath = path.resolve(process.cwd(), filename);
    
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found: ${filePath}`);
      process.exit(1);
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const customSignal = JSON.parse(content);
      signals = [customSignal];
      console.log(`Loaded signal from: ${filename}\n`);
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.log(`Generating ${signals.length} demo signals...\n`);
  }

  // Create all signals
  const results = [];
  for (const signal of signals) {
    const result = await createSignal(signal);
    if (result) {
      results.push(result);
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✓ Successfully created ${results.length}/${signals.length} signals`);
  
  if (results.length > 0) {
    console.log('\nSignal IDs:');
    results.forEach(r => console.log(`  - ${r.id}`));
    
    console.log('\nYou can now:');
    console.log('  1. View signals in the UI at http://localhost:5173');
    console.log('  2. Verify signals via API');
    console.log('  3. Run public web research');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { createSignal, DEMO_SIGNALS };
