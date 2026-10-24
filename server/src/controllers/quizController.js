import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

// GET /api/quizzes?subject=&lesson=
export const listQuizzes = asyncHandler(async (req, res) => {
  const filter = {};
  if (/^[0-9a-fA-F]{24}$/.test(req.query.subject || '')) filter.subject = req.query.subject;
  if (/^[0-9a-fA-F]{24}$/.test(req.query.lesson || '')) filter.lesson = req.query.lesson;

  // correctIndex select:false — javoblar chiqmaydi.
  const quizzes = await Quiz.find(filter)
    .select('title level subject lesson questions.prompt questions.options')
    .populate('subject', 'slug name');
  res.json({ success: true, count: quizzes.length, quizzes });
});

// GET /api/quizzes/:id  — javoblarsiz (to'g'ri javoblar yuborilmaydi)
export const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('subject', 'slug name');
  if (!quiz) throw ApiError.notFound('Test topilmadi');
  // correctIndex va explanation'ni submit'gacha bermaymiz.
  const safe = quiz.toJSON();
  safe.questions = safe.questions.map((q) => ({
    _id: q._id,
    prompt: q.prompt,
    options: q.options,
  }));
  res.json({ success: true, quiz: safe });
});

// POST /api/quizzes/:id/submit  — javoblarni BACKEND tekshiradi
export const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body; // [number | null, ...]

  // Javoblarni olish uchun correctIndex'ni aniq so'raymiz.
  const quiz = await Quiz.findById(req.params.id).select('+questions.correctIndex');
  if (!quiz) throw ApiError.notFound('Test topilmadi');

  if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
    throw ApiError.badRequest('Javoblar soni savollar soniga mos emas');
  }

  let correctCount = 0;
  const results = quiz.questions.map((q, i) => {
    const selected = answers[i];
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correctCount += 1;
    return {
      questionId: q._id,
      selected,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const total = quiz.questions.length;
  const percentage = Math.round((correctCount / total) * 100);

  // Natijani profilda saqlaymiz.
  const attempt = await QuizAttempt.create({
    user: req.user._id,
    quiz: quiz._id,
    subject: quiz.subject,
    answers,
    correctCount,
    total,
    percentage,
  });

  res.json({
    success: true,
    attemptId: attempt._id,
    correctCount,
    total,
    percentage,
    results,
  });
});

// GET /api/quizzes/:id/results  — joriy foydalanuvchining shu test urinishlari
export const getQuizResults = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({
    user: req.user._id,
    quiz: req.params.id,
  }).sort({ createdAt: -1 });
  res.json({ success: true, count: attempts.length, attempts });
});
