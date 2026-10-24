import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import Icon from '../ui/Icon.jsx';
import useLocalized from '../../hooks/useLocalized.js';

// daisyUI rang kalitlariga mos fon/matn klasslari.
const colorMap = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
  info: 'bg-info/10 text-info',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
};

export default function SubjectCard({ subject }) {
  const { t } = useTranslation();
  const L = useLocalized();
  const colorCls = colorMap[subject.color] || colorMap.primary;

  return (
    <Link
      to={`/subjects/${subject.slug}`}
      className="card bg-base-100 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      <div className="card-body gap-3">
        <div className="flex items-start justify-between">
          <div className={`rounded-xl p-3 ${colorCls}`}>
            <Icon name={subject.icon} size={26} />
          </div>
          <span className="badge badge-ghost badge-sm">
            {t(`common.levels.${subject.level}`)}
          </span>
        </div>
        <h3 className="card-title text-lg">{L(subject.name)}</h3>
        <p className="line-clamp-2 text-sm text-base-content/60">{L(subject.description)}</p>
        <div className="card-actions mt-1 items-center text-sm font-medium text-primary">
          {t('subjects.viewLessons')}
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
