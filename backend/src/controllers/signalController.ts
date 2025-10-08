/**
 * Signal Controller
 * Handles HTTP requests for signal operations
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { 
  createSignal, 
  getSignalById, 
  listSignals, 
  verifySignal, 
  getAuditLog 
} from '../services/signalService';
import { performCorrelation } from '../services/correlationService';
import { SourceType, SignalStatus } from '@prisma/client';
import { logger } from '../config/logger';

const router = Router();

// Validation schemas
const CreateSignalSchema = z.object({
  scriptName: z.string().min(1).max(200),
  dateFrom: z.string().datetime(),
  dateTo: z.string().datetime(),
  gistText: z.string().min(10).max(5000),
  provenanceTags: z.array(z.string()).min(1),
  sourceType: z.enum(['MANUAL_UPLOAD', 'REDDIT', 'TWITTER', 'NEWS_API', 'BLOCKCHAIN', 'LICENSED_FEED', 'EXCHANGE_OTC']),
  uploaderUserId: z.number().int().positive(),
  confidenceScore: z.number().min(0).max(1).optional()
});

const VerifySignalSchema = z.object({
  reviewerId: z.number().int().positive(),
  action: z.enum(['accept', 'reject', 'followup']),
  notes: z.string().optional()
});

/**
 * POST /api/v1/signals/upload
 * Create a new signal
 */
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const validated = CreateSignalSchema.parse(req.body);

    const signal = await createSignal({
      scriptName: validated.scriptName,
      dateFrom: new Date(validated.dateFrom),
      dateTo: new Date(validated.dateTo),
      gistText: validated.gistText,
      provenanceTags: validated.provenanceTags,
      sourceType: validated.sourceType as SourceType,
      createdBy: validated.uploaderUserId,
      confidenceScore: validated.confidenceScore
    });

    res.status(201).json({
      success: true,
      data: signal
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Error creating signal', { error });
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create signal'
    });
  }
});

/**
 * GET /api/v1/signals/:id
 * Get signal by ID with full details
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signal ID'
      });
    }

    const signal = await getSignalById(id);

    if (!signal) {
      return res.status(404).json({
        success: false,
        error: 'Signal not found'
      });
    }

    res.json({
      success: true,
      data: signal
    });
  } catch (error) {
    logger.error('Error fetching signal', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch signal'
    });
  }
});

/**
 * GET /api/v1/signals
 * List signals with filters
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters: any = {};

    if (req.query.status) {
      filters.status = req.query.status as SignalStatus;
    }

    if (req.query.dateFrom) {
      filters.dateFrom = new Date(req.query.dateFrom as string);
    }

    if (req.query.dateTo) {
      filters.dateTo = new Date(req.query.dateTo as string);
    }

    if (req.query.minConfidence) {
      filters.minConfidence = parseFloat(req.query.minConfidence as string);
    }

    if (req.query.limit) {
      filters.limit = parseInt(req.query.limit as string);
    }

    if (req.query.offset) {
      filters.offset = parseInt(req.query.offset as string);
    }

    const result = await listSignals(filters);

    res.json({
      success: true,
      data: result.signals,
      pagination: {
        total: result.total,
        limit: filters.limit || 50,
        offset: filters.offset || 0
      }
    });
  } catch (error) {
    logger.error('Error listing signals', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to list signals'
    });
  }
});

/**
 * POST /api/v1/signals/:id/verify
 * Verify/review a signal
 */
router.post('/:id/verify', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signal ID'
      });
    }

    const validated = VerifySignalSchema.parse(req.body);

    const signal = await verifySignal({
      signalId: id,
      reviewerId: validated.reviewerId,
      action: validated.action,
      notes: validated.notes
    });

    res.json({
      success: true,
      data: signal
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Error verifying signal', { error });
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify signal'
    });
  }
});

/**
 * POST /api/v1/signals/:id/research-public
 * Trigger public web correlation
 */
router.post('/:id/research-public', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signal ID'
      });
    }

    // In production, get actorId from authenticated user
    const actorId = req.body.actorId || 1;

    const result = await performCorrelation(id, actorId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Error performing correlation', { error });
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to perform correlation'
    });
  }
});

/**
 * GET /api/v1/signals/:id/audit
 * Get audit log for a signal
 */
router.get('/:id/audit', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signal ID'
      });
    }

    const auditLog = await getAuditLog(id);

    res.json({
      success: true,
      data: auditLog
    });
  } catch (error) {
    logger.error('Error fetching audit log', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit log'
    });
  }
});

export default router;
