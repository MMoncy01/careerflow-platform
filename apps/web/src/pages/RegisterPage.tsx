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
    <div style={{ maxWidth: 420, margin: '50px auto', fontFamily: 'system-ui' }}>
      <h1>Register</h1>
      <p>Create your CareerFlow account.</p>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10 }}
        />

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
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10 }}
        />

        <button disabled={loading} style={{ padding: 10 }}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>❌ {error}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}