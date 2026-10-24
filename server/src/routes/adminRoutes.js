import { Router } from 'express';
import * as admin from '../controllers/adminController.js';
import * as subjects from '../controllers/subjectController.js';
import * as lessons from '../controllers/lessonController.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import requireDb from '../middleware/requireDb.js';

const router = Router();

// Barcha admin endpointlari: login + admin roli (backendda tekshiriladi).
router.use(requireDb, protect, requireAdmin);

router.get('/users', admin.listUsers);
router.patch('/users/:id/role', admin.setUserRole);
router.get('/stats', admin.getStats);

// Qulaylik uchun admin ostida ham CRUD (asosiylari /subjects, /lessons da ham bor).
router.post('/subjects', subjects.createSubject);
router.patch('/subjects/:id', subjects.updateSubject);
router.delete('/subjects/:id', subjects.deleteSubject);
router.post('/lessons', lessons.createLesson);
router.patch('/lessons/:id', lessons.updateLesson);
router.delete('/lessons/:id', lessons.deleteLesson);

export default router;
