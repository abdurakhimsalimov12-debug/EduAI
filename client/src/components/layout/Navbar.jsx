import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Menu, LayoutDashboard, User, LogOut, Shield } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/subjects', label: t('nav.subjects') },
    { to: '/ai', label: t('nav.aiTutor') },
  ];
  if (user) navLinks.push({ to: '/dashboard', label: t('nav.dashboard') });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-30 px-4">
      {/* Chap: logo + mobil menyu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle lg:hidden">
            <Menu />
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end}>{l.label}</NavLink>
              </li>
            ))}
            {isAdmin && (
              <li><NavLink to="/admin">{t('nav.admin')}</NavLink></li>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl gap-2">
          <GraduationCap className="text-primary" />
          <span className="font-bold">Edu<span className="text-primary">AI</span></span>
        </Link>
      </div>

      {/* Markaz: desktop menyu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active font-medium' : '')}>
                {l.label}
              </NavLink>
            </li>
          ))}
          {isAdmin && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active font-medium' : '')}>
                <Shield size={16} /> {t('nav.admin')}
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* O'ng: til + auth */}
      <div className="navbar-end gap-1">
        <LanguageSwitcher />
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar avatar-placeholder">
              <div className="bg-primary text-primary-content w-9 rounded-full">
                <span className="text-sm">{user.name?.[0]?.toUpperCase() || 'U'}</span>
              </div>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg">
              <li className="menu-title truncate">{user.name}</li>
              <li><Link to="/dashboard"><LayoutDashboard size={16} /> {t('nav.dashboard')}</Link></li>
              <li><Link to="/profile"><User size={16} /> {t('nav.profile')}</Link></li>
              {isAdmin && <li><Link to="/admin"><Shield size={16} /> {t('nav.admin')}</Link></li>}
              <li><button onClick={handleLogout} className="text-error"><LogOut size={16} /> {t('nav.logout')}</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-1">
            <Link to="/login" className="btn btn-ghost btn-sm">{t('nav.login')}</Link>
            <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
