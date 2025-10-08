/**
 * Signal Controller
 * Handles HTTP endpoints for signal operations
 */

import { Router, Request, Response, NextFunction } from 'express';
import signalService from '../services/signalService';
import { apiLimiter, strictLimiter } from '../middleware/rateLimiter';
import { SignalStatus } from '@prisma/client';

const router = Router();

/**
 * POST /api/v1/signals/upload
 * Upload a new signal
 */
router.post('/upload', apiLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { scriptName, dateFrom, dateTo, gistText, provenanceTags, createdBy } = req.body;

    // Validation
    if (!scriptName || !dateFrom || !dateTo || !gistText || !provenanceTags) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const signal = await signalService.createSignal({
      scriptName,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
      gistText,
      provenanceTags,
      createdBy: createdBy || 'anonymous'
    });

    res.status(201).json({
      success: true,
      data: signal
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/signals/:id
 * Get signal by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signal = await signalService.getSignal(req.params.id);

    res.json({
      success: true,
      data: signal
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/signals
 * List signals with filters
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as SignalStatus | undefined,
      dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
      dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
      minConfidence: req.query.minConfidence ? parseInt(req.query.minConfidence as string) : undefined,
      maxConfidence: req.query.maxConfidence ? parseInt(req.query.maxConfidence as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await signalService.listSignals(filters);

    res.json({
      success: true,
      data: result.signals,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/signals/:id/verify
 * Human verification of signal
 */
router.post('/:id/verify', strictLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewerId, action, notes } = req.body;

    if (!reviewerId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: reviewerId, action'
      });
    }

    if (!['accept', 'reject', 'followup'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Must be: accept, reject, or followup'
      });
    }

    const signal = await signalService.verifySignal({
      signalId: req.params.id,
      reviewerId,
      action,
      notes
    });

    res.json({
      success: true,
      data: signal
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/signals/:id/research-public
 * Trigger public web correlation
 */
router.post('/:id/research-public', apiLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { initiatedBy } = req.body;

    const result = await signalService.researchPublicWeb(
      req.params.id,
      initiatedBy || 'system'
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
