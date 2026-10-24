import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, BookOpen, GraduationCap, Users } from 'lucide-react';
import { adminService } from '../services/index.js';
import SubjectsAdmin from '../components/admin/SubjectsAdmin.jsx';
import LessonsAdmin from '../components/admin/LessonsAdmin.jsx';
import UsersAdmin from '../components/admin/UsersAdmin.jsx';
import Loading from '../components/ui/Loading.jsx';

export default function AdminPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('stats');

  const tabs = [
    { key: 'stats', label: t('admin.tabs.stats'), icon: BarChart3 },
    { key: 'subjects', label: t('admin.tabs.subjects'), icon: BookOpen },
    { key: 'lessons', label: t('admin.tabs.lessons'), icon: GraduationCap },
    { key: 'users', label: t('admin.tabs.users'), icon: Users },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">{t('admin.title')}</h1>

      <div role="tablist" className="tabs tabs-box mb-6 w-fit">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            role="tab"
            className={`tab gap-1 ${tab === tb.key ? 'tab-active' : ''}`}
            onClick={() => setTab(tb.key)}
          >
            <tb.icon size={16} /> <span className="hidden sm:inline">{tb.label}</span>
          </button>
        ))}
      </div>

      {tab === 'stats' && <StatsTab />}
      {tab === 'subjects' && <SubjectsAdmin />}
      {tab === 'lessons' && <LessonsAdmin />}
      {tab === 'users' && <UsersAdmin />}
    </div>
  );
}

function StatsTab() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.stats().then((d) => setStats(d.stats)).catch(() => setStats(null));
  }, []);

  if (!stats) return <Loading />;

  const items = [
    { key: 'users', color: 'bg-primary/10 text-primary' },
    { key: 'subjects', color: 'bg-secondary/10 text-secondary' },
    { key: 'lessons', color: 'bg-accent/10 text-accent' },
    { key: 'quizzes', color: 'bg-info/10 text-info' },
    { key: 'attempts', color: 'bg-success/10 text-success' },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <div key={it.key} className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="text-sm text-base-content/60">{t(`admin.stats.${it.key}`)}</div>
            <div className={`mt-1 w-fit rounded-lg px-3 py-1 text-3xl font-bold ${it.color}`}>
              {stats[it.key]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
