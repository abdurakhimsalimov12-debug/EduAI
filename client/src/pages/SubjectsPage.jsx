import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { subjectService, errorMessage } from '../services/index.js';
import SubjectCard from '../components/subjects/SubjectCard.jsx';
import { CardSkeleton } from '../components/ui/Loading.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function SubjectsPage() {
  const { t } = useTranslation();
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [err, setErr] = useState('');

  const load = () => {
    setStatus('loading');
    subjectService
      .list()
      .then((d) => {
        setSubjects(d.subjects);
        setStatus('ok');
      })
      .catch((e) => {
        setErr(errorMessage(e));
        setStatus('error');
      });
  };

  useEffect(load, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{t('subjects.title')}</h1>
        <p className="mt-1 text-base-content/60">{t('subjects.subtitle')}</p>
      </header>

      {status === 'loading' && <CardSkeleton count={8} />}
      {status === 'error' && <ErrorState message={err} onRetry={load} />}
      {status === 'ok' &&
        (subjects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => (
              <SubjectCard key={s._id} subject={s} />
            ))}
          </div>
        ))}
    </div>
  );
}
