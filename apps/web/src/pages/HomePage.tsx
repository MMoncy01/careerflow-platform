import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="page">
      <section
        className="card"
        style={{
          padding: 38,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, 0.8fr)',
          gap: 28,
          alignItems: 'center',
        }}
      >
        <div>
          <div className="badge" style={{ marginBottom: 16 }}>
            Secure Job Tracking Platform
          </div>

          <h1 style={{ fontSize: 54, lineHeight: 1.05, margin: '0 0 14px' }}>
            Manage your job search like a real workflow.
          </h1>

          <p className="muted" style={{ fontSize: 18, lineHeight: 1.7, marginBottom: 24 }}>
            CareerFlow helps candidates organize applications, track interview stages,
            monitor outcomes, and keep job search progress in one secure dashboard.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to={user ? '/dashboard' : '/register'}>
              {user ? 'Open Dashboard' : 'Get Started'}
            </Link>

            <Link className="btn btn-secondary" to={user ? '/applications' : '/login'}>
              {user ? 'Manage Applications' : 'Login'}
            </Link>
          </div>
        </div>

        <div
          style={{
            background: '#111827',
            color: 'white',
            borderRadius: 24,
            padding: 26,
            minHeight: 290,
            boxShadow: '0 18px 45px rgba(17,24,39,0.25)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>What CareerFlow tracks</h2>
          <ul style={{ lineHeight: 2 }}>
            <li>Applications by company and role</li>
            <li>Status: Applied, Interview, Offer, Rejected</li>
            <li>Private user-owned records</li>
            <li>Notes and applied dates</li>
            <li>Dashboard statistics</li>
          </ul>
        </div>
      </section>
    </main>
  );
}