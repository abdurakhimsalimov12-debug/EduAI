import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useToast } from '../components/ui/ToastContext.jsx';
import { errorMessage } from '../services/index.js';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form);
      toast.success(t('auth.welcome', { name: user.name }));
      navigate(location.state?.from || '/dashboard', { replace: true });
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
            <h1 className="mt-3 text-2xl font-bold">{t('auth.loginTitle')}</h1>
          </div>

          {error && <div className="alert alert-error text-sm">{t(error.includes('.') ? error : 'errors.generic') || error}</div>}

          <form onSubmit={submit} className="space-y-3">
            <label className="form-control">
              <span className="label-text mb-1">{t('auth.email')}</span>
              <div className="input input-bordered flex items-center gap-2">
                <Mail size={16} className="text-base-content/40" />
                <input
                  type="email" required autoComplete="email"
                  className="grow" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </label>
            <label className="form-control">
              <span className="label-text mb-1">{t('auth.password')}</span>
              <div className="input input-bordered flex items-center gap-2">
                <Lock size={16} className="text-base-content/40" />
                <input
                  type="password" required autoComplete="current-password"
                  className="grow" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </label>
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading && <span className="loading loading-spinner loading-sm" />}
              {t('auth.loginBtn')}
            </button>
          </form>

          <p className="mt-2 text-center text-sm text-base-content/60">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="link link-primary">{t('auth.registerLink')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
