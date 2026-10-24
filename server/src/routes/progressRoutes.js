import { Router } from 'express';
import * as c from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';
import requireDb from '../middleware/requireDb.js';

const router = Router();

router.use(requireDb, protect); // barcha progress endpointlari login talab qiladi

router.get('/', c.getProgress);
router.get('/history', c.getHistory);
router.post('/lessons/:lessonId', c.markLesson);
router.delete('/lessons/:lessonId', c.unmarkLesson);

export default router;
