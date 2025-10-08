/**
 * Audit Controller
 * Handles audit log retrieval
 */

import { Router, Request, Response, NextFunction } from 'express';
import signalService from '../services/signalService';

const router = Router();

/**
 * GET /api/v1/audit/:signalId
 * Get audit trail for a signal
 */
router.get('/:signalId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditTrail = await signalService.getAuditTrail(req.params.signalId);

    res.json({
      success: true,
      data: auditTrail
    });
  } catch (error) {
    next(error);
  }
});

export default router;
