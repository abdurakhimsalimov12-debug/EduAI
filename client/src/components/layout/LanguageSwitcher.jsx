import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { LANGUAGES } from '../../i18n/index.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import { authService } from '../../services/index.js';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const current = i18n.language?.slice(0, 2) || 'uz';

  const change = async (code) => {
    i18n.changeLanguage(code); // localStorage'da saqlanadi (i18n detection)
    // Tizimga kirgan bo'lsa, afzal tilni backendda ham yangilaymiz.
    if (user) {
      try {
        const { user: updated } = await authService.updateMe({ preferredLanguage: code });
        updateUser(updated);
      } catch {
        /* jim — til baribir o'zgardi */
      }
    }
  };

  const activeLang = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-1">
        <Globe size={18} />
        <span className="hidden sm:inline">{activeLang.flag} {activeLang.code.toUpperCase()}</span>
        <span className="sm:hidden">{activeLang.flag}</span>
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-44 p-2 shadow-lg">
        {LANGUAGES.map((l) => (
          <li key={l.code}>
            <button onClick={() => change(l.code)} className={current === l.code ? 'active' : ''}>
              <span>{l.flag}</span>
              <span className="flex-1">{l.label}</span>
              {current === l.code && <Check size={16} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
