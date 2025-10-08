/**
 * BLACK GPT Backend Entry Point
 * 
 * ⚠️ CRITICAL COMPLIANCE WARNING ⚠️
 * This application MUST ONLY connect to legal, auditable data sources.
 * NEVER integrate Tor, .onion domains, dark web marketplaces, or any illicit sources.
 * See legal_sources.md for approved source patterns.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import dotenv from 'dotenv';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import signalRoutes from './controllers/signalController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/signals', signalRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 BLACK GPT Backend running on port ${PORT}`);
  logger.info(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`⚖️  Provenance validation: ${process.env.ENABLE_PROVENANCE_VALIDATION || 'true'}`);
  logger.warn('⚠️  Only legal, auditable sources allowed - See legal_sources.md');
});

export default app;
