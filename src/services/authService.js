const ACCESS_KEY = 'tm_access_token';
const REFRESH_KEY = 'tm_refresh_token';
const USER_KEY = 'tm_user';

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
  },
  updateUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
