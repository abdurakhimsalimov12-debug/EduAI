import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

// GET /api/admin/users
export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

// PATCH /api/admin/users/:id/role  — foydalanuvchi rolini o'zgartirish
export const setUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: role === 'admin' ? 'admin' : 'user' },
    { new: true }
  );
  if (!user) return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
  res.json({ success: true, user: user.toJSON() });
});

// GET /api/admin/stats  — umumiy platforma statistikasi
export const getStats = asyncHandler(async (req, res) => {
  const [users, subjects, lessons, quizzes, attempts] = await Promise.all([
    User.countDocuments(),
    Subject.countDocuments(),
    Lesson.countDocuments(),
    Quiz.countDocuments(),
    QuizAttempt.countDocuments(),
  ]);
  res.json({
    success: true,
    stats: { users, subjects, lessons, quizzes, attempts },
  });
});
