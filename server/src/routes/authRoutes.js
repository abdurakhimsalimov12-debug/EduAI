import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as auth from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import requireDb from '../middleware/requireDb.js';
import { registerRules, loginRules, updateMeRules } from '../validators/authValidators.js';

const router = Router();

// Login/register uchun qattiqroq limit (brute-force'ga qarshi).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Juda ko\'p urinish. Birozdan keyin qayta urinib ko\'ring.' },
});

router.post('/register', requireDb, authLimiter, registerRules, validate, auth.register);
router.post('/login', requireDb, authLimiter, loginRules, validate, auth.login);
router.post('/logout', auth.logout);
router.get('/me', requireDb, protect, auth.me);
router.patch('/me', requireDb, protect, updateMeRules, validate, auth.updateMe);

export default router;
