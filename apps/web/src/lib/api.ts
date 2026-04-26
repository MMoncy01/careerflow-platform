const API_URL = import.meta.env.VITE_API_URL as string;

export type User = {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApplicationStatus =
  | 'APPLIED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  notes?: string | null;
  appliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationStats = {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json();
}

export async function register(data: {
  email: string;
  name?: string;
  password: string;
}): Promise<User> {
  return request<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function refresh(): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/refresh', {
    method: 'POST',
  });
}

export async function logout(): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>('/auth/logout', {
    method: 'POST',
  });
}

export async function me(): Promise<User> {
  return request<User>('/auth/me');
}

export async function listUsers(): Promise<User[]> {
  return request<User[]>('/users');
}

export async function listApplications(
  status?: ApplicationStatus,
): Promise<JobApplication[]> {
  const query = status ? `?status=${status}` : '';
  return request<JobApplication[]>(`/applications${query}`);
}

export async function createApplication(data: {
  company: string;
  role: string;
  status?: ApplicationStatus;
  notes?: string;
  appliedAt?: string;
}): Promise<JobApplication> {
  return request<JobApplication>('/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateApplication(
  id: string,
  data: Partial<{
    company: string;
    role: string;
    status: ApplicationStatus;
    notes: string;
    appliedAt: string;
  }>,
): Promise<JobApplication> {
  return request<JobApplication>(`/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteApplication(
  id: string,
): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>(`/applications/${id}`, {
    method: 'DELETE',
  });
}

export async function getApplicationStats(): Promise<ApplicationStats> {
  return request<ApplicationStats>('/applications/stats');
}