import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { lessonService, subjectService, errorMessage } from '../../services/index.js';
import { useToast } from '../ui/ToastContext.jsx';
import useLocalized from '../../hooks/useLocalized.js';
import TriLingualInput from '../ui/TriLingualInput.jsx';
import Loading from '../ui/Loading.jsx';

const EMPTY = {
  subject: '', slug: '', level: 'beginner', order: 0,
  title: { uz: '', ru: '', en: '' }, content: { uz: '', ru: '', en: '' },
  examples: { uz: '', ru: '', en: '' }, keyPoints: { uz: '', ru: '', en: '' },
};
const LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function LessonsAdmin() {
  const { t } = useTranslation();
  const L = useLocalized();
  const toast = useToast();
  const [lessons, setLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([lessonService.list(), subjectService.list()])
      .then(([l, s]) => { setLessons(l.lessons); setSubjects(s.subjects); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm({ ...EMPTY, subject: subjects[0]?._id || '' }); setEditId(null); };
  const openEdit = (l) => {
    setForm({
      subject: l.subject?._id || l.subject, slug: l.slug, level: l.level, order: l.order,
      title: l.title, content: l.content, examples: l.examples, keyPoints: l.keyPoints,
    });
    setEditId(l._id);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) await lessonService.update(editId, form);
      else await lessonService.create(form);
      toast.success(t('profile.saved'));
      setForm(null);
      load();
    } catch (err) {
      toast.error(t(errorMessage(err)) || errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (l) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try { await lessonService.remove(l._id); load(); }
    catch (err) { toast.error(t(errorMessage(err))); }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button className="btn btn-primary btn-sm gap-1" onClick={openCreate} disabled={subjects.length === 0}>
          <Plus size={16} /> {t('admin.addLesson')}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100">
        <table className="table">
          <thead>
            <tr><th>{t('lessons.title')}</th><th>{t('subjects.title')}</th><th></th></tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l._id}>
                <td className="font-medium">{L(l.title)}</td>
                <td className="text-base-content/60">{l.subject ? L(l.subject.name) : '—'}</td>
                <td className="text-right">
                  <button className="btn btn-ghost btn-xs" onClick={() => openEdit(l)}><Pencil size={14} /></button>
                  <button className="btn btn-ghost btn-xs text-error" onClick={() => remove(l)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="mb-3 text-lg font-bold">{editId ? t('common.edit') : t('admin.addLesson')}</h3>
            <form onSubmit={save} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="form-control">
                  <span className="label-text mb-1">{t('subjects.title')}</span>
                  <select className="select select-bordered select-sm" required
                    value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    {subjects.map((s) => <option key={s._id} value={s._id}>{L(s.name)}</option>)}
                  </select>
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">{t('admin.slug')}</span>
                  <input className="input input-bordered input-sm" required pattern="[a-z0-9-]+"
                    value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">{t('common.level')}</span>
                  <select className="select select-bordered select-sm"
                    value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                    {LEVELS.map((l) => <option key={l} value={l}>{t(`common.levels.${l}`)}</option>)}
                  </select>
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">{t('common.next')} (order)</span>
                  <input type="number" className="input input-bordered input-sm"
                    value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                </label>
              </div>
              <TriLingualInput label={t('lessons.title')} value={form.title} required
                onChange={(v) => setForm({ ...form, title: v })} />
              <TriLingualInput label={t('lessons.content')} value={form.content} textarea
                onChange={(v) => setForm({ ...form, content: v })} />
              <TriLingualInput label={t('lessons.examples')} value={form.examples} textarea
                onChange={(v) => setForm({ ...form, examples: v })} />
              <TriLingualInput label={t('lessons.keyPoints')} value={form.keyPoints} textarea
                onChange={(v) => setForm({ ...form, keyPoints: v })} />

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
