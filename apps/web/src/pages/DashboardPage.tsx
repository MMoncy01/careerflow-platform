import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationStats, type DashboardStats } from '../lib/api';
import { useAuth } from '../auth/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  async function load() {
    const data = await getApplicationStats();
    setStats(data);
  }

  useEffect(() => {
    load();
  }, []);

  if (!stats) {
    return <main className="page"><p>Loading dashboard...</p></main>;
  }

  return (
    <main className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="badge">Dashboard Analytics</div>
          <h1 style={{ fontSize: 42, margin: '12px 0 6px' }}>
            Welcome{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="muted">Your complete job search performance overview.</p>
        </div>

        <Link className="btn btn-primary" to="/applications">
          Manage Applications
        </Link>
      </div>

      <div
        style={{
          marginTop: 22,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
          gap: 14,
        }}
      >
        <Stat title="Total" value={stats.total} />
        <Stat title="Applied" value={stats.applied} />
        <Stat title="Interview" value={stats.interview} />
        <Stat title="Offer" value={stats.offer} />
        <Stat title="Response %" value={`${stats.responseRate}%`} />
        <Stat title="Weekly Added" value={stats.weeklyApplications} />
      </div>

      <div
        style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
        }}
      >
        <Panel title="Needs Follow Up">
          {stats.needsFollowUp.length === 0 ? (
            <p className="muted">No follow ups due.</p>
          ) : (
            stats.needsFollowUp.map((a) => (
              <MiniApp key={a.id} app={a} />
            ))
          )}
        </Panel>

        <Panel title="Recent Applications">
          {stats.recentApplications.map((a) => (
            <MiniApp key={a.id} app={a} />
          ))}
        </Panel>
      </div>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: any }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ fontSize: 30, fontWeight: 900 }}>{value}</div>
      <div className="muted">{title}</div>
    </div>
  );
}

function Panel({ title, children }: any) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div className="grid">{children}</div>
    </div>
  );
}

function MiniApp({ app }: any) {
  return (
    <div style={{ border: '1px solid #eceff5', borderRadius: 12, padding: 12 }}>
      <strong>{app.company}</strong>
      <div className="muted">{app.role}</div>
      <div className="badge" style={{ marginTop: 6 }}>{app.status}</div>
    </div>
  );
}