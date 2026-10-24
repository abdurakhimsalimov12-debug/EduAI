import { Router } from 'express';
import * as c from '../controllers/lessonController.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import requireDb from '../middleware/requireDb.js';

const router = Router();

router.use(requireDb);

router.get('/', c.listLessons);
router.get('/:id', c.getLesson);

router.post('/', protect, requireAdmin, c.createLesson);
router.patch('/:id', protect, requireAdmin, c.updateLesson);
router.delete('/:id', protect, requireAdmin, c.deleteLesson);

export default router;
