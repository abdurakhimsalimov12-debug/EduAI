import { useTranslation } from 'react-i18next';

export default function Loading({ full = false, label }) {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${full ? 'min-h-[50vh]' : 'py-10'}`}>
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="text-base-content/60 text-sm">{label || t('common.loading')}</p>
    </div>
  );
}

// Kartochkalar yuklanayotganda skeleton ko'rsatish uchun.
export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-base-100 shadow-sm">
          <div className="card-body gap-3">
            <div className="skeleton h-10 w-10 rounded-full" />
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
