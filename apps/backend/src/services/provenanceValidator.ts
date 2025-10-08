/**
 * Provenance Validator
 * 
 * CRITICAL: This service ensures all data comes from legal, approved sources only.
 * NO dark web, Tor, .onion, or illicit sources are allowed.
 */

import { logger } from '../config/logger';

const ALLOWED_PROVENANCE_TAGS = [
  'reddit:public',
  'twitter:api',
  'news:licensed',
  'blockchain:public',
  'exchange:api',
  'manual:human-upload',
  'research:licensed',
  'telegram:public',
  'stackexchange:api',
  'coingecko:api',
  'etherscan:api',
  'newsapi:licensed'
];

const DISALLOWED_PATTERNS = [
  '.onion',
  'tor',
  'dark web',
  'darkweb',
  'silk road',
  'alphabay',
  'dream market',
  'illegal',
  'exploit',
  'hack',
  'stolen',
  'leaked',
  'pirated'
];

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  flagged: boolean;
}

export class ProvenanceValidator {
  /**
   * Validate that provenance tags are from approved sources
   */
  static validateTags(tags: string[]): ValidationResult {
    if (!tags || tags.length === 0) {
      return {
        isValid: false,
        reason: 'No provenance tags provided',
        flagged: true
      };
    }

    const invalidTags = tags.filter(tag => !ALLOWED_PROVENANCE_TAGS.includes(tag));
    
    if (invalidTags.length > 0) {
      logger.warn('Invalid provenance tags detected:', invalidTags);
      return {
        isValid: false,
        reason: `Invalid provenance tags: ${invalidTags.join(', ')}`,
        flagged: true
      };
    }

    return { isValid: true, flagged: false };
  }

  /**
   * Scan content for disallowed patterns
   */
  static scanContent(content: string): ValidationResult {
    const lowerContent = content.toLowerCase();
    
    for (const pattern of DISALLOWED_PATTERNS) {
      if (lowerContent.includes(pattern)) {
        logger.error('SECURITY ALERT: Disallowed pattern detected:', pattern);
        return {
          isValid: false,
          reason: `Content contains disallowed pattern: "${pattern}"`,
          flagged: true
        };
      }
    }

    return { isValid: true, flagged: false };
  }

  /**
   * Comprehensive validation of signal input
   */
  static async validateSignal(data: {
    gistText: string;
    provenanceTags: string[];
    sourceType?: string;
  }): Promise<ValidationResult> {
    // Validate provenance tags
    const tagValidation = this.validateTags(data.provenanceTags);
    if (!tagValidation.isValid) {
      return tagValidation;
    }

    // Scan content for disallowed patterns
    const contentValidation = this.scanContent(data.gistText);
    if (!contentValidation.isValid) {
      return contentValidation;
    }

    logger.info('Signal validation passed', {
      provenanceTags: data.provenanceTags,
      contentLength: data.gistText.length
    });

    return { isValid: true, flagged: false };
  }

  /**
   * Get list of allowed provenance tags
   */
  static getAllowedTags(): string[] {
    return [...ALLOWED_PROVENANCE_TAGS];
  }
}

export default ProvenanceValidator;
