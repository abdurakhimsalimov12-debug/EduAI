import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-base-100 border-t border-base-200 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <GraduationCap className="text-primary" />
            Edu<span className="text-primary">AI</span>
          </div>
          <p className="mt-2 max-w-sm text-sm text-base-content/60">{t('footer.about')}</p>
        </div>
        <div className="sm:text-right">
          <h3 className="font-semibold">{t('footer.links')}</h3>
          <ul className="mt-2 space-y-1 text-sm text-base-content/70">
            <li><Link to="/subjects" className="link link-hover">{t('nav.subjects')}</Link></li>
            <li><Link to="/ai" className="link link-hover">{t('nav.aiTutor')}</Link></li>
            <li><Link to="/dashboard" className="link link-hover">{t('nav.dashboard')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-base-200 py-4 text-center text-xs text-base-content/50">
        © {new Date().getFullYear()} EduAI. {t('footer.rights')}
      </div>
    </footer>
  );
}
