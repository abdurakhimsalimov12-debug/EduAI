import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as c from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import requireDb from '../middleware/requireDb.js';
import { chatRules } from '../validators/aiValidators.js';

const router = Router();

// AI so'rovlariga alohida, qattiqroq tezlik limiti.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'AI so\'rovlari juda tez-tez. Biroz kuting.' },
});

router.use(requireDb, protect);

router.post('/chat', aiLimiter, chatRules, validate, c.chat);
router.get('/usage', c.getAiUsage);

export default router;
