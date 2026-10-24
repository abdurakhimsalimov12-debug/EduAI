import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Globe, Shield } from 'lucide-react';
import { LANGUAGES } from '../i18n/index.js';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useToast } from '../components/ui/ToastContext.jsx';
import { authService, errorMessage } from '../services/index.js';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    name: user?.name || '',
    preferredLanguage: user?.preferredLanguage || 'uz',
  });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { user: updated } = await authService.updateMe(form);
      updateUser(updated);
      if (updated.preferredLanguage) i18n.changeLanguage(updated.preferredLanguage);
      toast.success(t('profile.saved'));
    } catch (err) {
      toast.error(t(errorMessage(err)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">{t('profile.title')}</h1>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          {/* Avatar */}
          <div className="mb-4 flex items-center gap-4">
            <div className="avatar avatar-placeholder">
              <div className="w-16 rounded-full bg-primary text-primary-content">
                <span className="text-2xl">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold">{user?.name}</div>
              <div className="flex items-center gap-1 text-sm text-base-content/60">
                <Shield size={14} /> {t('profile.role')}: {user?.role}
              </div>
            </div>
          </div>

          <form onSubmit={save} className="space-y-3">
            <label className="form-control">
              <span className="label-text mb-1">{t('profile.name')}</span>
              <div className="input input-bordered flex items-center gap-2">
                <User size={16} className="text-base-content/40" />
                <input type="text" minLength={2} required className="grow"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </label>

            <label className="form-control">
              <span className="label-text mb-1">{t('profile.email')}</span>
              <div className="input input-bordered flex items-center gap-2 opacity-70">
                <Mail size={16} className="text-base-content/40" />
                <input type="email" disabled className="grow" value={user?.email || ''} />
              </div>
            </label>

            <label className="form-control">
              <span className="label-text mb-1 flex items-center gap-1"><Globe size={14} /> {t('profile.language')}</span>
              <select className="select select-bordered"
                value={form.preferredLanguage}
                onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}>
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
              </select>
            </label>

            <button className="btn btn-primary w-full" disabled={saving}>
              {saving && <span className="loading loading-spinner loading-sm" />}
              {t('profile.saveChanges')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
