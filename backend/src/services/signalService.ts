/**
 * Signal Service
 * Handles business logic for signal creation, retrieval, and verification
 */

import prisma from '../config/database';
import { validateProvenance } from './provenanceValidator';
import { logger } from '../config/logger';
import { Signal, Audit, SignalStatus, SourceType, AuditAction } from '@prisma/client';

export interface CreateSignalInput {
  scriptName: string;
  dateFrom: Date;
  dateTo: Date;
  gistText: string;
  provenanceTags: string[];
  sourceType: SourceType;
  createdBy: number;
  confidenceScore?: number;
}

export interface VerifySignalInput {
  signalId: number;
  reviewerId: number;
  action: 'accept' | 'reject' | 'followup';
  notes?: string;
}

export const createSignal = async (input: CreateSignalInput): Promise<Signal> => {
  // Validate provenance
  const validation = validateProvenance(
    input.provenanceTags,
    input.sourceType,
    input.gistText
  );

  if (!validation.isValid) {
    logger.error('Signal creation blocked - invalid provenance', { input });
    throw new Error(validation.reason || 'Invalid provenance');
  }

  // Create signal
  const signal = await prisma.signal.create({
    data: {
      scriptName: input.scriptName,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      gistText: input.gistText,
      provenanceTags: input.provenanceTags,
      sourceType: input.sourceType,
      createdBy: input.createdBy,
      confidenceScore: input.confidenceScore || 0.0,
      status: validation.flagged ? SignalStatus.REQUIRES_REVIEW : SignalStatus.UNVERIFIED,
      requiresAttention: validation.flagged
    }
  });

  // Create audit log
  await prisma.audit.create({
    data: {
      signalId: signal.id,
      actorId: input.createdBy,
      action: AuditAction.CREATED,
      notes: validation.flagged ? 'Signal flagged for review due to suspicious content' : undefined
    }
  });

  logger.info('Signal created', { signalId: signal.id, status: signal.status });

  return signal;
};

export const getSignalById = async (id: number): Promise<Signal | null> => {
  return prisma.signal.findUnique({
    where: { id },
    include: {
      creator: {
        select: { id: true, email: true, roles: true }
      },
      audits: {
        orderBy: { timestamp: 'desc' },
        include: {
          actor: {
            select: { id: true, email: true }
          }
        }
      },
      correlationJobs: {
        orderBy: { startedAt: 'desc' }
      }
    }
  });
};

export const listSignals = async (filters: {
  status?: SignalStatus;
  dateFrom?: Date;
  dateTo?: Date;
  minConfidence?: number;
  limit?: number;
  offset?: number;
}) => {
  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
    if (filters.dateTo) where.createdAt.lte = filters.dateTo;
  }

  if (filters.minConfidence !== undefined) {
    where.confidenceScore = { gte: filters.minConfidence };
  }

  const signals = await prisma.signal.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: filters.limit || 50,
    skip: filters.offset || 0,
    include: {
      creator: {
        select: { id: true, email: true }
      }
    }
  });

  const total = await prisma.signal.count({ where });

  return { signals, total };
};

export const verifySignal = async (input: VerifySignalInput): Promise<Signal> => {
  const signal = await prisma.signal.findUnique({
    where: { id: input.signalId }
  });

  if (!signal) {
    throw new Error('Signal not found');
  }

  let newStatus: SignalStatus;
  let auditAction: AuditAction;

  switch (input.action) {
    case 'accept':
      newStatus = SignalStatus.HUMAN_VERIFIED;
      auditAction = AuditAction.VERIFIED;
      break;
    case 'reject':
      newStatus = SignalStatus.REJECTED;
      auditAction = AuditAction.REJECTED;
      break;
    case 'followup':
      newStatus = SignalStatus.REQUIRES_REVIEW;
      auditAction = AuditAction.FLAGGED;
      break;
    default:
      throw new Error('Invalid action');
  }

  // Update signal
  const updatedSignal = await prisma.signal.update({
    where: { id: input.signalId },
    data: {
      status: newStatus,
      requiresAttention: input.action === 'followup'
    }
  });

  // Create audit log
  await prisma.audit.create({
    data: {
      signalId: input.signalId,
      actorId: input.reviewerId,
      action: auditAction,
      notes: input.notes
    }
  });

  logger.info('Signal verified', {
    signalId: input.signalId,
    action: input.action,
    reviewerId: input.reviewerId
  });

  return updatedSignal;
};

export const getAuditLog = async (signalId: number): Promise<Audit[]> => {
  return prisma.audit.findMany({
    where: { signalId },
    orderBy: { timestamp: 'desc' },
    include: {
      actor: {
        select: { id: true, email: true }
      }
    }
  });
};
