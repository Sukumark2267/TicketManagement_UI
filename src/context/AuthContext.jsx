import { createContext, useContext, useMemo, useState } from 'react';

import { api } from '../services/api';
import { authStorage } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authStorage.getUser());

  const login = async (payload) => {
    const response = await api.login(payload);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
    hasRole: (roles) => roles.includes(user?.role),
    dashboardPath:
      user?.role === 'Admin'
        ? '/dashboard/admin'
        : user?.role === 'Technician'
          ? '/dashboard/technician'
          : '/dashboard/customer'
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
