import { useEffect, useState } from 'react';
import { createUser, listUsers, type User } from '../lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  async function load() {
    setError(null);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load users');
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await createUser({
        email: email.trim(),
        name: name.trim() || undefined,
      });
      setEmail('');
      setName('');
      setSuccess('User created successfully');
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>CareerFlow – Users</h1>

      <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 8, width: '100%', marginBottom: 8 }}
        />
        <input
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8, width: '100%', marginBottom: 8 }}
        />
        <button disabled={loading} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          {loading ? 'Creating…' : 'Create User'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>❌ {error}</p>}
      {success && <p style={{ color: 'green' }}>✅ {success}</p>}

      <h2>Users</h2>
      <button
        onClick={() => load()}
        disabled={initialLoading}
        style={{ padding: '6px 10px', cursor: 'pointer', marginBottom: 10 }}
      >
        Refresh
      </button>
      {initialLoading ? (
        <p>Loading users…</p>
      ) : users.length === 0 ? (
        <p style={{ color: '#555' }}>No users yet. Create the first one.</p>
      ) : (
        <ul>
            {users.map((u) => (
            <li key={u.id}>
                {u.email} {u.name && `(${u.name})`}
            </li>
            ))}
        </ul>
      )}
    </div>
  );
}
