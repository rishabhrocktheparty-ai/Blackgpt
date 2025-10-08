/**
 * User Controller
 * Basic user management (placeholder for auth)
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/v1/users/me
 * Get current user (placeholder)
 */
router.get('/me', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      id: 'demo-user',
      email: 'demo@blackgpt.local',
      roles: ['uploader', 'reviewer']
    }
  });
});

export default router;
