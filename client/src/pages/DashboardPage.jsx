import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookCheck, ClipboardList, Target, Activity, ArrowRight } from 'lucide-react';
import { progressService, errorMessage } from '../services/index.js';
import { useAuth } from '../features/auth/AuthContext.jsx';
import useLocalized from '../hooks/useLocalized.js';
import Loading from '../components/ui/Loading.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const L = useLocalized();

  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('loading');
  const [err, setErr] = useState('');

  const load = () => {
    setStatus('loading');
    Promise.all([progressService.get(), progressService.history()])
      .then(([p, h]) => {
        setStats(p.stats);
        setHistory(h.attempts);
        setStatus('ok');
      })
      .catch((e) => {
        setErr(errorMessage(e));
        setStatus('error');
      });
  };

  useEffect(load, []);

  if (status === 'loading') return <Loading full />;
  if (status === 'error') return <div className="mx-auto max-w-5xl px-4 py-10"><ErrorState message={err} onRetry={load} /></div>;

  const cards = [
    { icon: BookCheck, label: t('dashboard.completedLessons'), value: stats.completedLessons, color: 'text-primary bg-primary/10' },
    { icon: ClipboardList, label: t('dashboard.quizzesTaken'), value: stats.quizzesTaken, color: 'text-secondary bg-secondary/10' },
    { icon: Target, label: t('dashboard.averageScore'), value: `${stats.averageScore}%`, color: 'text-success bg-success/10' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="mt-1 text-base-content/60">{t('dashboard.welcome', { name: user?.name })}</p>
      </header>

      {/* Statistika kartochkalari */}
      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card bg-base-100 shadow-sm">
            <div className="card-body flex-row items-center gap-4">
              <div className={`rounded-xl p-3 ${c.color}`}><c.icon size={26} /></div>
              <div>
                <div className="text-3xl font-bold">{c.value}</div>
                <div className="text-sm text-base-content/60">{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* O'rtacha natija grafigi (sodda) */}
      <div className="card mt-6 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="flex items-center gap-2 font-semibold">
            <Target size={18} className="text-primary" /> {t('dashboard.averageScore')}
          </h2>
          <progress className="progress progress-success mt-2 w-full" value={stats.averageScore} max={100} />
          <span className="text-sm text-base-content/60">{stats.averageScore}%</span>
        </div>
      </div>

      {/* Oxirgi faoliyat */}
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Activity size={20} /> {t('dashboard.recentActivity')}
        </h2>
        {history.length === 0 ? (
          <EmptyState message={t('dashboard.noActivity')}>
            <Link to="/subjects" className="btn btn-primary btn-sm mt-2 gap-1">
              {t('nav.subjects')} <ArrowRight size={16} />
            </Link>
          </EmptyState>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('dashboard.quizOn')}</th>
                  <th>{t('nav.subjects')}</th>
                  <th className="text-right">{t('quiz.score')}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((a) => (
                  <tr key={a._id}>
                    <td className="font-medium">{a.quiz ? L(a.quiz.title) : '—'}</td>
                    <td className="text-base-content/70">{a.subject ? L(a.subject.name) : '—'}</td>
                    <td className="text-right">
                      <span className={`badge ${a.percentage >= 60 ? 'badge-success' : 'badge-warning'}`}>
                        {a.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
