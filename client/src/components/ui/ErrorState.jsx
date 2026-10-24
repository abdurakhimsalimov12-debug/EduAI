import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// message — tarjima kaliti (masalan "errors.network") yoki tayyor matn bo'lishi mumkin.
export default function ErrorState({ message, onRetry }) {
  const { t } = useTranslation();
  const text = message?.includes('.') ? t(message) : message || t('errors.generic');

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="rounded-full bg-error/10 p-4">
        <AlertTriangle className="text-error" size={32} />
      </div>
      <p className="max-w-md text-base-content/70">{text}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          <RefreshCw size={16} />
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}
