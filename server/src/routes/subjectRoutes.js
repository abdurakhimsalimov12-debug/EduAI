import { Router } from 'express';
import * as c from '../controllers/subjectController.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import requireDb from '../middleware/requireDb.js';

const router = Router();

router.use(requireDb);

// Ommaviy
router.get('/', c.listSubjects);
router.get('/:id', c.getSubject);

// Admin
router.post('/', protect, requireAdmin, c.createSubject);
router.patch('/:id', protect, requireAdmin, c.updateSubject);
router.delete('/:id', protect, requireAdmin, c.deleteSubject);

export default router;
