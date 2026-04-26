import { useEffect, useState } from 'react';
import { listUsers, type User } from '../lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setError(null);
    setLoading(true);

    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>CareerFlow – Users</h1>
      <p>
        Users are now created through the authentication flow using the Register page.
      </p>

      <button onClick={load} disabled={loading} style={{ padding: '8px 12px' }}>
        {loading ? 'Loading...' : 'Refresh'}
      </button>

      {error && <p style={{ color: 'crimson' }}>❌ {error}</p>}

      <h2>Registered Users</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
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