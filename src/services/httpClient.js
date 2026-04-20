import axios from 'axios';

import { authStorage } from './authService';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://api.supernal.in/api').replace(/\/$/, '');

const httpClient = axios.create({
  baseURL: API_BASE_URL
});

let refreshPromise = null;

httpClient.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          accessToken: authStorage.getAccessToken(),
          refreshToken: authStorage.getRefreshToken()
        }).then((response) => {
          authStorage.saveSession(response.data);
          return response.data.accessToken;
        }).finally(() => {
          refreshPromise = null;
        });
      }

      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        authStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
