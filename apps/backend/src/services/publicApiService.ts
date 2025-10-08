/**
 * Public API Service
 * 
 * Integrates with LEGAL public APIs only:
 * - Reddit API
 * - Twitter API
 * - NewsAPI
 * - CoinGecko
 * - Blockchain APIs
 * 
 * WARNING: Never integrate Tor, dark web, or illicit sources
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from '../config/logger';

export interface CorrelationSource {
  source: string;
  content: string;
  url: string;
  timestamp: Date;
  relevance: number;
}

export class PublicApiService {
  private redditClient: AxiosInstance;
  private newsApiClient: AxiosInstance;
  private cryptoApiClient: AxiosInstance;

  constructor() {
    this.redditClient = axios.create({
      baseURL: 'https://oauth.reddit.com',
      headers: {
        'User-Agent': process.env.REDDIT_USER_AGENT || 'BlackGPT:v1.0.0'
      }
    });

    this.newsApiClient = axios.create({
      baseURL: 'https://newsapi.org/v2',
      params: {
        apiKey: process.env.NEWS_API_KEY
      }
    });

    this.cryptoApiClient = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3'
    });
  }

  /**
   * Search Reddit for public discussions (LEGAL SOURCE)
   */
  async searchReddit(query: string, limit: number = 10): Promise<CorrelationSource[]> {
    if (!process.env.REDDIT_CLIENT_ID || process.env.DEMO_MODE === 'true') {
      logger.info('Reddit API disabled (demo mode or missing credentials)');
      return this.getMockRedditData(query);
    }

    try {
      const response = await this.redditClient.get('/search', {
        params: { q: query, limit, sort: 'relevance' }
      });

      return response.data.data.children.map((post: any) => ({
        source: 'reddit:public',
        content: post.data.title + ' ' + (post.data.selftext || ''),
        url: `https://reddit.com${post.data.permalink}`,
        timestamp: new Date(post.data.created_utc * 1000),
        relevance: post.data.score / 1000
      }));
    } catch (error) {
      logger.error('Reddit API error:', error);
      return [];
    }
  }

  /**
   * Search NewsAPI for related articles (LEGAL SOURCE)
   */
  async searchNews(query: string, limit: number = 10): Promise<CorrelationSource[]> {
    if (!process.env.NEWS_API_KEY || process.env.DEMO_MODE === 'true') {
      logger.info('NewsAPI disabled (demo mode or missing credentials)');
      return this.getMockNewsData(query);
    }

    try {
      const response = await this.newsApiClient.get('/everything', {
        params: {
          q: query,
          pageSize: limit,
          sortBy: 'relevancy',
          language: 'en'
        }
      });

      return response.data.articles.map((article: any) => ({
        source: 'news:licensed',
        content: article.title + ' ' + (article.description || ''),
        url: article.url,
        timestamp: new Date(article.publishedAt),
        relevance: 0.8
      }));
    } catch (error) {
      logger.error('NewsAPI error:', error);
      return [];
    }
  }

  /**
   * Search cryptocurrency data (LEGAL SOURCE)
   */
  async searchCrypto(query: string): Promise<CorrelationSource[]> {
    if (process.env.DEMO_MODE === 'true') {
      logger.info('Crypto API disabled (demo mode)');
      return this.getMockCryptoData(query);
    }

    try {
      const response = await this.cryptoApiClient.get('/search', {
        params: { query }
      });

      return response.data.coins.slice(0, 5).map((coin: any) => ({
        source: 'coingecko:api',
        content: `${coin.name} (${coin.symbol}) - Market Cap Rank: ${coin.market_cap_rank || 'N/A'}`,
        url: `https://www.coingecko.com/en/coins/${coin.id}`,
        timestamp: new Date(),
        relevance: 0.7
      }));
    } catch (error) {
      logger.error('CoinGecko API error:', error);
      return [];
    }
  }

  /**
   * Aggregate correlation data from multiple legal sources
   */
  async correlatePublicSources(
    scriptName: string,
    gistText: string
  ): Promise<{ sources: CorrelationSource[]; totalFound: number }> {
    logger.info('Starting public source correlation', { scriptName });

    const query = `${scriptName} ${gistText.substring(0, 100)}`;

    const [redditResults, newsResults, cryptoResults] = await Promise.all([
      this.searchReddit(query, 5),
      this.searchNews(query, 5),
      this.searchCrypto(scriptName)
    ]);

    const sources = [...redditResults, ...newsResults, ...cryptoResults];

    logger.info('Correlation complete', {
      totalSources: sources.length,
      reddit: redditResults.length,
      news: newsResults.length,
      crypto: cryptoResults.length
    });

    return {
      sources,
      totalFound: sources.length
    };
  }

  // Mock data for demo mode
  private getMockRedditData(query: string): CorrelationSource[] {
    return [
      {
        source: 'reddit:public',
        content: `Discussion about ${query} on r/CryptoCurrency`,
        url: 'https://reddit.com/r/CryptoCurrency/mock',
        timestamp: new Date(),
        relevance: 0.75
      }
    ];
  }

  private getMockNewsData(query: string): CorrelationSource[] {
    return [
      {
        source: 'news:licensed',
        content: `Breaking: ${query} shows significant market movement`,
        url: 'https://example.com/news/mock',
        timestamp: new Date(),
        relevance: 0.85
      }
    ];
  }

  private getMockCryptoData(query: string): CorrelationSource[] {
    return [
      {
        source: 'coingecko:api',
        content: `${query} cryptocurrency data from CoinGecko`,
        url: 'https://coingecko.com/mock',
        timestamp: new Date(),
        relevance: 0.70
      }
    ];
  }
}

export default new PublicApiService();
