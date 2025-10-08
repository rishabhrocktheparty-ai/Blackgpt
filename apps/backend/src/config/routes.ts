import { Express } from 'express';
import signalRoutes from '../controllers/signalController';
import auditRoutes from '../controllers/auditController';
import userRoutes from '../controllers/userController';

export function setupRoutes(app: Express): void {
  app.use('/api/v1/signals', signalRoutes);
  app.use('/api/v1/audit', auditRoutes);
  app.use('/api/v1/users', userRoutes);
}
