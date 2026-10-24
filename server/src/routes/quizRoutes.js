import { Router } from 'express';
import * as c from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import requireDb from '../middleware/requireDb.js';
import { submitRules } from '../validators/quizValidators.js';

const router = Router();

router.use(requireDb);

router.get('/', c.listQuizzes);
router.get('/:id', c.getQuiz);

// Test topshirish va natijalar — login talab qiladi.
router.post('/:id/submit', protect, submitRules, validate, c.submitQuiz);
router.get('/:id/results', protect, c.getQuizResults);

export default router;
