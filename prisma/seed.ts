/**
 * Database Seed Script
 * Populates database with demo data for testing
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@blackgpt.local' },
    update: {},
    create: {
      email: 'demo@blackgpt.local',
      passwordHash: 'demo-hash', // In production, use proper bcrypt hash
      roles: ['UPLOADER', 'REVIEWER', 'ADMIN']
    }
  });

  console.log('✓ Created demo user:', user.email);

  // Create demo signals
  const signal1 = await prisma.signal.create({
    data: {
      scriptName: 'Bitcoin Surge Analysis',
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-01-07'),
      gistText: `Significant Bitcoin trading activity observed across major exchanges. 
      
Key Indicators:
- Trading volume up 45% week-over-week
- Social sentiment shows 78% positive mentions
- On-chain metrics indicate increased whale activity
- Technical analysis: RSI at 65, MACD bullish crossover

Public sources confirm institutional interest with several hedge funds announcing crypto allocations. News API shows 12 positive articles from Bloomberg, Reuters, and CoinDesk.

Confidence based on multi-source correlation including blockchain data, news sentiment, and social media analysis.`,
      provenanceTags: ['manual', 'trading', 'crypto', 'multi-source'],
      sourceType: 'MANUAL_UPLOAD',
      confidenceScore: 0.78,
      status: 'UNVERIFIED',
      createdBy: user.id
    }
  });

  await prisma.audit.create({
    data: {
      signalId: signal1.id,
      actorId: user.id,
      action: 'CREATED',
      notes: 'Initial signal creation from demo seed'
    }
  });

  console.log('✓ Created signal:', signal1.scriptName);

  const signal2 = await prisma.signal.create({
    data: {
      scriptName: 'Ethereum Network Upgrade Impact',
      dateFrom: new Date('2024-01-05'),
      dateTo: new Date('2024-01-10'),
      gistText: `Analysis of Ethereum network activity following recent upgrade announcement.

Observations:
- Gas fees decreased by 30%
- Transaction throughput improved 25%
- Developer activity on GitHub shows increased commits
- Reddit discussions in r/ethereum showing positive sentiment

Public blockchain data from Etherscan confirms network improvements. News coverage from tech outlets highlighting successful upgrade.`,
      provenanceTags: ['blockchain', 'ethereum', 'public-data'],
      sourceType: 'BLOCKCHAIN',
      confidenceScore: 0.85,
      status: 'HUMAN_VERIFIED',
      createdBy: user.id
    }
  });

  await prisma.audit.createMany({
    data: [
      {
        signalId: signal2.id,
        actorId: user.id,
        action: 'CREATED',
        notes: 'Signal from blockchain data'
      },
      {
        signalId: signal2.id,
        actorId: user.id,
        action: 'VERIFIED',
        notes: 'Verified against multiple blockchain explorers'
      }
    ]
  });

  console.log('✓ Created signal:', signal2.scriptName);

  const signal3 = await prisma.signal.create({
    data: {
      scriptName: 'Market Sentiment Analysis',
      dateFrom: new Date('2024-01-08'),
      dateTo: new Date('2024-01-12'),
      gistText: `Aggregated sentiment analysis from public social media and news sources.

Sources:
- Twitter API: 500+ relevant tweets analyzed
- Reddit API: r/CryptoCurrency, r/Bitcoin discussions
- News API: Financial news sentiment

Overall sentiment: Cautiously optimistic
Key topics: Regulation clarity, institutional adoption, ETF approval speculation`,
      provenanceTags: ['social-media', 'news', 'sentiment-analysis'],
      sourceType: 'TWITTER',
      confidenceScore: 0.65,
      status: 'REQUIRES_REVIEW',
      requiresAttention: true,
      createdBy: user.id
    }
  });

  await prisma.audit.create({
    data: {
      signalId: signal3.id,
      actorId: user.id,
      action: 'CREATED',
      notes: 'Flagged for review due to mixed sentiment sources'
    }
  });

  console.log('✓ Created signal:', signal3.scriptName);

  // Create settings
  await prisma.setting.upsert({
    where: { key: 'allowed_sources' },
    update: {},
    create: {
      key: 'allowed_sources',
      value: JSON.stringify([
        'MANUAL_UPLOAD',
        'REDDIT',
        'TWITTER',
        'NEWS_API',
        'BLOCKCHAIN',
        'LICENSED_FEED',
        'EXCHANGE_OTC'
      ]),
      description: 'List of allowed signal source types'
    }
  });

  await prisma.setting.upsert({
    where: { key: 'rate_limit' },
    update: {},
    create: {
      key: 'rate_limit',
      value: '100',
      description: 'API rate limit per 15 minutes'
    }
  });

  console.log('✓ Created settings');

  console.log('\n✅ Database seeding completed!');
  console.log(`Created ${await prisma.signal.count()} signals`);
  console.log(`Created ${await prisma.audit.count()} audit entries`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
