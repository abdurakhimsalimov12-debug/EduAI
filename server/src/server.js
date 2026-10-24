import app from './app.js';
import env from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

async function start() {
  // MongoDB ulanishini sinaymiz (bo'lmasa ham davom etadi).
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`[server] EduAI backend http://localhost:${env.port} (${env.nodeEnv})`);
    console.log(`[server] Health: http://localhost:${env.port}/api/health`);
  });

  // Toza o'chirish.
  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} — to'xtatilmoqda...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('[server] Ishga tushmadi:', err.message);
  process.exit(1);
});
