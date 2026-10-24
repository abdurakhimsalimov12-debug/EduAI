import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Subject from '../models/Subject.js';
import Lesson from '../models/Lesson.js';

// GET /api/subjects
export const listSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: subjects.length, subjects });
});

// GET /api/subjects/:id  (id yoki slug bo'yicha)
export const getSubject = asyncHandler(async (req, res) => {
  const subject = await findByIdOrSlug(req.params.id);
  if (!subject) throw ApiError.notFound('Fan topilmadi');

  const lessons = await Lesson.find({ subject: subject._id }).sort({ order: 1 });
  res.json({ success: true, subject, lessons });
});

// POST /api/subjects  (admin)
export const createSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json({ success: true, subject });
});

// PATCH /api/subjects/:id  (admin)
export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!subject) throw ApiError.notFound('Fan topilmadi');
  res.json({ success: true, subject });
});

// DELETE /api/subjects/:id  (admin)
export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);
  if (!subject) throw ApiError.notFound('Fan topilmadi');
  // Bog'liq darslarni ham o'chiramiz.
  await Lesson.deleteMany({ subject: subject._id });
  res.json({ success: true, message: 'Fan o\'chirildi' });
});

async function findByIdOrSlug(idOrSlug) {
  if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
    const byId = await Subject.findById(idOrSlug);
    if (byId) return byId;
  }
  return Subject.findOne({ slug: idOrSlug });
}
