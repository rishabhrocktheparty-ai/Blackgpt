/**
 * Correlation Service
 * Queries ONLY legal public sources for signal correlation
 * 
 * ⚠️ COMPLIANCE WARNING ⚠️
 * This service ONLY queries official public APIs.
 * NEVER add scraping, Tor, or illicit source integrations.
 */

import axios from 'axios';
import prisma from '../config/database';
import { logger } from '../config/logger';
import { AuditAction } from '@prisma/client';

const DEMO_MODE = process.env.DEMO_MODE === 'true';

interface CorrelationSource {
  name: string;
  results: any[];
  confidence: number;
}

/**
 * Query public news APIs for correlation
 */
const queryNewsAPI = async (keywords: string[]): Promise<CorrelationSource> => {
  if (DEMO_MODE || !process.env.NEWS_API_KEY) {
    return {
      name: 'NewsAPI',
      results: [
        { title: 'Demo: Market volatility continues', source: 'Demo News', relevance: 0.8 }
      ],
      confidence: 0.7
    };
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: keywords.join(' OR '),
        apiKey: process.env.NEWS_API_KEY,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 10
      },
      timeout: 10000
    });

    return {
      name: 'NewsAPI',
      results: response.data.articles || [],
      confidence: response.data.totalResults > 0 ? 0.8 : 0.2
    };
  } catch (error) {
    logger.error('NewsAPI query failed', { error });
    return { name: 'NewsAPI', results: [], confidence: 0 };
  }
};

/**
 * Query cryptocurrency market data (CoinGecko - public API)
 */
const queryCryptoData = async (keywords: string[]): Promise<CorrelationSource> => {
  if (DEMO_MODE) {
    return {
      name: 'CoinGecko',
      results: [
        { coin: 'Bitcoin', price: 45000, change_24h: 2.5, volume: 28000000000 }
      ],
      confidence: 0.8
    };
  }

  try {
    // CoinGecko has a free tier that doesn't require API key
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'volume_desc',
        per_page: 20,
        sparkline: false
      },
      timeout: 10000
    });

    return {
      name: 'CoinGecko',
      results: response.data || [],
      confidence: response.data?.length > 0 ? 0.7 : 0.2
    };
  } catch (error) {
    logger.error('CoinGecko query failed', { error });
    return { name: 'CoinGecko', results: [], confidence: 0 };
  }
};

/**
 * Query Reddit for discussions (requires API credentials)
 */
const queryReddit = async (keywords: string[]): Promise<CorrelationSource> => {
  if (DEMO_MODE || !process.env.REDDIT_CLIENT_ID) {
    return {
      name: 'Reddit',
      results: [
        { title: 'Demo: Discussion about market trends', subreddit: 'cryptocurrency', score: 500 }
      ],
      confidence: 0.6
    };
  }

  // Reddit API would require OAuth - placeholder for now
  logger.info('Reddit API integration pending OAuth setup');
  return { name: 'Reddit', results: [], confidence: 0 };
};

/**
 * Main correlation function
 */
export const performCorrelation = async (
  signalId: number,
  actorId: number
): Promise<{
  jobId: string;
  correlationConfidence: number;
  resultGist: string;
  sourcesQueried: string[];
}> => {
  const signal = await prisma.signal.findUnique({ where: { id: signalId } });

  if (!signal) {
    throw new Error('Signal not found');
  }

  // Create correlation job
  const job = await prisma.correlationJob.create({
    data: {
      signalId,
      status: 'IN_PROGRESS'
    }
  });

  try {
    // Extract keywords from gist
    const keywords = extractKeywords(signal.gistText);
    logger.info('Starting correlation', { signalId, keywords });

    // Query public sources in parallel
    const [newsResults, cryptoResults, redditResults] = await Promise.all([
      queryNewsAPI(keywords),
      queryCryptoData(keywords),
      queryReddit(keywords)
    ]);

    const sources = [newsResults, cryptoResults, redditResults];
    const sourcesQueried = sources.map(s => s.name);

    // Calculate overall confidence
    const totalConfidence = sources.reduce((sum, s) => sum + s.confidence, 0);
    const avgConfidence = totalConfidence / sources.length;

    // Generate result gist
    const resultGist = generateCorrelationGist(signal.gistText, sources);

    // Update job
    await prisma.correlationJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        finishedAt: new Date(),
        resultGist,
        correlationConfidence: avgConfidence,
        sourcesQueried,
        rawResults: sources
      }
    });

    // Update signal status
    await prisma.signal.update({
      where: { id: signalId },
      data: {
        status: 'CORRELATED',
        confidenceScore: Math.max(signal.confidenceScore, avgConfidence)
      }
    });

    // Create audit log
    await prisma.audit.create({
      data: {
        signalId,
        actorId,
        action: AuditAction.CORRELATED,
        notes: `Public web correlation completed. Confidence: ${(avgConfidence * 100).toFixed(1)}%`
      }
    });

    logger.info('Correlation completed', {
      signalId,
      jobId: job.jobId,
      confidence: avgConfidence
    });

    return {
      jobId: job.jobId,
      correlationConfidence: avgConfidence,
      resultGist,
      sourcesQueried
    };
  } catch (error) {
    // Update job with error
    await prisma.correlationJob.update({
      where: { id: job.id },
      data: {
        status: 'FAILED',
        finishedAt: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    logger.error('Correlation failed', { signalId, error });
    throw error;
  }
};

/**
 * Extract keywords from text for querying
 */
const extractKeywords = (text: string): string[] => {
  // Simple keyword extraction - in production use NLP library
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4);
  
  // Remove common words
  const stopWords = new Set(['there', 'which', 'their', 'about', 'would', 'these', 'other']);
  return Array.from(new Set(words.filter(w => !stopWords.has(w)))).slice(0, 5);
};

/**
 * Generate correlation summary gist
 */
const generateCorrelationGist = (
  originalGist: string,
  sources: CorrelationSource[]
): string => {
  const findings: string[] = [];

  sources.forEach(source => {
    if (source.results.length > 0) {
      findings.push(`${source.name}: Found ${source.results.length} related items (confidence: ${(source.confidence * 100).toFixed(0)}%)`);
    }
  });

  if (findings.length === 0) {
    return 'No significant correlations found in public sources. This may indicate a unique or emerging signal.';
  }

  return `Correlation analysis:\n${findings.join('\n')}\n\nOriginal signal relevance appears ${findings.length > 1 ? 'high' : 'moderate'} based on public data.`;
};
