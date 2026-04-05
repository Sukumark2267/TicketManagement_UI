import httpClient from './httpClient';
import { authStorage } from './authService';
import { buildQuery } from '../utils/query';

export const api = {
  login: async (payload) => {
    const { data } = await httpClient.post('/auth/login', payload);
    authStorage.saveSession(data);
    return data;
  },
  logout: async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await httpClient.post('/auth/logout', { refreshToken });
      } catch {
        // Ignore logout failures and clear local session.
      }
    }
    authStorage.clear();
  },
  dashboard: {
    summary: async () => (await httpClient.get('/dashboard/summary')).data,
    byStatus: async () => (await httpClient.get('/dashboard/by-status')).data,
    byPriority: async () => (await httpClient.get('/dashboard/by-priority')).data,
    byCategory: async () => (await httpClient.get('/dashboard/by-category')).data,
    monthlyTrend: async () => (await httpClient.get('/dashboard/monthly-trend')).data
  },
  customers: {
    create: async (payload) => (await httpClient.post('/customers', payload)).data,
    list: async (params) => (await httpClient.get(`/customers${buildQuery(params)}`)).data,
    byId: async (id) => (await httpClient.get(`/customers/${id}`)).data,
    activate: async (id) => (await httpClient.put(`/customers/${id}/activate`, {})).data,
    deactivate: async (id) => (await httpClient.put(`/customers/${id}/deactivate`, {})).data
  },
  projects: {
    create: async (payload) => (await httpClient.post('/projects', payload)).data,
    list: async (params) => (await httpClient.get(`/projects${buildQuery(params)}`)).data,
    byId: async (id) => (await httpClient.get(`/projects/${id}`)).data
  },
  users: {
    createTechnician: async (payload) => (await httpClient.post('/users/technicians', payload)).data,
    technicians: async (params) => (await httpClient.get(`/users/technicians${buildQuery(params)}`)).data,
    activate: async (id) => (await httpClient.put(`/users/${id}/activate`, {})).data,
    deactivate: async (id) => (await httpClient.put(`/users/${id}/deactivate`, {})).data
  },
  tickets: {
    create: async (payload) => (await httpClient.post('/tickets', payload)).data,
    createOnBehalf: async (payload) => (await httpClient.post('/tickets/on-behalf', payload)).data,
    list: async (params) => (await httpClient.get(`/tickets${buildQuery(params)}`)).data,
    mine: async (params) => (await httpClient.get(`/tickets/my-tickets${buildQuery(params)}`)).data,
    assigned: async (params) => (await httpClient.get(`/tickets/assigned-to-me${buildQuery(params)}`)).data,
    byId: async (id) => (await httpClient.get(`/tickets/${id}`)).data,
    photo: async (id) => (await httpClient.get(`/tickets/${id}/photo`, { responseType: 'blob' })).data,
    update: async (id, payload) => (await httpClient.put(`/tickets/${id}`, payload)).data,
    assignTechnician: async (id, payload) => (await httpClient.put(`/tickets/${id}/assign-technician`, payload)).data,
    updateStatus: async (id, payload) => (await httpClient.put(`/tickets/${id}/status`, payload)).data
  },
  categories: {
    list: async (params) => (await httpClient.get(`/categories${buildQuery(params)}`)).data,
    create: async (payload) => (await httpClient.post('/categories', payload)).data,
    update: async (id, payload) => (await httpClient.put(`/categories/${id}`, payload)).data,
    remove: async (id) => (await httpClient.delete(`/categories/${id}`)).data
  },
  priorities: {
    list: async (params) => (await httpClient.get(`/priorities${buildQuery(params)}`)).data,
    create: async (payload) => (await httpClient.post('/priorities', payload)).data,
    update: async (id, payload) => (await httpClient.put(`/priorities/${id}`, payload)).data,
    remove: async (id) => (await httpClient.delete(`/priorities/${id}`)).data
  },
  statuses: {
    list: async (params) => (await httpClient.get(`/statuses${buildQuery(params)}`)).data,
    create: async (payload) => (await httpClient.post('/statuses', payload)).data,
    update: async (id, payload) => (await httpClient.put(`/statuses/${id}`, payload)).data,
    remove: async (id) => (await httpClient.delete(`/statuses/${id}`)).data
  },
  serviceTypes: {
    list: async (params) => (await httpClient.get(`/service-types${buildQuery(params)}`)).data,
    create: async (payload) => (await httpClient.post('/service-types', payload)).data,
    update: async (id, payload) => (await httpClient.put(`/service-types/${id}`, payload)).data,
    remove: async (id) => (await httpClient.delete(`/service-types/${id}`)).data
  }
};
