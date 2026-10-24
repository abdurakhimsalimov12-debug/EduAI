import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookText, Lightbulb, KeyRound, ClipboardCheck, CheckCircle2, Circle } from 'lucide-react';
import { lessonService, progressService, errorMessage } from '../services/index.js';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useToast } from '../components/ui/ToastContext.jsx';
import useLocalized from '../hooks/useLocalized.js';
import Icon from '../components/ui/Icon.jsx';
import Loading from '../components/ui/Loading.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

export default function LessonPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const L = useLocalized();
  const { user } = useAuth();
  const toast = useToast();

  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [err, setErr] = useState('');
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  const load = () => {
    setStatus('loading');
    lessonService
      .get(id)
      .then((d) => {
        setData(d);
        setStatus('ok');
      })
      .catch((e) => {
        setErr(errorMessage(e, 'errors.notFound'));
        setStatus('error');
      });
  };

  useEffect(load, [id]);

  // Login bo'lsa, bu dars o'rganilganmi — tekshiramiz.
  useEffect(() => {
    if (!user) return;
    progressService
      .get()
      .then((d) => {
        setCompleted(d.completedLessons.some((c) => String(c.lesson) === String(id)));
      })
      .catch(() => {});
  }, [user, id]);

  const toggleComplete = async () => {
    if (!user) return toast.error(t('errors.unauthorized'));
    setMarking(true);
    try {
      if (completed) {
        await progressService.unmarkLesson(id);
        setCompleted(false);
      } else {
        await progressService.markLesson(id);
        setCompleted(true);
        toast.success(t('lessons.completed'));
      }
    } catch (e) {
      toast.error(t(errorMessage(e)));
    } finally {
      setMarking(false);
    }
  };

  if (status === 'loading') return <Loading full />;
  if (status === 'error') return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorState message={err} onRetry={load} /></div>;

  const { lesson, quizzes } = data;
  const subject = lesson.subject;

  const Section = ({ icon: I, title, text }) =>
    text ? (
      <section className="rounded-xl border border-base-200 bg-base-100 p-5">
        <h2 className="mb-2 flex items-center gap-2 font-semibold">
          <I size={18} className="text-primary" /> {title}
        </h2>
        <p className="whitespace-pre-line leading-relaxed text-base-content/80">{text}</p>
      </section>
    ) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {subject && (
        <Link to={`/subjects/${subject.slug}`} className="btn btn-ghost btn-sm mb-4 gap-1">
          <ArrowLeft size={16} /> {L(subject.name)}
        </Link>
      )}

      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{L(lesson.title)}</h1>
          <span className="badge badge-ghost badge-sm mt-2">{t(`common.levels.${lesson.level}`)}</span>
        </div>
        {subject && (
          <div className="hidden rounded-xl bg-primary/10 p-3 text-primary sm:block">
            <Icon name={subject.icon} size={24} />
          </div>
        )}
      </header>

      <div className="space-y-4">
        <Section icon={BookText} title={t('lessons.content')} text={L(lesson.content)} />
        <Section icon={Lightbulb} title={t('lessons.examples')} text={L(lesson.examples)} />
        <Section icon={KeyRound} title={t('lessons.keyPoints')} text={L(lesson.keyPoints)} />
      </div>

      {/* Amallar */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={toggleComplete}
          disabled={marking}
          className={`btn gap-2 ${completed ? 'btn-success' : 'btn-outline'}`}
        >
          {completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          {completed ? t('lessons.completed') : t('lessons.markComplete')}
        </button>

        {quizzes?.length > 0 ? (
          <Link to={`/quiz/${quizzes[0]._id}`} className="btn btn-primary gap-2">
            <ClipboardCheck size={18} /> {t('lessons.startQuiz')}
          </Link>
        ) : (
          <span className="text-sm text-base-content/50">{t('lessons.noQuiz')}</span>
        )}
      </div>
    </div>
  );
}
