export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const apiUrl = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL || 'http://localhost:3001/api';

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Não foi possível concluir a solicitação.');
  }
  return response.status === 204 ? (undefined as T) : response.json();
};

export const authApi = {
  login: (email: string, password: string) => request<{ user: AuthUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request<{ user: AuthUser }>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  me: () => request<{ user: AuthUser }>('/auth/me'),
  logout: () => request<void>('/auth/logout', { method: 'POST' })
};

export const proposalApi = {
  create: (data: { name: string; email: string; institution: string; challenge: string; context: string; desiredImpact: string }) =>
    request<{ id: number }>('/proposals', { method: 'POST', body: JSON.stringify(data) })
};

export type AdminResource = 'courses' | 'articles' | 'edicts' | 'events' | 'members' | 'proposals' | 'prototypes';
export type AdminRecord = Record<string, string | number | string[]>;

export const contentApi = {
  list: <T>(resource: string) => request<T[]>(`/${resource}`),
  adminList: <T>(resource: AdminResource) => request<T[]>(`/admin/${resource}`),
  create: (resource: AdminResource, data: AdminRecord) =>
    request<{ id: number }>(`/admin/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (resource: AdminResource, id: number, data: AdminRecord) =>
    request<void>(`/admin/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (resource: AdminResource, id: number) =>
    request<void>(`/admin/${resource}/${id}`, { method: 'DELETE' })
};
