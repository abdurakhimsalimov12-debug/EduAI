import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { adminService, errorMessage } from '../../services/index.js';
import { useToast } from '../ui/ToastContext.jsx';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import Loading from '../ui/Loading.jsx';

export default function UsersAdmin() {
  const { t } = useTranslation();
  const toast = useToast();
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.users().then((d) => setUsers(d.users)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleRole = async (u) => {
    const next = u.role === 'admin' ? 'user' : 'admin';
    try {
      await adminService.setRole(u._id, next);
      load();
    } catch (err) {
      toast.error(t(errorMessage(err)));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100">
      <table className="table">
        <thead>
          <tr><th>{t('auth.name')}</th><th>{t('auth.email')}</th><th>{t('admin.role')}</th><th></th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="font-medium">{u.name}</td>
              <td className="text-base-content/60">{u.email}</td>
              <td>
                <span className={`badge badge-sm ${u.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>{u.role}</span>
              </td>
              <td className="text-right">
                {u._id !== me?._id && (
                  <button className="btn btn-ghost btn-xs gap-1" onClick={() => toggleRole(u)}>
                    {u.role === 'admin'
                      ? <><ShieldOff size={14} /> {t('admin.removeAdmin')}</>
                      : <><ShieldCheck size={14} /> {t('admin.makeAdmin')}</>}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
