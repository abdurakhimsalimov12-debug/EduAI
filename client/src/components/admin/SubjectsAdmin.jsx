import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { subjectService, errorMessage } from '../../services/index.js';
import { useToast } from '../ui/ToastContext.jsx';
import useLocalized from '../../hooks/useLocalized.js';
import TriLingualInput from '../ui/TriLingualInput.jsx';
import Loading from '../ui/Loading.jsx';

const EMPTY = {
  slug: '', icon: 'BookOpen', color: 'primary', level: 'beginner',
  name: { uz: '', ru: '', en: '' }, description: { uz: '', ru: '', en: '' },
};
const COLORS = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function SubjectsAdmin() {
  const { t } = useTranslation();
  const L = useLocalized();
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // null = modal yopiq
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    subjectService.list().then((d) => setSubjects(d.subjects)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm({ ...EMPTY }); setEditId(null); };
  const openEdit = (s) => {
    setForm({ slug: s.slug, icon: s.icon, color: s.color, level: s.level, name: s.name, description: s.description });
    setEditId(s._id);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) await subjectService.update(editId, form);
      else await subjectService.create(form);
      toast.success(t('profile.saved'));
      setForm(null);
      load();
    } catch (err) {
      toast.error(t(errorMessage(err)) || errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await subjectService.remove(s._id);
      load();
    } catch (err) {
      toast.error(t(errorMessage(err)));
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button className="btn btn-primary btn-sm gap-1" onClick={openCreate}>
          <Plus size={16} /> {t('admin.addSubject')}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100">
        <table className="table">
          <thead>
            <tr><th>{t('subjects.title')}</th><th>Slug</th><th>{t('common.level')}</th><th></th></tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s._id}>
                <td className="font-medium">{L(s.name)}</td>
                <td className="text-base-content/60">{s.slug}</td>
                <td><span className="badge badge-ghost badge-sm">{t(`common.levels.${s.level}`)}</span></td>
                <td className="text-right">
                  <button className="btn btn-ghost btn-xs" onClick={() => openEdit(s)}><Pencil size={14} /></button>
                  <button className="btn btn-ghost btn-xs text-error" onClick={() => remove(s)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {form && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="mb-3 text-lg font-bold">{editId ? t('common.edit') : t('admin.addSubject')}</h3>
            <form onSubmit={save} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="form-control">
                  <span className="label-text mb-1">{t('admin.slug')}</span>
                  <input className="input input-bordered input-sm" required pattern="[a-z0-9-]+"
                    value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">{t('admin.icon')} (lucide)</span>
                  <input className="input input-bordered input-sm"
                    value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">{t('admin.color')}</span>
                  <select className="select select-bordered select-sm"
                    value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
                    {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">{t('common.level')}</span>
                  <select className="select select-bordered select-sm"
                    value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                    {LEVELS.map((l) => <option key={l} value={l}>{t(`common.levels.${l}`)}</option>)}
                  </select>
                </label>
              </div>
              <TriLingualInput label={t('subjects.title')} value={form.name} required
                onChange={(v) => setForm({ ...form, name: v })} />
              <TriLingualInput label={t('lessons.content')} value={form.description} textarea
                onChange={(v) => setForm({ ...form, description: v })} />

              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setForm(null)}>{t('common.cancel')}</button>
                <button className="btn btn-primary" disabled={saving}>
                  {saving && <span className="loading loading-spinner loading-sm" />}
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setForm(null)}><button>close</button></form>
        </dialog>
      )}
    </div>
  );
}
