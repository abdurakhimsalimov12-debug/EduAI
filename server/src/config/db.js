import mongoose from 'mongoose';
import env from './env.js';

let connected = false;

/**
 * MongoDB'ga ulanadi. MONGODB_URI berilmagan bo'lsa, server
 * baribir ishlaydi (DB funksiyalari o'chiq), shunda $0 budjetda
 * ham loyihani lokal sinab ko'rish mumkin.
 */
export async function connectDB() {
  if (!env.hasMongo) {
    console.warn(
      '[db] MONGODB_URI berilmagan — ma\'lumotlar bazasisiz ishga tushdi.'
    );
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    connected = true;
    console.log('[db] MongoDB ulandi.');
    return true;
  } catch (err) {
    // Maxfiy ma'lumotlarni (URI) logga chiqarmaymiz.
    console.error('[db] MongoDB ulanmadi:', err.message);
    return false;
  }
}

export function isDbConnected() {
  return connected && mongoose.connection.readyState === 1;
}

export async function disconnectDB() {
  if (connected) {
    await mongoose.disconnect();
    connected = false;
  }
}
