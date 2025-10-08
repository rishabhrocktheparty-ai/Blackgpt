/**
 * Signal Service
 * Handles CRUD operations for signals with audit logging
 */

import { prisma } from '../config/database';
import { SignalStatus } from '@prisma/client';
import { logger } from '../config/logger';
import ProvenanceValidator from './provenanceValidator';
import publicApiService from './publicApiService';
import nlpService from './nlpService';

export interface CreateSignalInput {
  scriptName: string;
  dateFrom: Date;
  dateTo: Date;
  gistText: string;
  provenanceTags: string[];
  createdBy: string;
}

export interface VerifySignalInput {
  signalId: string;
  reviewerId: string;
  action: 'accept' | 'reject' | 'followup';
  notes?: string;
}

export class SignalService {
  /**
   * Create a new signal with validation
   */
  async createSignal(input: CreateSignalInput) {
    // Validate provenance
    const validation = await ProvenanceValidator.validateSignal({
      gistText: input.gistText,
      provenanceTags: input.provenanceTags
    });

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.reason}`);
    }

    // Create signal
    const signal = await prisma.signal.create({
      data: {
        scriptName: input.scriptName,
        dateFrom: input.dateFrom,
        dateTo: input.dateTo,
        gistText: input.gistText,
        provenanceTags: input.provenanceTags,
        confidenceScore: 50, // Initial score
        status: SignalStatus.Unverified,
        createdBy: input.createdBy
      }
    });

    // Create audit log
    await this.createAudit({
      signalId: signal.id,
      actorId: input.createdBy,
      action: 'CREATED',
      notes: 'Signal created with provenance validation'
    });

    logger.info('Signal created', { signalId: signal.id, scriptName: input.scriptName });

    return signal;
  }

  /**
   * Get signal by ID with related data
   */
  async getSignal(id: string) {
    const signal = await prisma.signal.findUnique({
      where: { id },
      include: {
        audits: {
          orderBy: { timestamp: 'desc' },
          take: 10
        },
        correlationJobs: {
          orderBy: { startedAt: 'desc' },
          take: 5
        }
      }
    });

    if (!signal) {
      throw new Error('Signal not found');
    }

    return signal;
  }

  /**
   * List signals with filters
   */
  async listSignals(filters: {
    status?: SignalStatus;
    dateFrom?: Date;
    dateTo?: Date;
    minConfidence?: number;
    maxConfidence?: number;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.dateFrom = {};
      if (filters.dateFrom) where.dateFrom.gte = filters.dateFrom;
      if (filters.dateTo) where.dateFrom.lte = filters.dateTo;
    }

    if (filters.minConfidence !== undefined || filters.maxConfidence !== undefined) {
      where.confidenceScore = {};
      if (filters.minConfidence !== undefined) where.confidenceScore.gte = filters.minConfidence;
      if (filters.maxConfidence !== undefined) where.confidenceScore.lte = filters.maxConfidence;
    }

    const [signals, total] = await Promise.all([
      prisma.signal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.signal.count({ where })
    ]);

    return {
      signals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Verify signal (human verification)
   */
  async verifySignal(input: VerifySignalInput) {
    const signal = await this.getSignal(input.signalId);

    let newStatus = signal.status;
    if (input.action === 'accept') {
      newStatus = SignalStatus.HumanVerified;
    } else if (input.action === 'reject') {
      // Keep as Unverified but flagged in audit
      newStatus = SignalStatus.Unverified;
    }

    const updated = await prisma.signal.update({
      where: { id: input.signalId },
      data: { status: newStatus }
    });

    await this.createAudit({
      signalId: input.signalId,
      actorId: input.reviewerId,
      action: `VERIFICATION_${input.action.toUpperCase()}`,
      notes: input.notes || `Signal ${input.action}ed by human reviewer`
    });

    logger.info('Signal verification completed', {
      signalId: input.signalId,
      action: input.action,
      newStatus
    });

    return updated;
  }

  /**
   * Research signal against public web sources
   */
  async researchPublicWeb(signalId: string, initiatedBy: string) {
    const signal = await this.getSignal(signalId);

    // Create correlation job
    const job = await prisma.correlationJob.create({
      data: {
        signalId: signal.id,
        sourcesQueried: []
      }
    });

    try {
      // Correlate with public sources
      const { sources } = await publicApiService.correlatePublicSources(
        signal.scriptName,
        signal.gistText
      );

      // Summarize findings
      const summary = await nlpService.summarize(sources, signal.gistText);

      // Check for contradictions
      const contradiction = await nlpService.detectContradictions(signal.gistText, sources);

      // Update job with results
      const updatedJob = await prisma.correlationJob.update({
        where: { jobId: job.jobId },
        data: {
          finishedAt: new Date(),
          resultGist: summary.gist,
          correlationConfidence: summary.confidenceScore,
          sourcesQueried: sources.map(s => s.source)
        }
      });

      // Update signal confidence
      await prisma.signal.update({
        where: { id: signalId },
        data: {
          confidenceScore: summary.confidenceScore,
          status: contradiction.confidence > 40 
            ? SignalStatus.Unverified 
            : SignalStatus.Correlated
        }
      });

      // Audit log
      await this.createAudit({
        signalId,
        actorId: initiatedBy,
        action: 'PUBLIC_CORRELATION',
        notes: `Found ${sources.length} sources. Confidence: ${summary.confidenceScore}. ${
          contradiction.confidence > 40 ? 'CONTRADICTION DETECTED' : 'No contradictions'
        }`
      });

      logger.info('Public web research completed', {
        signalId,
        sourcesFound: sources.length,
        confidence: summary.confidenceScore,
        contradiction: contradiction.hasContradiction
      });

      return {
        job: updatedJob,
        summary,
        contradiction,
        sources: sources.slice(0, 10) // Limit response size
      };
    } catch (error) {
      // Mark job as failed
      await prisma.correlationJob.update({
        where: { jobId: job.jobId },
        data: {
          finishedAt: new Date(),
          resultGist: `Error: ${(error as Error).message}`
        }
      });

      throw error;
    }
  }

  /**
   * Create audit log entry
   */
  async createAudit(data: {
    signalId: string;
    actorId: string;
    action: string;
    notes?: string;
  }) {
    return await prisma.audit.create({
      data: {
        signalId: data.signalId,
        actorId: data.actorId,
        action: data.action,
        notes: data.notes || ''
      }
    });
  }

  /**
   * Get audit trail for a signal
   */
  async getAuditTrail(signalId: string) {
    return await prisma.audit.findMany({
      where: { signalId },
      orderBy: { timestamp: 'desc' }
    });
  }
}

export default new SignalService();
