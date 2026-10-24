import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/index.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // dastlabki /me tekshiruvi

  // Foydalanuvchining afzal tilini interfeysga qo'llaymiz.
  const applyUserLanguage = useCallback(
    (u) => {
      if (u?.preferredLanguage && u.preferredLanguage !== i18n.language) {
        i18n.changeLanguage(u.preferredLanguage);
      }
    },
    [i18n]
  );

  useEffect(() => {
    let active = true;
    authService
      .me()
      .then((data) => {
        if (!active) return;
        setUser(data.user);
        applyUserLanguage(data.user);
      })
      .catch(() => {
        if (active) setUser(null); // tizimga kirmagan
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [applyUserLanguage]);

  const login = async (creds) => {
    const data = await authService.login(creds);
    setUser(data.user);
    applyUserLanguage(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    setUser(data.user);
    applyUserLanguage(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const updateUser = (u) => setUser(u);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  return ctx;
}
