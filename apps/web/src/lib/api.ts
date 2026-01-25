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
