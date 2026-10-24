import env from '../config/env.js';

/**
 * Markaziy xatolik handleri. Maxfiy ma'lumotlarni foydalanuvchiga
 * yoki (production'da) stack'ni oshkor qilmaydi.
 */
export default function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  // Server tomonida qisqa log (maxfiy ma'lumotsiz).
  if (status >= 500) {
    console.error('[error]', err.message);
  }

  const body = {
    success: false,
    message:
      status >= 500 && env.isProd
        ? 'Serverda ichki xatolik yuz berdi.'
        : err.message || 'Xatolik yuz berdi.',
  };

  // Development'da debug uchun stack qo'shamiz.
  if (!env.isProd && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
}
