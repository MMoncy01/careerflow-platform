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
    <main className="page">
      <div>
        <div className="badge">Users</div>
        <h1 style={{ fontSize: 42, margin: '12px 0 6px' }}>Registered Users</h1>
        <p className="muted">
          User accounts are created through the secure register/login flow.
        </p>
      </div>

      <button className="btn btn-secondary" onClick={load} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh'}
      </button>

      {error && <p className="error">❌ {error}</p>}

      <div className="grid" style={{ marginTop: 18 }}>
        {loading ? (
          <p className="muted">Loading users...</p>
        ) : users.length === 0 ? (
          <div className="card" style={{ padding: 20 }}>
            <p className="muted">No users found.</p>
          </div>
        ) : (
          users.map((u) => (
            <div className="card" key={u.id} style={{ padding: 18 }}>
              <strong>{u.email}</strong>
              <div className="muted">{u.name ?? 'No name provided'}</div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}