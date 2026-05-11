const ACCESS_KEY = 'tm_access_token';
const REFRESH_KEY = 'tm_refresh_token';
const USER_KEY = 'tm_user';
const LAST_ACTIVITY_KEY = 'tm_last_activity';

export const getLoginHashUrl = () => `${window.location.origin}${window.location.pathname}#/login`;

export const authStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_KEY) ?? '',
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY) ?? '',
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  saveSession: (response) => {
    localStorage.setItem(ACCESS_KEY, response.accessToken);
    localStorage.setItem(REFRESH_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  },
  updateUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  },
  getLastActivityAt: () => {
    const value = localStorage.getItem(LAST_ACTIVITY_KEY);
    return value ? Number(value) : 0;
  },
  touchActivity: () => {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }
};
