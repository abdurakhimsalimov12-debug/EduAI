// Ma'lumotlar bazasini boshlang'ich kontent bilan to'ldiradi.
// Ishga tushirish: npm run seed   (server papkasida, MONGODB_URI sozlangan bo'lsin)
import mongoose from 'mongoose';
import env from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import Subject from '../models/Subject.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import { subjects, lessons, quizzes } from '../data/seedData.js';

const ADMIN = {
  name: 'Administrator',
  email: 'admin@eduai.uz',
  password: 'Admin123',
  role: 'admin',
  preferredLanguage: 'uz',
};

async function run() {
  if (!env.hasMongo) {
    console.error('[seed] MONGODB_URI sozlanmagan. .env faylga MongoDB manzilini qo\'ying.');
    process.exit(1);
  }

  const ok = await connectDB();
  if (!ok) process.exit(1);

  console.log('[seed] Eski kontent tozalanmoqda...');
  await Promise.all([Subject.deleteMany({}), Lesson.deleteMany({}), Quiz.deleteMany({})]);

  // Fanlar
  const subjectDocs = await Subject.insertMany(
    subjects.map((s, i) => ({ ...s, order: i }))
  );
  const subjectBySlug = Object.fromEntries(subjectDocs.map((s) => [s.slug, s]));
  console.log(`[seed] ${subjectDocs.length} ta fan qo'shildi.`);

  // Darslar
  const lessonDocs = await Lesson.insertMany(
    lessons.map((l) => ({ ...l, subject: subjectBySlug[l.subject]._id }))
  );
  const lessonKey = (subjectSlug, slug) => `${subjectSlug}::${slug}`;
  const lessonBySlug = Object.fromEntries(
    lessonDocs.map((l) => {
      const subjSlug = subjectDocs.find((s) => String(s._id) === String(l.subject)).slug;
      return [lessonKey(subjSlug, l.slug), l];
    })
  );
  console.log(`[seed] ${lessonDocs.length} ta dars qo'shildi.`);

  // Testlar
  const quizDocs = await Quiz.insertMany(
    quizzes.map((q) => ({
      ...q,
      subject: subjectBySlug[q.subject]._id,
      lesson: q.lesson ? lessonBySlug[lessonKey(q.subject, q.lesson)]?._id || null : null,
    }))
  );
  console.log(`[seed] ${quizDocs.length} ta test qo'shildi.`);

  // Admin foydalanuvchi (bo'lmasa yaratamiz).
  const existingAdmin = await User.findOne({ email: ADMIN.email });
  if (!existingAdmin) {
    await User.create(ADMIN);
    console.log(`[seed] Admin yaratildi: ${ADMIN.email} / ${ADMIN.password}`);
  } else {
    console.log(`[seed] Admin allaqachon mavjud: ${ADMIN.email}`);
  }

  await disconnectDB();
  console.log('[seed] Tayyor ✅');
  process.exit(0);
}

run().catch(async (err) => {
  console.error('[seed] Xatolik:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
