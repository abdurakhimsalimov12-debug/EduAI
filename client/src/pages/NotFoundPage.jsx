import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl bg-primary/10 p-5 text-primary"><Compass size={40} /></div>
      <h1 className="mt-4 text-5xl font-bold">404</h1>
      <p className="mt-2 text-base-content/60">{t('errors.pageNotFound')}</p>
      <Link to="/" className="btn btn-primary mt-6">{t('nav.home')}</Link>
    </div>
  );
}
