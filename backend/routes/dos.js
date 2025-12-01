import express from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// DOS attack simulation metrics
const attackMetrics = {
  totalRequests: 0,
  blockedRequests: 0,
  activeAttacks: 0,
  lastAttackTime: null
};

// Strict rate limiter for DOS testing
const dosTestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Max 100 requests per minute
  message: { 
    success: false, 
    error: 'Too many requests - Rate limit exceeded',
    blocked: true
  },
  handler: (req, res) => {
    attackMetrics.blockedRequests++;
    logger.warn(`DOS attack blocked from ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded - Potential DOS attack detected',
      blocked: true,
      blockedCount: attackMetrics.blockedRequests
    });
  },
  standardHeaders: true,
  legacyHeaders: false
});

// DOS test endpoint - simulates server under load
router.post('/test', authMiddleware, dosTestLimiter, async (req, res) => {
  try {
    const { intensity = 'low', duration = 1000 } = req.body;
    
    attackMetrics.totalRequests++;
    attackMetrics.activeAttacks++;
    attackMetrics.lastAttackTime = new Date();

    logger.info(`DOS test initiated by ${req.user.username} - Intensity: ${intensity}`);

    // Simulate different load levels
    let delay = 100;
    switch (intensity) {
      case 'high':
        delay = 2000;
        break;
      case 'medium':
        delay = 1000;
        break;
      case 'low':
      default:
        delay = 500;
        break;
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, Math.min(delay, duration)));

    attackMetrics.activeAttacks--;

    res.json({
      success: true,
      message: 'DOS test completed',
      metrics: {
        intensity,
        duration: delay,
        totalRequests: attackMetrics.totalRequests,
        blockedRequests: attackMetrics.blockedRequests,
        timestamp: new Date()
      }
    });
  } catch (error) {
    attackMetrics.activeAttacks--;
    logger.error('DOS test error:', error);
    res.status(500).json({
      success: false,
      error: 'DOS test failed'
    });
  }
});

// Get DOS protection status
router.get('/status', authMiddleware, (req, res) => {
  res.json({
    success: true,
    metrics: {
      ...attackMetrics,
      rateLimitConfig: {
        windowMs: '1 minute',
        maxRequests: 100
      },
      protectionActive: true
    }
  });
});

// Stress test endpoint - for testing server capacity
router.post('/stress-test', authMiddleware, async (req, res) => {
  try {
    const { requests = 10, concurrent = 5 } = req.body;

    logger.info(`Stress test initiated by ${req.user.username} - ${requests} requests, ${concurrent} concurrent`);

    const results = {
      total: requests,
      successful: 0,
      failed: 0,
      avgResponseTime: 0,
      startTime: Date.now()
    };

    // Simulate concurrent requests
    const batchSize = Math.min(concurrent, requests);
    const batches = Math.ceil(requests / batchSize);

    for (let i = 0; i < batches; i++) {
      const batchPromises = [];
      const currentBatchSize = Math.min(batchSize, requests - (i * batchSize));

      for (let j = 0; j < currentBatchSize; j++) {
        batchPromises.push(
          new Promise(resolve => {
            const start = Date.now();
            setTimeout(() => {
              const responseTime = Date.now() - start;
              results.successful++;
              results.avgResponseTime += responseTime;
              resolve();
            }, Math.random() * 100);
          })
        );
      }

      await Promise.all(batchPromises);
    }

    results.avgResponseTime = results.avgResponseTime / results.successful;
    results.totalTime = Date.now() - results.startTime;

    logger.info(`Stress test completed: ${results.successful}/${results.total} successful`);

    res.json({
      success: true,
      results
    });
  } catch (error) {
    logger.error('Stress test error:', error);
    res.status(500).json({
      success: false,
      error: 'Stress test failed'
    });
  }
});

// Reset metrics endpoint (admin only)
router.post('/reset-metrics', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }

  attackMetrics.totalRequests = 0;
  attackMetrics.blockedRequests = 0;
  attackMetrics.activeAttacks = 0;
  attackMetrics.lastAttackTime = null;

  logger.info(`DOS metrics reset by ${req.user.username}`);

  res.json({
    success: true,
    message: 'Metrics reset successfully'
  });
});

export default router;
