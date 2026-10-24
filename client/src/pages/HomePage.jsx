import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Languages, ClipboardCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { subjectService, errorMessage } from '../services/index.js';
import SubjectCard from '../components/subjects/SubjectCard.jsx';
import { CardSkeleton } from '../components/ui/Loading.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

export default function HomePage() {
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

  const features = [
    { key: 'ai', icon: Sparkles },
    { key: 'multilang', icon: Languages },
    { key: 'quizzes', icon: ClipboardCheck },
    { key: 'progress', icon: TrendingUp },
  ];
  const steps = ['one', 'two', 'three', 'four'];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-base-200">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <div className="badge badge-primary badge-outline mb-4 gap-1">
            <Sparkles size={14} /> {t('app.tagline')}
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{t('home.heroTitle')}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-base-content/70">{t('home.heroSubtitle')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/ai" className="btn btn-primary btn-lg gap-2">
              <Sparkles size={20} /> {t('home.ctaStart')}
            </Link>
            <Link to="/subjects" className="btn btn-outline btn-lg">{t('home.ctaSubjects')}</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold">{t('home.featuresTitle')}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ key, icon: I }) => (
            <div key={key} className="card bg-base-100 shadow-sm">
              <div className="card-body items-center gap-2 text-center">
                <div className="rounded-xl bg-primary/10 p-3 text-primary"><I size={26} /></div>
                <h3 className="font-semibold">{t(`home.features.${key}.title`)}</h3>
                <p className="text-sm text-base-content/60">{t(`home.features.${key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-10 text-center text-2xl font-bold">{t('home.stepsTitle')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s} className="relative rounded-2xl border border-base-200 p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{t(`home.steps.${s}.title`)}</h3>
                <p className="mt-1 text-sm text-base-content/60">{t(`home.steps.${s}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects preview */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('home.subjectsTitle')}</h2>
          <Link to="/subjects" className="btn btn-ghost btn-sm gap-1">
            {t('subjects.title')} <ArrowRight size={16} />
          </Link>
        </div>
        {status === 'loading' && <CardSkeleton count={6} />}
        {status === 'error' && <ErrorState message={err} onRetry={load} />}
        {status === 'ok' && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.slice(0, 6).map((s) => (
              <SubjectCard key={s._id} subject={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
