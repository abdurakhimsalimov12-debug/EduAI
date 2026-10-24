// Uch tilli matn maydoni uchun qayta ishlatiladigan sxema qismi.
// uz majburiy, ru/en ixtiyoriy (fallback frontendда yoki quyidagi helper bilan).
export const localizedString = (required = true) => ({
  uz: { type: String, trim: true, required },
  ru: { type: String, trim: true, default: '' },
  en: { type: String, trim: true, default: '' },
});

// Tanlangan til bo'yicha matnni oladi, bo'lmasa uz -> mavjud boshqasiga qaytadi.
export function pickLocale(field, lang = 'uz') {
  if (!field) return '';
  return field[lang] || field.uz || field.ru || field.en || '';
}
