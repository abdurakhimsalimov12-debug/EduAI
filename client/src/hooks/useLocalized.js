import { useTranslation } from 'react-i18next';

// Backenddan kelgan {uz, ru, en} obyektidan joriy tilni tanlaydi.
// Tarjima bo'lmasa, tushunarli fallback (uz -> boshqa mavjud til).
export default function useLocalized() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'uz';

  return function pick(field) {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.uz || field.ru || field.en || '';
  };
}
