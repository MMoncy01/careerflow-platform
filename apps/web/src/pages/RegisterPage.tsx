import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('Demo User');
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
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="card" style={{ maxWidth: 450, margin: '40px auto', padding: 30 }}>
        <h1 style={{ marginTop: 0 }}>Create account</h1>
        <p className="muted">Start organizing your job search with CareerFlow.</p>

        <form onSubmit={onSubmit} className="grid">
          <label>
            Name
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

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
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {error && <p className="error">❌ {error}</p>}

        <p className="muted">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}