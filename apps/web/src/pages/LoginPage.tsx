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
    <div style={{ maxWidth: 420, margin: '50px auto', fontFamily: 'system-ui' }}>
      <h1>Login</h1>
      <p>Access your CareerFlow workspace.</p>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input
          placeholder="Email"
          value={email}
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Password"
          value={password}
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10 }}
        />

        <button disabled={loading} style={{ padding: 10 }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>❌ {error}</p>}

      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}