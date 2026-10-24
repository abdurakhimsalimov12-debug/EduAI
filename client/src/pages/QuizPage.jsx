import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { quizService, errorMessage } from '../services/index.js';
import { useAuth } from '../features/auth/AuthContext.jsx';
import useLocalized from '../hooks/useLocalized.js';
import Loading from '../components/ui/Loading.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

export default function QuizPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const L = useLocalized();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [status, setStatus] = useState('loading');
  const [err, setErr] = useState('');

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const load = () => {
    setStatus('loading');
    setResult(null);
    setCurrent(0);
    quizService
      .get(id)
      .then((d) => {
        setQuiz(d.quiz);
        setAnswers(new Array(d.quiz.questions.length).fill(null));
        setStatus('ok');
      })
      .catch((e) => {
        setErr(errorMessage(e, 'errors.notFound'));
        setStatus('error');
      });
  };

  useEffect(load, [id]);

  if (status === 'loading') return <Loading full />;
  if (status === 'error') return <div className="mx-auto max-w-2xl px-4 py-10"><ErrorState message={err} onRetry={load} /></div>;

  // Natija ekrani
  if (result) {
    return <QuizResult quiz={quiz} result={result} onRetry={load} L={L} t={t} />;
  }

  const total = quiz.questions.length;
  const q = quiz.questions[current];
  const selected = answers[current];
  const isLast = current === total - 1;
  const allAnswered = answers.every((a) => a !== null);

  const choose = (idx) => {
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await quizService.submit(id, answers);
      setResult(res);
      window.scrollTo(0, 0);
    } catch (e) {
      setErr(errorMessage(e));
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">{L(quiz.title)}</h1>

      {!user && (
        <div className="alert alert-warning mt-4">
          <span>{t('quiz.loginRequired')}</span>
          <Link to="/login" className="btn btn-sm">{t('nav.login')}</Link>
        </div>
      )}

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm text-base-content/60">
          <span>{t('quiz.questionOf', { current: current + 1, total })}</span>
          <span>{answers.filter((a) => a !== null).length} / {total}</span>
        </div>
        <progress className="progress progress-primary w-full" value={current + 1} max={total} />
      </div>

      {/* Savol */}
      <div className="card mt-4 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="text-lg font-semibold">{L(q.prompt)}</h2>
          <div className="mt-3 space-y-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => choose(idx)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                  selected === idx
                    ? 'border-primary bg-primary/10'
                    : 'border-base-200 hover:border-primary/40 hover:bg-base-200/50'
                }`}
              >
                <span
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border text-xs font-semibold ${
                    selected === idx ? 'border-primary bg-primary text-primary-content' : 'border-base-300'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{L(opt)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigatsiya */}
      <div className="mt-6 flex items-center justify-between">
        <button
          className="btn btn-ghost"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          <ArrowLeft size={18} /> {t('common.back')}
        </button>

        {isLast ? (
          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={!allAnswered || submitting || !user}
          >
            {submitting ? <span className="loading loading-spinner loading-sm" /> : <Trophy size={18} />}
            {t('quiz.finish')}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setCurrent((c) => c + 1)} disabled={selected === null}>
            {t('common.next')} <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function QuizResult({ quiz, result, onRetry, L, t }) {
  const pass = result.percentage >= 60;
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body items-center text-center">
          <div className={`radial-progress text-3xl font-bold ${pass ? 'text-success' : 'text-warning'}`}
               style={{ '--value': result.percentage, '--size': '8rem', '--thickness': '0.7rem' }}
               role="progressbar">
            {result.percentage}%
          </div>
          <h2 className="mt-4 text-xl font-bold">{t('quiz.yourScore')}</h2>
          <p className="text-base-content/70">
            {result.correctCount} / {result.total} {t('quiz.correct').toLowerCase()}
          </p>
          <div className="card-actions mt-4">
            <button className="btn btn-outline btn-sm" onClick={onRetry}>
              <RotateCcw size={16} /> {t('quiz.retry')}
            </button>
          </div>
        </div>
      </div>

      {/* Har bir savol tahlili */}
      <div className="mt-6 space-y-3">
        {quiz.questions.map((q, i) => {
          const r = result.results[i];
          return (
            <div key={q._id} className="rounded-xl border border-base-200 bg-base-100 p-5">
              <div className="flex items-start gap-2">
                {r.isCorrect ? (
                  <CheckCircle2 className="mt-0.5 flex-none text-success" size={20} />
                ) : (
                  <XCircle className="mt-0.5 flex-none text-error" size={20} />
                )}
                <h3 className="font-medium">{L(q.prompt)}</h3>
              </div>
              <div className="mt-3 space-y-1 pl-7 text-sm">
                {q.options.map((opt, idx) => {
                  const isCorrect = idx === r.correctIndex;
                  const isChosen = idx === r.selected;
                  return (
                    <div
                      key={idx}
                      className={`rounded-lg px-3 py-2 ${
                        isCorrect
                          ? 'bg-success/15 text-success-content/90 font-medium'
                          : isChosen
                          ? 'bg-error/15'
                          : ''
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}. {L(opt)}
                      {isCorrect && <span className="ml-2 text-xs text-success">✓ {t('quiz.correctAnswer')}</span>}
                      {isChosen && !isCorrect && <span className="ml-2 text-xs text-error">✗ {t('quiz.yourAnswer')}</span>}
                    </div>
                  );
                })}
                {L(r.explanation) && (
                  <p className="mt-2 rounded-lg bg-info/10 px-3 py-2 text-info-content/80">
                    <span className="font-semibold">{t('quiz.explanation')}: </span>
                    {L(r.explanation)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
