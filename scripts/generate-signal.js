#!/usr/bin/env node

/**
 * Generate Signal Script
 * Seeds a demo signal and triggers correlation pipeline
 * 
 * Usage: node scripts/generate-signal.js --from-file demo.txt
 */

const fs = require('fs');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

// Parse command line arguments
const args = process.argv.slice(2);
const fromFileIndex = args.indexOf('--from-file');
const filename = fromFileIndex !== -1 ? args[fromFileIndex + 1] : null;

// Demo signal data
const demoSignal = {
  scriptName: 'Demo Trading Signal',
  dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  dateTo: new Date().toISOString(),
  gistText: 'Increased trading volume detected for BTC/USD pair. Social sentiment indicators show positive momentum. Multiple news sources reporting institutional interest. Technical analysis suggests potential breakout pattern forming.',
  provenanceTags: ['demo', 'trading-signal', 'crypto'],
  sourceType: 'MANUAL_UPLOAD',
  uploaderUserId: 1,
  confidenceScore: 0.75
};

async function generateSignal() {
  try {
    console.log('🚀 Generating demo signal...\n');

    // Read from file if specified
    let signalData = { ...demoSignal };
    if (filename) {
      console.log(`📄 Reading from file: ${filename}`);
      const fileContent = fs.readFileSync(filename, 'utf-8');
      signalData.gistText = fileContent;
    }

    console.log('Signal data:', JSON.stringify(signalData, null, 2));
    console.log('\n📤 Creating signal...');

    // Create signal
    const createResponse = await axios.post(`${API_URL}/signals/upload`, signalData);
    const signal = createResponse.data.data;

    console.log(`✓ Signal created with ID: ${signal.id}`);
    console.log(`  Status: ${signal.status}`);
    console.log(`  Confidence: ${(signal.confidenceScore * 100).toFixed(1)}%`);

    // Trigger correlation
    console.log('\n🔍 Triggering public web correlation...');
    const correlationResponse = await axios.post(
      `${API_URL}/signals/${signal.id}/research-public`,
      { actorId: 1 }
    );

    const correlation = correlationResponse.data.data;
    console.log(`✓ Correlation job started: ${correlation.jobId}`);
    console.log(`  Correlation Confidence: ${(correlation.correlationConfidence * 100).toFixed(1)}%`);
    console.log(`  Sources Queried: ${correlation.sourcesQueried.join(', ')}`);

    console.log('\n✅ Demo signal generated and correlated successfully!');
    console.log(`\n🌐 View in UI: http://localhost:5173`);
    console.log(`📊 Signal ID: ${signal.id}\n`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run
generateSignal();
