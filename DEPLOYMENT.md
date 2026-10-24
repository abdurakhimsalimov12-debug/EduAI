# EduAI — bepul hostingga joylashtirish

Bu qo'llanma EduAI'ni **$0 budjet** bilan ishga tushirishni ko'rsatadi:
MongoDB Atlas (ma'lumotlar bazasi) + Render (backend) + Vercel (frontend).
Barchasining bepul tariflari mavjud (shartlar vaqti-vaqti bilan o'zgaradi —
ro'yxatdan o'tishda tekshiring).

---

## 1. MongoDB Atlas (bepul M0 klaster)

1. https://www.mongodb.com/atlas — ro'yxatdan o'ting.
2. **Free (M0)** klaster yarating (yaqin region tanlang).
3. **Database Access** → foydalanuvchi yarating (login + parol).
4. **Network Access** → `0.0.0.0/0` qo'shing (yoki hosting IP'lari).
5. **Connect → Drivers** → ulanish satrini (URI) oling:
   `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/eduai?retryWrites=true&w=majority`
   (`/eduai` — baza nomi).

---

## 2. Backend — Render (bepul Web Service)

1. Kodni GitHub'ga yuklang (`.env` yuklanmaydi — `.gitignore`da).
2. https://render.com → **New → Web Service** → repo'ni ulang.
3. Sozlamalar:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment** bo'limida o'zgaruvchilarni kiriting:
   ```
   NODE_ENV=production
   MONGODB_URI=<Atlas URI>
   JWT_SECRET=<uzun tasodifiy satr>
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://<sizning-vercel-domeningiz>.vercel.app
   AI_API_KEY=<ixtiyoriy>
   AI_API_URL=<ixtiyoriy>
   AI_MODEL=<ixtiyoriy>
   ```
   > `PORT` ni qo'lda qo'ymang — Render o'zi beradi, kod `process.env.PORT`dan oladi.
5. Deploy bo'lgach, bazani to'ldiring: Render **Shell**'da `npm run seed`
   (yoki lokalda `MONGODB_URI`ni Atlas'ga qaratib `npm run seed`).

---

## 3. Frontend — Vercel (bepul)

1. https://vercel.com → **Add New → Project** → repo'ni ulang.
2. Sozlamalar:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` · **Output:** `dist`
3. **Environment Variables:**
   ```
   VITE_API_URL=https://<sizning-render-domeningiz>.onrender.com/api
   ```
4. Deploy qiling.

---

## 4. Yakuniy ulash

- Render'dagi `CLIENT_URL` aynan Vercel domeniga teng bo'lsin (CORS uchun).
- Ikkala tomon ham HTTPS'da ishlaydi — cross-site HttpOnly cookie
  (`sameSite=none; secure`) avtomatik ishlaydi (kod buni `NODE_ENV=production`da
  o'zi qiladi).
- Admin bilan kirish: seed yaratgan `admin@eduai.uz` / `Admin123`
  (birinchi kirgandan keyin parolni o'zgartiring yoki admin'ni qayta yarating).

---

## AI provayderi (ixtiyoriy, bepul variantlar)

Kod OpenAI-mos `/chat/completions` formatidan foydalanadi. Bepul tarif beradigan
mos provayderlar (rasmiy hujjatlaridagi URL va model nomini ishlating):

| Provayder   | AI_API_URL (namuna)                                   |
|-------------|-------------------------------------------------------|
| Groq        | `https://api.groq.com/openai/v1/chat/completions`     |
| OpenRouter  | `https://openrouter.ai/api/v1/chat/completions`       |
| Together AI | `https://api.together.xyz/v1/chat/completions`        |

`AI_MODEL` — tanlangan provayder hujjatidagi aniq model nomi.
Kalit bo'lmasa, AI funksiyasi xavfsiz o'chadi; qolgan hamma narsa ishlayveradi.
