import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Lesson from '../models/Lesson.js';
import UserProgress from '../models/UserProgress.js';
import QuizAttempt from '../models/QuizAttempt.js';

async function getOrCreateProgress(userId) {
  let progress = await UserProgress.findOne({ user: userId });
  if (!progress) progress = await UserProgress.create({ user: userId, completedLessons: [] });
  return progress;
}

// GET /api/progress  — umumiy statistika (dashboard uchun)
export const getProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const progress = await getOrCreateProgress(userId);

  const attempts = await QuizAttempt.find({ user: userId });
  const quizCount = attempts.length;
  const avgScore =
    quizCount > 0
      ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / quizCount)
      : 0;

  res.json({
    success: true,
    stats: {
      completedLessons: progress.completedLessons.length,
      quizzesTaken: quizCount,
      averageScore: avgScore,
    },
    completedLessons: progress.completedLessons,
  });
});

// POST /api/progress/lessons/:lessonId  — darsni o'rganilgan deb belgilash
export const markLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw ApiError.notFound('Dars topilmadi');

  const progress = await getOrCreateProgress(req.user._id);
  const already = progress.completedLessons.some(
    (c) => String(c.lesson) === String(lessonId)
  );
  if (!already) {
    progress.completedLessons.push({ lesson: lesson._id, subject: lesson.subject });
    await progress.save();
  }

  res.json({ success: true, completed: true, total: progress.completedLessons.length });
});

// DELETE /api/progress/lessons/:lessonId  — belgini olib tashlash
export const unmarkLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const progress = await getOrCreateProgress(req.user._id);
  progress.completedLessons = progress.completedLessons.filter(
    (c) => String(c.lesson) !== String(lessonId)
  );
  await progress.save();
  res.json({ success: true, completed: false, total: progress.completedLessons.length });
});

// GET /api/progress/history  — oxirgi faoliyat (test urinishlari)
export const getHistory = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('subject', 'slug name')
    .populate('quiz', 'title');
  res.json({ success: true, count: attempts.length, attempts });
});
