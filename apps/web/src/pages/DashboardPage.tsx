import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationStats, type ApplicationStats } from '../lib/api';
import { useAuth } from '../auth/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    setError(null);
    setLoading(true);

    try {
      const data = await getApplicationStats();
      setStats(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>Dashboard</h1>
      <p>
        Welcome{user?.name ? `, ${user.name}` : ''}. Track your job search progress here.
      </p>

      {error && <p style={{ color: 'crimson' }}>❌ {error}</p>}

      {loading ? (
        <p>Loading dashboard...</p>
      ) : stats ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12,
            marginTop: 20,
          }}
        >
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Applied" value={stats.applied} />
          <StatCard label="Interview" value={stats.interview} />
          <StatCard label="Offer" value={stats.offer} />
          <StatCard label="Rejected" value={stats.rejected} />
          <StatCard label="Withdrawn" value={stats.withdrawn} />
        </div>
      ) : null}

      <div style={{ marginTop: 24 }}>
        <Link to="/applications">Manage Applications →</Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: 10,
        padding: 16,
        background: '#fafafa',
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      <div style={{ color: '#555' }}>{label}</div>
    </div>
  );
}