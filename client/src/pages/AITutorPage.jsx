import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, Sparkles, Bot, User as UserIcon, RefreshCw, Lightbulb, AlertTriangle } from 'lucide-react';
import { aiService, errorMessage } from '../services/index.js';
import { useAuth } from '../features/auth/AuthContext.jsx';
import Loading from '../components/ui/Loading.jsx';

export default function AITutorPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]); // {role:'user'|'assistant', content}
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [usage, setUsage] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [checking, setChecking] = useState(true);
  const endRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }
    aiService
      .usage()
      .then((d) => {
        setEnabled(d.enabled);
        setUsage(d.usage);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || sending) return;

    setError('');
    const history = messages.slice(-10);
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setInput('');
    setSending(true);

    try {
      const res = await aiService.chat({
        question,
        history,
        lang: i18n.language?.slice(0, 2),
      });
      setMessages((m) => [...m, { role: 'assistant', content: res.answer }]);
      if (res.usage) setUsage((u) => ({ ...u, used: res.usage.used, limit: res.usage.limit }));
    } catch (e) {
      setError(errorMessage(e));
      // Oxirgi yuborilgan savolni qayta urinish uchun saqlaymiz.
      setInput(question);
      setMessages((m) => m.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  // Login talab qilinadi
  if (!checking && !user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 w-fit rounded-2xl bg-primary/10 p-4 text-primary"><Sparkles size={32} /></div>
        <h1 className="text-2xl font-bold">{t('ai.title')}</h1>
        <p className="mt-2 text-base-content/60">{t('ai.loginRequired')}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" className="btn btn-primary">{t('nav.login')}</Link>
          <Link to="/register" className="btn btn-outline">{t('nav.register')}</Link>
        </div>
      </div>
    );
  }

  if (checking) return <Loading full />;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-6">
      {/* Sarlavha */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary"><Sparkles size={22} /></div>
          <div>
            <h1 className="text-xl font-bold">{t('ai.title')}</h1>
            <p className="text-sm text-base-content/60">{t('ai.subtitle')}</p>
          </div>
        </div>
        {usage && (
          <span className="badge badge-ghost">{t('ai.usage', { used: usage.used, limit: usage.limit })}</span>
        )}
      </div>

      {!enabled && (
        <div className="alert alert-warning mt-4">
          <AlertTriangle size={18} />
          <span>{t('ai.disabled')}</span>
        </div>
      )}

      {/* Chat oynasi */}
      <div className="mt-4 flex-1 overflow-y-auto rounded-2xl border border-base-200 bg-base-100 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-base-content/50">
            <Bot size={40} />
            <p>{t('ai.emptyState')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role} content={m.content} />
            ))}
            {sending && (
              <div className="chat chat-start">
                <div className="chat-image avatar avatar-placeholder">
                  <div className="w-9 rounded-full bg-primary/10 text-primary"><Bot size={18} /></div>
                </div>
                <div className="chat-bubble bg-base-200 text-base-content">
                  <span className="loading loading-dots loading-sm" /> {t('ai.thinking')}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-error mt-3">
          <span className="flex-1">{t(error.includes('.') ? error : 'errors.generic')}</span>
          <button className="btn btn-sm" onClick={() => send()}><RefreshCw size={14} /> {t('common.retry')}</button>
        </div>
      )}

      {/* Tezkor amallar */}
      {messages.length > 0 && !sending && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn btn-xs btn-outline" onClick={() => send(t('ai.explainAgain'))} disabled={!enabled}>
            <RefreshCw size={12} /> {t('ai.explainAgain')}
          </button>
          <button className="btn btn-xs btn-outline" onClick={() => send(t('ai.giveExample'))} disabled={!enabled}>
            <Lightbulb size={12} /> {t('ai.giveExample')}
          </button>
        </div>
      )}

      {/* Kiritish */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="mt-3 flex items-end gap-2"
      >
        <textarea
          className="textarea textarea-bordered flex-1 resize-none"
          rows={1}
          maxLength={1000}
          placeholder={t('ai.placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          disabled={!enabled || sending}
        />
        <button type="submit" className="btn btn-primary" disabled={!enabled || sending || !input.trim()}>
          <Send size={18} />
        </button>
      </form>
      <p className="mt-2 text-center text-xs text-base-content/40">{t('ai.disclaimer')}</p>
    </div>
  );
}

function ChatBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`chat ${isUser ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar avatar-placeholder">
        <div className={`w-9 rounded-full ${isUser ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
          {isUser ? <UserIcon size={18} /> : <Bot size={18} />}
        </div>
      </div>
      <div className={`chat-bubble whitespace-pre-line ${isUser ? 'chat-bubble-primary' : 'bg-base-200 text-base-content'}`}>
        {content}
      </div>
    </div>
  );
}
