import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { subjectService, errorMessage } from '../services/index.js';
import useLocalized from '../hooks/useLocalized.js';
import Icon from '../components/ui/Icon.jsx';
import Loading from '../components/ui/Loading.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function SubjectDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const L = useLocalized();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [err, setErr] = useState('');

  const load = () => {
    setStatus('loading');
    subjectService
      .get(slug)
      .then((d) => {
        setData(d);
        setStatus('ok');
      })
      .catch((e) => {
        setErr(errorMessage(e, 'errors.notFound'));
        setStatus('error');
      });
  };

  useEffect(load, [slug]);

  if (status === 'loading') return <Loading full />;
  if (status === 'error') return <div className="mx-auto max-w-4xl px-4 py-10"><ErrorState message={err} onRetry={load} /></div>;

  const { subject, lessons } = data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/subjects" className="btn btn-ghost btn-sm mb-4 gap-1">
        <ArrowLeft size={16} /> {t('subjects.title')}
      </Link>

      <header className="mb-8 flex items-start gap-4">
        <div className="rounded-2xl bg-primary/10 p-4 text-primary">
          <Icon name={subject.icon} size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{L(subject.name)}</h1>
          <p className="mt-1 text-base-content/60">{L(subject.description)}</p>
          <span className="badge badge-ghost badge-sm mt-2">{t(`common.levels.${subject.level}`)}</span>
        </div>
      </header>

      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
        <BookOpen size={20} /> {t('subjects.lessons')}
      </h2>

      {lessons.length === 0 ? (
        <EmptyState message={t('subjects.noLessons')} />
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <Link
              key={lesson._id}
              to={`/lessons/${lesson._id}`}
              className="flex items-center gap-4 rounded-xl border border-base-200 bg-base-100 p-4 transition hover:border-primary/40 hover:shadow-sm"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-base-200 font-semibold">
                {i + 1}
              </span>
              <span className="flex-1 font-medium">{L(lesson.title)}</span>
              <span className="badge badge-ghost badge-sm hidden sm:inline">{t(`common.levels.${lesson.level}`)}</span>
              <ChevronRight size={18} className="text-base-content/40" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
