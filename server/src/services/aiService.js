import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

// So'rov limitlari (xarajat va suiiste'molni cheklash uchun).
export const AI_LIMITS = {
  maxQuestionLength: 1000,
  maxHistoryMessages: 10,
  dailyRequestLimit: 30,
};

const SYSTEM_PROMPT = {
  uz: `Siz "EduAI Ustoz" — sabrli, do'stona o'qituvchisiz. Mavzuni sodda tilda,
bosqichma-bosqich tushuntiring va misollar bering. Faqat tayyor javob bermang —
o'quvchi mavzuni tushunishiga yordam bering. Javobni O'ZBEK tilida bering.
Qisqa va aniq yozing.`,
  ru: `Вы — "EduAI Наставник", терпеливый и дружелюбный учитель. Объясняйте тему
простым языком, пошагово, с примерами. Не давайте только готовый ответ —
помогайте понять. Отвечайте на РУССКОМ языке. Пишите кратко и ясно.`,
  en: `You are "EduAI Tutor", a patient and friendly teacher. Explain the topic in
simple language, step by step, with examples. Don't just give the answer — help the
student understand. Reply in ENGLISH. Be concise and clear.`,
};

export function isAiEnabled() {
  return env.aiEnabled;
}

/**
 * Provayderga xabar yuboradi (OpenAI-mos /chat/completions formati).
 * Groq, OpenRouter, Together, OpenAI va boshqalar shu formatni qo'llaydi.
 *
 * @param {object} p
 * @param {string} p.question    foydalanuvchi savoli
 * @param {Array}  p.history     [{role:'user'|'assistant', content}]
 * @param {string} p.lang        'uz' | 'ru' | 'en'
 * @returns {Promise<string>}    AI javobi matni
 */
export async function askTutor({ question, history = [], lang = 'uz' }) {
  if (!isAiEnabled()) {
    throw new ApiError(503, 'AI funksiyasi hozircha o\'chiq (API kaliti sozlanmagan).');
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT[lang] || SYSTEM_PROMPT.uz },
    ...history.slice(-AI_LIMITS.maxHistoryMessages).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, AI_LIMITS.maxQuestionLength),
    })),
    { role: 'user', content: question },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const resp = await fetch(env.ai.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.ai.apiKey}`,
      },
      body: JSON.stringify({
        model: env.ai.model,
        messages,
        temperature: 0.5,
        max_tokens: 800,
      }),
      signal: controller.signal,
    });

    if (!resp.ok) {
      // Provayder xatosi tafsilotini foydalanuvchiga oshkor qilmaymiz.
      const text = await resp.text().catch(() => '');
      console.error('[ai] provider error', resp.status, text.slice(0, 300));
      throw new ApiError(502, 'AI provayderidan javob olinmadi. Keyinroq urinib ko\'ring.');
    }

    const data = await resp.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new ApiError(502, 'AI bo\'sh javob qaytardi.');
    return answer;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') {
      throw new ApiError(504, 'AI javobi vaqtidan oshdi.');
    }
    console.error('[ai] request failed', err.message);
    throw new ApiError(502, 'AI bilan bog\'lanishda xatolik.');
  } finally {
    clearTimeout(timeout);
  }
}
