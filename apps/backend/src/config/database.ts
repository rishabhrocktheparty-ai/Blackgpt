import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Test connection
prisma.$connect()
  .then(() => logger.info('Database connected successfully'))
  .catch((err: Error) => logger.error('Database connection failed:', err));

export default prisma;
