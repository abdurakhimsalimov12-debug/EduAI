// NoSQL injection xavfini kamaytiradi: req.body/query/params ichidan
// mongo operatorlari ($ bilan boshlanadigan yoki . li kalitlarni) olib tashlaydi.
function clean(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    const val = obj[key];
    if (val && typeof val === 'object') clean(val);
  }
}

export default function sanitize(req, res, next) {
  clean(req.body);
  clean(req.query);
  clean(req.params);
  next();
}
