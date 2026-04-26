import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('demo@test.com');
  const [password, setPassword] = useState('StrongPass123!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="card" style={{ maxWidth: 450, margin: '40px auto', padding: 30 }}>
        <h1 style={{ marginTop: 0 }}>Welcome back</h1>
        <p className="muted">Login to continue tracking your job applications.</p>

        <form onSubmit={onSubmit} className="grid">
          <label>
            Email
            <input
              className="input"
              value={email}
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              className="input"
              value={password}
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <p className="error">❌ {error}</p>}

        <p className="muted">
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
}