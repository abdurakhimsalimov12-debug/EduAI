// uz/ru/en uchun uchta maydonli kirish (matn yoki ko'p qatorli).
export default function TriLingualInput({ label, value = {}, onChange, textarea = false, required = false }) {
  const langs = [
    { code: 'uz', flag: '🇺🇿' },
    { code: 'ru', flag: '🇷🇺' },
    { code: 'en', flag: '🇬🇧' },
  ];
  const set = (code, v) => onChange({ ...value, [code]: v });

  return (
    <div className="form-control">
      <span className="label-text mb-1 font-medium">{label}</span>
      <div className="space-y-2">
        {langs.map((l) => (
          <div key={l.code} className="flex items-start gap-2">
            <span className="mt-2 w-6 text-center">{l.flag}</span>
            {textarea ? (
              <textarea
                className="textarea textarea-bordered textarea-sm w-full"
                rows={2}
                required={required && l.code === 'uz'}
                value={value[l.code] || ''}
                onChange={(e) => set(l.code, e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                required={required && l.code === 'uz'}
                value={value[l.code] || ''}
                onChange={(e) => set(l.code, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
