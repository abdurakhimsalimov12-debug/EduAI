import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Mail, Lock, User } from 'lucide-react';
import { LANGUAGES } from '../i18n/index.js';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useToast } from '../components/ui/ToastContext.jsx';
import { errorMessage } from '../services/index.js';

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    preferredLanguage: i18n.language?.slice(0, 2) || 'uz',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register(form);
      toast.success(t('auth.welcome', { name: user.name }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-10">
      <div className="card w-full bg-base-100 shadow-md">
        <div className="card-body">
          <div className="mb-2 flex flex-col items-center text-center">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary"><GraduationCap size={28} /></div>
            <h1 className="mt-3 text-2xl font-bold">{t('auth.registerTitle')}</h1>
          </div>

          {error && <div className="alert alert-error text-sm">{t(error.includes('.') ? error : 'errors.generic') || error}</div>}

          <form onSubmit={submit} className="space-y-3">
            <label className="form-control">
              <span className="label-text mb-1">{t('auth.name')}</span>
              <div className="input input-bordered flex items-center gap-2">
                <User size={16} className="text-base-content/40" />
                <input type="text" required minLength={2} className="grow"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </label>
            <label className="form-control">
              <span className="label-text mb-1">{t('auth.email')}</span>
              <div className="input input-bordered flex items-center gap-2">
                <Mail size={16} className="text-base-content/40" />
                <input type="email" required autoComplete="email" className="grow"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </label>
            <label className="form-control">
              <span className="label-text mb-1">{t('auth.password')}</span>
              <div className="input input-bordered flex items-center gap-2">
                <Lock size={16} className="text-base-content/40" />
                <input type="password" required minLength={6} autoComplete="new-password" className="grow"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
            </label>
            <label className="form-control">
              <span className="label-text mb-1">{t('auth.preferredLanguage')}</span>
              <select className="select select-bordered"
                value={form.preferredLanguage}
                onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}>
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                ))}
              </select>
            </label>
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading && <span className="loading loading-spinner loading-sm" />}
              {t('auth.registerBtn')}
            </button>
          </form>

          <p className="mt-2 text-center text-sm text-base-content/60">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="link link-primary">{t('auth.loginLink')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
