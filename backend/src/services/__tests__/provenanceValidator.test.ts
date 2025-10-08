/**
 * Provenance Validator Tests
 */

import { validateProvenance } from '../provenanceValidator';

describe('ProvenanceValidator', () => {
  describe('validateProvenance', () => {
    it('should accept valid manual upload with legal tags', () => {
      const result = validateProvenance(
        ['manual', 'trading-signal'],
        'MANUAL_UPLOAD',
        'Bitcoin trading volume increased significantly'
      );

      expect(result.isValid).toBe(true);
      expect(result.flagged).toBe(false);
    });

    it('should reject signals with Tor references', () => {
      const result = validateProvenance(
        ['manual'],
        'MANUAL_UPLOAD',
        'Found on tor://hidden-service.onion'
      );

      expect(result.isValid).toBe(false);
      expect(result.flagged).toBe(true);
      expect(result.reason).toContain('disallowed patterns');
    });

    it('should reject signals with dark web references', () => {
      const result = validateProvenance(
        ['dark web source'],
        'MANUAL_UPLOAD',
        'Information from dark web marketplace'
      );

      expect(result.isValid).toBe(false);
      expect(result.flagged).toBe(true);
    });

    it('should reject disallowed source types', () => {
      const result = validateProvenance(
        ['test'],
        'ILLEGAL_SOURCE',
        'Test content'
      );

      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('not in the allowed list');
    });

    it('should flag suspicious keywords for review', () => {
      const result = validateProvenance(
        ['manual'],
        'MANUAL_UPLOAD',
        'Underground trading forum discussion'
      );

      expect(result.isValid).toBe(true);
      expect(result.flagged).toBe(true);
    });

    it('should accept Reddit as valid source', () => {
      const result = validateProvenance(
        ['reddit', 'r/cryptocurrency'],
        'REDDIT',
        'Discussion about Bitcoin adoption'
      );

      expect(result.isValid).toBe(true);
    });

    it('should accept Twitter as valid source', () => {
      const result = validateProvenance(
        ['twitter', '@elonmusk'],
        'TWITTER',
        'Tweet about cryptocurrency'
      );

      expect(result.isValid).toBe(true);
    });

    it('should reject .onion domain references', () => {
      const result = validateProvenance(
        ['manual'],
        'MANUAL_UPLOAD',
        'Source: example.onion/marketplace'
      );

      expect(result.isValid).toBe(false);
      expect(result.flagged).toBe(true);
    });

    it('should reject illicit marketplace references', () => {
      const result = validateProvenance(
        ['manual'],
        'MANUAL_UPLOAD',
        'Found on illicit marketplace selling drugs'
      );

      expect(result.isValid).toBe(false);
    });

    it('should accept blockchain sources', () => {
      const result = validateProvenance(
        ['blockchain', 'etherscan'],
        'BLOCKCHAIN',
        'On-chain data shows large transfer'
      );

      expect(result.isValid).toBe(true);
      expect(result.flagged).toBe(false);
    });
  });
});
