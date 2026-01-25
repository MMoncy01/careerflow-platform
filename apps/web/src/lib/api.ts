const API_URL = import.meta.env.VITE_API_URL as string;

export type User = {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function listUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/users`);

  if (!res.ok) {
    throw new Error(`Failed to load users (${res.status})`);
  }

  return res.json();
}

export async function createUser(data: {
  email: string;
  name?: string;
}): Promise<User> {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.status === 409) {
    const body = await res.json();
    throw new Error(body.message ?? 'Email already exists');
  }

  if (!res.ok) {
    throw new Error(`Create failed (${res.status})`);
  }

  return res.json();
}

export type ApplicationStatus = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';

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

export async function listApplications(status?: ApplicationStatus): Promise<JobApplication[]> {
  const url = new URL(`${API_URL}/applications`);
  if (status) url.searchParams.set('status', status);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to load applications (${res.status})`);
  return res.json();
}

export async function createApplication(data: {
  company: string;
  role: string;
  status?: ApplicationStatus;
  notes?: string;
  appliedAt?: string;
}): Promise<JobApplication> {
  const res = await fetch(`${API_URL}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Create failed (${res.status})`);
  }

  return res.json();
}

export async function deleteApplication(id: string): Promise<{ deleted: boolean }> {
  const res = await fetch(`${API_URL}/applications/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Delete failed (${res.status})`);
  return res.json();
}
