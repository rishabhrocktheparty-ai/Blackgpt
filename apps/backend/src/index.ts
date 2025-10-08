/**
 * BLACK GPT Backend API
 * 
 * WARNING: This application MUST NOT access dark web, Tor, or illicit sources.
 * All data sources must comply with legal_sources.md
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { setupRoutes } from './config/routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './config/logger';
import { prisma } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Setup API routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`BLACK GPT Backend running on port ${PORT}`);
  logger.info('Environment: ' + process.env.NODE_ENV);
  logger.warn('LEGAL NOTICE: Only accessing approved public sources');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

export default app;
