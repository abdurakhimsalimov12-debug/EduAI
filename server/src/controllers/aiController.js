import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import AIUsage from '../models/AIUsage.js';
import { askTutor, isAiEnabled, AI_LIMITS } from '../services/aiService.js';

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

async function getUsage(userId) {
  const day = today();
  let usage = await AIUsage.findOne({ user: userId, day });
  if (!usage) usage = await AIUsage.create({ user: userId, day, count: 0 });
  return usage;
}

// POST /api/ai/chat
export const chat = asyncHandler(async (req, res) => {
  if (!isAiEnabled()) {
    throw new ApiError(503, 'AI funksiyasi hozircha o\'chiq (API kaliti sozlanmagan).');
  }

  const { question, history = [], lang } = req.body;

  // Kunlik limitni tekshiramiz.
  const usage = await getUsage(req.user._id);
  if (usage.count >= AI_LIMITS.dailyRequestLimit) {
    throw new ApiError(
      429,
      `Kunlik AI so'rovlari limiti (${AI_LIMITS.dailyRequestLimit}) tugadi. Ertaga urinib ko'ring.`
    );
  }

  const language = ['uz', 'ru', 'en'].includes(lang) ? lang : req.user.preferredLanguage;
  const answer = await askTutor({ question, history, lang: language });

  // Muvaffaqiyatli so'rovdan keyin hisoblaymiz.
  usage.count += 1;
  await usage.save();

  res.json({
    success: true,
    answer,
    usage: { used: usage.count, limit: AI_LIMITS.dailyRequestLimit },
  });
});

// GET /api/ai/usage
export const getAiUsage = asyncHandler(async (req, res) => {
  const usage = await getUsage(req.user._id);
  res.json({
    success: true,
    enabled: isAiEnabled(),
    usage: {
      used: usage.count,
      limit: AI_LIMITS.dailyRequestLimit,
      remaining: Math.max(0, AI_LIMITS.dailyRequestLimit - usage.count),
    },
  });
});
