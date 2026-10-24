import { Router } from 'express';
import env from '../config/env.js';
import { isDbConnected } from '../config/db.js';

import authRoutes from './authRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import quizRoutes from './quizRoutes.js';
import progressRoutes from './progressRoutes.js';
import aiRoutes from './aiRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

// Health check — Step 1'dan beri.
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'eduai-server',
    status: 'ok',
    time: new Date().toISOString(),
    env: env.nodeEnv,
    db: isDbConnected() ? 'connected' : 'disconnected',
    ai: env.aiEnabled ? 'enabled' : 'disabled',
  });
});

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/lessons', lessonRoutes);
router.use('/quizzes', quizRoutes);
router.use('/progress', progressRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);

export default router;
