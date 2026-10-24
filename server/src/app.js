import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import env from './config/env.js';
import apiRoutes from './routes/index.js';
import sanitize from './middleware/sanitize.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Proxy orqasida (hosting) to'g'ri IP uchun.
app.set('trust proxy', 1);

// --- Xavfsizlik ---
app.use(helmet());

// CORS — faqat ruxsat etilgan frontend origin(lar)ga.
app.use(
  cors({
    origin(origin, cb) {
      // Server-to-server yoki curl (origin yo'q) — ruxsat.
      if (!origin || env.clientUrls.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('CORS: ruxsat etilmagan origin'));
    },
    credentials: true,
  })
);

// Body parserlar (hajm limiti bilan).
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// NoSQL injection sanitatsiyasi.
app.use(sanitize);

// Logging (development'da).
if (!env.isProd) {
  app.use(morgan('dev'));
}

// Umumiy rate limit — barcha /api so'rovlari uchun.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Juda ko\'p so\'rov. Birozdan keyin urinib ko\'ring.' },
});
app.use('/api', apiLimiter);

// --- Routelar ---
app.use('/api', apiRoutes);

// --- 404 va xatolik ---
app.use(notFound);
app.use(errorHandler);

export default app;
