import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';

// GET /api/lessons?subject=<id|slug>
export const listLessons = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.subject) {
    // subject id bo'lsa to'g'ridan-to'g'ri, aks holda e'tiborsiz qoldiramiz.
    if (/^[0-9a-fA-F]{24}$/.test(req.query.subject)) {
      filter.subject = req.query.subject;
    }
  }
  const lessons = await Lesson.find(filter).sort({ order: 1 }).populate('subject', 'slug name icon color');
  res.json({ success: true, count: lessons.length, lessons });
});

// GET /api/lessons/:id
export const getLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate('subject', 'slug name icon color');
  if (!lesson) throw ApiError.notFound('Dars topilmadi');

  // Shu darsga tegishli testlar (javoblarsiz ro'yxat).
  const quizzes = await Quiz.find({ lesson: lesson._id }).select('title level');
  res.json({ success: true, lesson, quizzes });
});

// POST /api/lessons  (admin)
export const createLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.create(req.body);
  res.status(201).json({ success: true, lesson });
});

// PATCH /api/lessons/:id  (admin)
export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!lesson) throw ApiError.notFound('Dars topilmadi');
  res.json({ success: true, lesson });
});

// DELETE /api/lessons/:id  (admin)
export const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);
  if (!lesson) throw ApiError.notFound('Dars topilmadi');
  res.json({ success: true, message: 'Dars o\'chirildi' });
});
