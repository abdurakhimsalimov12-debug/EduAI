import dotenv from 'dotenv';

// server/.env faylidan o'qiydi (fayl bo'lmasa — jim o'tadi).
dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGODB_URI || '',

  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Vergul bilan ajratilgan bir nechta origin bo'lishi mumkin.
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  ai: {
    apiKey: process.env.AI_API_KEY || '',
    apiUrl: process.env.AI_API_URL || '',
    model: process.env.AI_MODEL || '',
  },
};

// Qulay yordamchi bayroqlar.
env.isProd = env.nodeEnv === 'production';
env.hasMongo = Boolean(env.mongoUri);
env.aiEnabled = Boolean(env.ai.apiKey && env.ai.apiUrl && env.ai.model);

export default env;
