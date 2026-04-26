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
    <main className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="badge">Dashboard</div>
          <h1 style={{ fontSize: 42, margin: '12px 0 6px' }}>
            Welcome{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="muted">Here is your current job search pipeline overview.</p>
        </div>

        <Link className="btn btn-primary" to="/applications">
          Add / Manage Applications
        </Link>
      </div>

      {error && <p className="error">❌ {error}</p>}

      {loading ? (
        <p className="muted">Loading dashboard...</p>
      ) : stats ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            marginTop: 24,
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
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ fontSize: 34, fontWeight: 900 }}>{value}</div>
      <div className="muted" style={{ marginTop: 4 }}>{label}</div>
    </div>
  );
}