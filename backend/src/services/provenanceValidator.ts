/**
 * Provenance Validation Service
 * 
 * ⚠️ SECURITY CRITICAL ⚠️
 * This service validates that all data sources are legal and auditable.
 * NEVER allow Tor, .onion, or illicit marketplace sources.
 */

import { logger } from '../config/logger';

// Disallowed patterns that trigger immediate rejection
const DISALLOWED_PATTERNS = [
  /tor:\/\//i,
  /\.onion/i,
  /dark\s*web/i,
  /darknet/i,
  /silk\s*road/i,
  /illicit\s*market/i,
  /illegal\s*marketplace/i,
  /drug\s*market/i,
  /weapon\s*market/i,
  /hacking\s*tool/i,
  /exploit\s*kit/i,
  /ransomware/i,
  /malware\s*distribution/i,
  /stolen\s*data/i,
  /credit\s*card\s*fraud/i
];

// Allowed source types
const ALLOWED_SOURCES = [
  'MANUAL_UPLOAD',
  'REDDIT',
  'TWITTER',
  'NEWS_API',
  'BLOCKCHAIN',
  'LICENSED_FEED',
  'EXCHANGE_OTC'
];

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  flagged: boolean;
}

export const validateProvenance = (
  provenanceTags: string[],
  sourceType: string,
  gistText: string
): ValidationResult => {
  // Check if source type is allowed
  if (!ALLOWED_SOURCES.includes(sourceType)) {
    logger.warn('Rejected signal - disallowed source type', { sourceType });
    return {
      isValid: false,
      reason: `Source type '${sourceType}' is not in the allowed list. See legal_sources.md for approved sources.`,
      flagged: true
    };
  }

  // Check provenance tags for disallowed patterns
  const allText = [...provenanceTags, gistText].join(' ');
  
  for (const pattern of DISALLOWED_PATTERNS) {
    if (pattern.test(allText)) {
      logger.error('SECURITY ALERT: Disallowed pattern detected', {
        pattern: pattern.source,
        sourceType
      });
      return {
        isValid: false,
        reason: 'Content contains disallowed patterns. This incident has been logged.',
        flagged: true
      };
    }
  }

  // Check for suspicious keywords that require extra review
  const suspiciousKeywords = [
    'underground', 'black market', 'anonymous', 'untraceable',
    'illegal', 'illicit', 'contraband', 'prohibited'
  ];

  let flagged = false;
  for (const keyword of suspiciousKeywords) {
    if (allText.toLowerCase().includes(keyword)) {
      logger.warn('Suspicious keyword detected - flagging for review', { keyword });
      flagged = true;
      break;
    }
  }

  return {
    isValid: true,
    flagged
  };
};
