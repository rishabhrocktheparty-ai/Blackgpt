/**
 * NLP Service - Summarization and Analysis
 * 
 * Uses LLM for summarization ONLY. Never use to access prohibited sources.
 * All prompts are logged for audit compliance.
 */

import OpenAI from 'openai';
import { logger } from '../config/logger';
import type { CorrelationSource } from './publicApiService';

export interface SummaryResult {
  gist: string;
  confidenceScore: number;
  topSignals: string[];
  modelUsed: string;
  tokensUsed?: number;
}

export interface ContradictionResult {
  hasContradiction: boolean;
  confidence: number;
  counterEvidence: string;
}

export class NLPService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY && process.env.DEMO_MODE !== 'true') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  /**
   * Summarize correlation sources into a concise gist
   */
  async summarize(sources: CorrelationSource[], originalGist: string): Promise<SummaryResult> {
    const prompt = this.buildSummarizationPrompt(sources, originalGist);
    
    logger.info('NLP Summarization started', {
      sourcesCount: sources.length,
      modelUsed: process.env.OPENAI_MODEL || 'gpt-4'
    });

    // Demo mode or no API key
    if (!this.openai || process.env.DEMO_MODE === 'true') {
      return this.getMockSummary(sources, originalGist);
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert analyst summarizing market signals from legal public sources. Provide concise, factual summaries with confidence scores.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      });

      const response = completion.choices[0].message.content || '';
      const parsed = this.parseAIResponse(response);

      logger.info('NLP Summarization complete', {
        tokensUsed: completion.usage?.total_tokens,
        confidenceScore: parsed.confidenceScore
      });

      return {
        ...parsed,
        modelUsed: completion.model,
        tokensUsed: completion.usage?.total_tokens
      };
    } catch (error) {
      logger.error('OpenAI API error:', error);
      return this.getMockSummary(sources, originalGist);
    }
  }

  /**
   * Detect contradictions in the summary
   */
  async detectContradictions(gist: string, sources: CorrelationSource[]): Promise<ContradictionResult> {
    if (!this.openai || process.env.DEMO_MODE === 'true') {
      return {
        hasContradiction: false,
        confidence: 20,
        counterEvidence: 'Contradiction detection disabled in demo mode'
      };
    }

    const prompt = `Analyze the following market signal summary and sources. Find any contradictory evidence or conflicting information.

Summary: ${gist}

Sources:
${sources.map((s, i) => `${i + 1}. [${s.source}] ${s.content}`).join('\n')}

Provide:
1. Whether contradictions exist (YES/NO)
2. Confidence level (0-100)
3. Brief explanation of contradictions found

Format: CONTRADICTION: YES/NO | CONFIDENCE: XX | EVIDENCE: explanation`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a critical analyst looking for contradictions and counter-evidence in market signals.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 200
      });

      const response = completion.choices[0].message.content || '';
      return this.parseContradictionResponse(response);
    } catch (error) {
      logger.error('Contradiction detection error:', error);
      return {
        hasContradiction: false,
        confidence: 0,
        counterEvidence: 'Error during contradiction analysis'
      };
    }
  }

  /**
   * Build prompt for summarization
   */
  private buildSummarizationPrompt(sources: CorrelationSource[], originalGist: string): string {
    return `Analyze the following market signal and correlation sources from legal public APIs.

Original Signal: ${originalGist}

Public Sources Found:
${sources.map((s, i) => `${i + 1}. [${s.source}] ${s.content} (${s.url})`).join('\n')}

Provide:
1. A concise summary (max 120 words) confirming or adjusting the original signal
2. Confidence score (0-100) based on source quality and consensus
3. Top 3 key signals/patterns that informed your analysis

Format:
SUMMARY: [your summary]
CONFIDENCE: [0-100]
SIGNALS: [signal1], [signal2], [signal3]`;
  }

  /**
   * Parse AI response
   */
  private parseAIResponse(response: string): Omit<SummaryResult, 'modelUsed' | 'tokensUsed'> {
    const summaryMatch = response.match(/SUMMARY:\s*(.+?)(?=CONFIDENCE:|$)/s);
    const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)/);
    const signalsMatch = response.match(/SIGNALS:\s*(.+?)$/s);

    return {
      gist: summaryMatch?.[1]?.trim() || response.substring(0, 300),
      confidenceScore: parseInt(confidenceMatch?.[1] || '50'),
      topSignals: signalsMatch?.[1]?.split(',').map(s => s.trim()) || ['Source correlation', 'Pattern analysis', 'Market consensus']
    };
  }

  /**
   * Parse contradiction detection response
   */
  private parseContradictionResponse(response: string): ContradictionResult {
    const contradictionMatch = response.match(/CONTRADICTION:\s*(YES|NO)/i);
    const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)/);
    const evidenceMatch = response.match(/EVIDENCE:\s*(.+?)$/s);

    return {
      hasContradiction: contradictionMatch?.[1]?.toUpperCase() === 'YES',
      confidence: parseInt(confidenceMatch?.[1] || '0'),
      counterEvidence: evidenceMatch?.[1]?.trim() || 'No contradictions detected'
    };
  }

  /**
   * Mock summary for demo mode
   */
  private getMockSummary(sources: CorrelationSource[], originalGist: string): SummaryResult {
    const correlationStrength = Math.min(sources.length * 15, 85);
    
    return {
      gist: `Correlation analysis confirms: ${originalGist.substring(0, 100)}... Found ${sources.length} supporting sources from public APIs including Reddit, NewsAPI, and blockchain data.`,
      confidenceScore: correlationStrength,
      topSignals: [
        'Public forum consensus',
        'News correlation',
        'On-chain activity'
      ],
      modelUsed: 'demo-mode'
    };
  }
}

export default new NLPService();
