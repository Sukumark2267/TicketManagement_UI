import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { api } from '../services/api';
import { authStorage } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authStorage.getUser());
  const timingOutRef = useRef(false);
  const sessionTimeoutMinutes = Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES ?? 30);
  const sessionTimeoutMs = Math.max(sessionTimeoutMinutes, 1) * 60 * 1000;

  const login = async (payload) => {
    const response = await api.login(payload);
    setUser(response.user);
    return response;
  };

  const updateUser = (nextUser) => {
    authStorage.updateUser(nextUser);
    setUser(nextUser);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    timingOutRef.current = false;
  };

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const markActivity = () => {
      authStorage.touchActivity();
    };

    const checkTimeout = () => {
      if (timingOutRef.current) {
        return;
      }

      const lastActivityAt = authStorage.getLastActivityAt();
      if (lastActivityAt && Date.now() - lastActivityAt >= sessionTimeoutMs) {
        timingOutRef.current = true;
        void logout();
      }
    };

    markActivity();

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((eventName) => window.addEventListener(eventName, markActivity, { passive: true }));

    const intervalId = window.setInterval(checkTimeout, 60 * 1000);
    checkTimeout();

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, markActivity));
      window.clearInterval(intervalId);
    };
  }, [user, sessionTimeoutMs]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
    updateUser,
    hasRole: (roles) => roles.includes(user?.role),
    dashboardPath:
      user?.mustChangePassword
        ? '/change-password'
        : user?.role === 'Admin'
        ? '/dashboard/admin'
        : user?.role === 'Technician'
          ? '/dashboard/technician'
          : '/dashboard/customer'
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
