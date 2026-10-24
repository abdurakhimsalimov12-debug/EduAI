// Vaqtinchalik end-to-end smoke test (in-memory MongoDB).
// Ishga tushadi: subject/lesson/quiz seed -> register -> login ->
// quiz get(javobsiz) -> submit -> progress -> admin.
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri();

// env.js import qilinishidan OLDIN o'rnatamiz.
process.env.MONGODB_URI = uri;
process.env.JWT_SECRET = 'test-secret-xyz';
process.env.NODE_ENV = 'test';
process.env.PORT = '5099';

const { connectDB, disconnectDB } = await import('./src/config/db.js');
const app = (await import('./src/app.js')).default;
const Subject = (await import('./src/models/Subject.js')).default;
const Lesson = (await import('./src/models/Lesson.js')).default;
const Quiz = (await import('./src/models/Quiz.js')).default;
const User = (await import('./src/models/User.js')).default;

await connectDB();

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log('  ✅', msg); } else { fail++; console.log('  ❌', msg); } };

// --- Seed ---
const subj = await Subject.create({ slug: 'math', name: { uz: 'Matematika', ru: 'Математика', en: 'Math' } });
const lesson = await Lesson.create({ subject: subj._id, slug: 'nums', title: { uz: 'Sonlar' } });
const quiz = await Quiz.create({
  subject: subj._id, lesson: lesson._id, title: { uz: 'Test' },
  questions: [
    { prompt: { uz: '2+2?' }, options: [{ uz: '3' }, { uz: '4' }], correctIndex: 1, explanation: { uz: '2+2=4' } },
    { prompt: { uz: '3+3?' }, options: [{ uz: '6' }, { uz: '9' }], correctIndex: 0 },
  ],
});
await User.create({ name: 'Admin', email: 'a@a.uz', password: 'Admin123', role: 'admin' });

const server = app.listen(5099);
const base = 'http://localhost:5099/api';

// Oddiy cookie jar.
let cookie = '';
async function call(method, path, body, useCookie = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (useCookie && cookie) headers.Cookie = cookie;
  const res = await fetch(base + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const sc = res.headers.getSetCookie?.() || [];
  if (sc.length) cookie = sc.map((c) => c.split(';')[0]).join('; ');
  let data = null;
  try { data = await res.json(); } catch { /* bo'sh */ }
  return { status: res.status, data };
}

try {
  // 1. Health
  let r = await call('GET', '/health', null, false);
  ok(r.status === 200 && r.data.db === 'connected', 'health: DB connected');

  // 2. Subjects ro'yxati
  r = await call('GET', '/subjects', null, false);
  ok(r.status === 200 && r.data.subjects.length === 1, 'subjects list = 1');

  // 3. Quiz javobsiz kelishi kerak
  r = await call('GET', `/quizzes/${quiz._id}`, null, false);
  const q0 = r.data?.quiz?.questions?.[0];
  ok(r.status === 200 && q0 && q0.correctIndex === undefined, 'quiz GET: correctIndex yashirin');

  // 4. Login talab qiladigan submit avtorizatsiyasiz 401
  r = await call('POST', `/quizzes/${quiz._id}/submit`, { answers: [1, 0] }, false);
  ok(r.status === 401, 'submit avtorizatsiyasiz -> 401');

  // 5. Register
  r = await call('POST', '/auth/register', { name: 'Ali', email: 'ali@test.uz', password: 'secret123' });
  ok(r.status === 201 && r.data.user.email === 'ali@test.uz', 'register ok');
  ok(r.data.user.password === undefined, 'register: parol qaytmaydi');
  ok(cookie.includes('eduai_token'), 'register: HttpOnly cookie o\'rnatildi');

  // 6. Me
  r = await call('GET', '/auth/me');
  ok(r.status === 200 && r.data.user.role === 'user', 'me: user roli');

  // 7. Submit (to'g'ri=1, 2-savol noto'g'ri)
  r = await call('POST', `/quizzes/${quiz._id}/submit`, { answers: [1, 1] });
  ok(r.status === 200 && r.data.correctCount === 1 && r.data.total === 2 && r.data.percentage === 50, 'submit: 50% ball');
  ok(r.data.results[0].explanation.uz === '2+2=4', 'submit: izoh keldi');

  // 8. Progress: darsni belgilash
  r = await call('POST', `/progress/lessons/${lesson._id}`);
  ok(r.status === 200 && r.data.completed === true, 'progress: dars belgilandi');
  r = await call('GET', '/progress');
  ok(r.data.stats.completedLessons === 1 && r.data.stats.quizzesTaken === 1, 'progress: statistika to\'g\'ri');

  // 9. Oddiy user admin endpointga kira olmaydi (403)
  r = await call('GET', '/admin/stats');
  ok(r.status === 403, 'user -> /admin/stats 403');

  // 10. Admin login -> stats
  r = await call('POST', '/auth/login', { email: 'a@a.uz', password: 'Admin123' });
  ok(r.status === 200 && r.data.user.role === 'admin', 'admin login');
  r = await call('GET', '/admin/stats');
  ok(r.status === 200 && r.data.stats.users === 2, 'admin stats: users=2');

  // 11. Admin fan yaratadi
  r = await call('POST', '/subjects', { slug: 'phys', name: { uz: 'Fizika' } });
  ok(r.status === 201, 'admin fan yaratdi');

  // 12. NoSQL injection sanitatsiyasi: login $gt bilan
  cookie = '';
  r = await call('POST', '/auth/login', { email: { $gt: '' }, password: 'x' }, false);
  ok(r.status === 400 || r.status === 401, 'NoSQL injection bloklandi');
} catch (e) {
  console.error('TEST XATOLIK:', e);
  fail++;
} finally {
  server.close();
  await disconnectDB();
  await mongod.stop();
  console.log(`\nNatija: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
