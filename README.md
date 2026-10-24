# EduAI — Full-Stack AI Ta'lim Platformasi

Uch tilli (o'zbek, rus, ingliz) AI ta'lim platformasi. Frontend React + Vite,
backend Node + Express + MongoDB. $0 budjet — bepul texnologiyalar va free-tier
xizmatlar asosida.

## Imkoniyatlar

- 🏠 **Bosh sahifa** — hero, imkoniyatlar, o'rganish bosqichlari, fanlar
- 🤖 **AI Ustoz** — chat interfeysi, tanlangan tilda javob, kunlik limit, xatolik/qayta urinish
- 📚 **Fanlar va darslar** — API orqali, uch tilli, daraja belgilangan
- ✅ **Testlar** — to'g'ri javoblar backendda tekshiriladi, natija + izohlar
- 👤 **Auth** — ro'yxatdan o'tish/kirish, HttpOnly cookie (JWT), bcrypt
- 📊 **Dashboard** — statistika, o'rtacha natija, oxirgi faoliyat
- 🛡️ **Admin panel** — fanlar/darslar CRUD, foydalanuvchi rollari, statistika
- 🌐 **i18next** — til almashtirish, tanlov saqlanadi
- 🎨 **Tailwind v4 + daisyUI v5** — responsive, yagona dizayn tizimi

## Texnologiyalar

**Frontend:** React 19 · Vite 6 · Tailwind CSS v4 · daisyUI v5 · React Router 7 ·
Lucide · i18next · Axios
**Backend:** Node · Express 4 · Mongoose 8 · JWT · bcryptjs · helmet · cors ·
express-rate-limit · express-validator · dotenv · cookie-parser

## Struktura

```
eduai/
  client/   # React frontend (components, pages, features, hooks, services, i18n)
  server/   # Express backend (config, models, controllers, routes, middleware, services, validators)
  .env.example  .gitignore  README.md  DEPLOYMENT.md
```

## Ishga tushirish (lokal)

### Talablar
- Node.js 18+ (tavsiya 20/22)
- MongoDB — lokal `mongod` yoki bepul **MongoDB Atlas** (DB funksiyalari uchun)

### 1. Backend
```bash
cd server
npm install
cp .env.example .env          # Windows: copy .env.example .env
# .env ichida MONGODB_URI va JWT_SECRET ni to'ldiring
npm run seed                  # boshlang'ich fanlar/darslar/testlar + admin
npm run dev                   # http://localhost:5000
```
Tekshirish: `http://localhost:5000/api/health`

### 2. Frontend
Yangi terminalda:
```bash
cd client
npm install
npm run dev                   # http://localhost:5173
```
Dev'da Vite `/api` ni avtomatik backendga (`:5000`) uzatadi.

### Admin bilan kirish (seed'dan keyin)
- Email: `admin@eduai.uz`  ·  Parol: `Admin123`
- (Ishlab chiqarishda darhol o'zgartiring.)

## AI Ustozni yoqish (ixtiyoriy)

`server/.env` ga OpenAI-mos provayder ma'lumotlarini qo'shing (masalan Groq):
```
AI_API_KEY=...
AI_API_URL=https://api.groq.com/openai/v1/chat/completions
AI_MODEL=<model-nomi>
```
Kalit bo'lmasa, AI funksiyasi xavfsiz o'chadi; qolgan hammasi ishlayveradi.

## Xavfsizlik

Parollar bcrypt bilan xeshlanadi · JWT HttpOnly cookie'da (localStorage emas) ·
helmet, CORS (faqat ruxsat etilgan origin), rate limiting · kiruvchi ma'lumot
validatsiyasi · NoSQL injection sanitatsiyasi · admin roli backendda tekshiriladi ·
to'g'ri test javoblari frontendga submit'gacha yuborilmaydi · maxfiy kalitlar
faqat `.env`da (git'ga tushmaydi).

## Deploy

`DEPLOYMENT.md` — MongoDB Atlas + Render + Vercel bo'yicha bepul joylashtirish qo'llanmasi.

## API (qisqa)

`/api/health` · `/api/auth/{register,login,logout,me}` ·
`/api/subjects` · `/api/lessons` · `/api/quizzes/:id/{submit,results}` ·
`/api/progress` · `/api/ai/{chat,usage}` · `/api/admin/{users,stats}`
