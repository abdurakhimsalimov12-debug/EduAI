import { Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EmptyState({ message, icon: IconCmp = Inbox, children }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="rounded-full bg-base-300/50 p-4">
        <IconCmp className="text-base-content/40" size={30} />
      </div>
      <p className="text-base-content/60">{message || t('common.empty')}</p>
      {children}
    </div>
  );
}
