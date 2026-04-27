import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getApplicationStats,
  getInterviewStats,
  type DashboardStats,
  type InterviewStats,
} from '../lib/api';
import { useAuth } from '../auth/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [appStats, setAppStats] = useState<DashboardStats | null>(null);
  const [interviewStats, setInterviewStats] = useState<InterviewStats | null>(null);

  async function load() {
    const [apps, interviews] = await Promise.all([
      getApplicationStats(),
      getInterviewStats(),
    ]);

    setAppStats(apps);
    setInterviewStats(interviews);
  }

  useEffect(() => {
    load();
  }, []);

  if (!appStats || !interviewStats) {
    return (
      <main className="page">
        <p className="muted">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="badge">Dashboard Analytics</div>
          <h1 style={{ fontSize: 42, margin: '12px 0 6px' }}>
            Welcome{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="muted">Your job search, applications, interviews, and follow-up overview.</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link className="btn btn-secondary" to="/interviews">
            Add Interview
          </Link>
          <Link className="btn btn-primary" to="/applications">
            Manage Applications
          </Link>
        </div>
      </div>

      <h2 style={{ marginTop: 28 }}>Application Overview</h2>

      <div
        style={{
          marginTop: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
          gap: 14,
        }}
      >
        <Stat title="Total Apps" value={appStats.total} />
        <Stat title="Applied" value={appStats.applied} />
        <Stat title="Interview" value={appStats.interview} />
        <Stat title="Offer" value={appStats.offer} />
        <Stat title="Response %" value={`${appStats.responseRate}%`} />
        <Stat title="Weekly Added" value={appStats.weeklyApplications} />
      </div>

      <h2 style={{ marginTop: 28 }}>Interview Overview</h2>

      <div
        style={{
          marginTop: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
          gap: 14,
        }}
      >
        <Stat title="Total Interviews" value={interviewStats.total} />
        <Stat title="Scheduled" value={interviewStats.scheduled} />
        <Stat title="Completed" value={interviewStats.completed} />
        <Stat title="Passed" value={interviewStats.passed} />
        <Stat title="Rejected" value={interviewStats.rejected} />
        <Stat title="Cancelled" value={interviewStats.cancelled} />
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
          {appStats.needsFollowUp.length === 0 ? (
            <p className="muted">No follow ups due.</p>
          ) : (
            appStats.needsFollowUp.map((a) => (
              <MiniApp key={a.id} title={a.company} subtitle={a.role} badge={a.status} />
            ))
          )}
        </Panel>

        <Panel title="Upcoming Interviews">
          {interviewStats.upcoming.length === 0 ? (
            <p className="muted">No upcoming interviews scheduled.</p>
          ) : (
            interviewStats.upcoming.map((i) => (
              <MiniApp
                key={i.id}
                title={i.application?.company ?? i.title ?? 'Interview'}
                subtitle={`${i.type} • Round ${i.round} • ${new Date(i.scheduledAt).toLocaleString()}`}
                badge={i.result}
              />
            ))
          )}
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

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div className="grid">{children}</div>
    </div>
  );
}

function MiniApp({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <div style={{ border: '1px solid #eceff5', borderRadius: 12, padding: 12 }}>
      <strong>{title}</strong>
      <div className="muted">{subtitle}</div>
      <div className="badge" style={{ marginTop: 6 }}>
        {badge}
      </div>
    </div>
  );
}