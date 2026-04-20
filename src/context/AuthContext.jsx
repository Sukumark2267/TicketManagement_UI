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

  const updateUser = (nextUser) => {
    authStorage.updateUser(nextUser);
    setUser(nextUser);
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
