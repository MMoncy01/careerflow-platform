import { useEffect, useState } from 'react';
import {
  createApplication,
  deleteApplication,
  listApplications,
  updateApplication,
  type ApplicationStatus,
  type JobApplication,
} from '../lib/api';

const STATUSES: ApplicationStatus[] = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];

export default function ApplicationsPage() {
  const [items, setItems] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | 'ALL'>('ALL');

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('APPLIED');
  const [appliedAt, setAppliedAt] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);

    try {
      const data = await listApplications(filter === 'ALL' ? undefined : filter);
      setItems(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await createApplication({
        company: company.trim(),
        role: role.trim(),
        status,
        appliedAt: appliedAt || undefined,
        notes: notes.trim() || undefined,
      });

      setCompany('');
      setRole('');
      setStatus('APPLIED');
      setAppliedAt('');
      setNotes('');
      setSuccess('Application added successfully.');
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  async function onStatusChange(id: string, nextStatus: ApplicationStatus) {
    try {
      await updateApplication(id, { status: nextStatus });
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Update failed');
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this application?')) return;

    try {
      await deleteApplication(id);
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Delete failed');
    }
  }

  return (
    <main className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="badge">Applications</div>
          <h1 style={{ fontSize: 42, margin: '12px 0 6px' }}>Job Applications</h1>
          <p className="muted">Add, filter, update, and manage your job search pipeline.</p>
        </div>
      </div>

      <section className="card" style={{ padding: 22, marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>Add application</h2>

        <form onSubmit={onCreate} className="grid">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input
              className="input"
              placeholder="Company"
              value={company}
              required
              onChange={(e) => setCompany(e.target.value)}
            />

            <input
              className="input"
              placeholder="Role"
              value={role}
              required
              onChange={(e) => setRole(e.target.value)}
            />

            <select className="select" value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <input className="input" type="date" value={appliedAt} onChange={(e) => setAppliedAt(e.target.value)} />
          </div>

          <textarea
            className="textarea"
            placeholder="Notes: referral, interview feedback, follow-up reminder..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Add Application'}
          </button>
        </form>
      </section>

      <section style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Your applications</h2>

          <div style={{ display: 'flex', gap: 10 }}>
            <select className="select" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="ALL">ALL</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button className="btn btn-secondary" onClick={load}>
              Refresh
            </button>
          </div>
        </div>

        {error && <p className="error">❌ {error}</p>}
        {success && <p className="success">✅ {success}</p>}

        {loading ? (
          <p className="muted">Loading applications...</p>
        ) : items.length === 0 ? (
          <div className="card" style={{ padding: 24, marginTop: 14 }}>
            <p className="muted" style={{ margin: 0 }}>
              No applications found. Add your first application above.
            </p>
          </div>
        ) : (
          <div className="grid" style={{ marginTop: 14 }}>
            {items.map((a) => (
              <ApplicationCard
                key={a.id}
                app={a}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ApplicationCard({
  app,
  onStatusChange,
  onDelete,
}: {
  app: JobApplication;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
        <div>
          <div className="badge">{app.status}</div>
          <h3 style={{ margin: '10px 0 4px', fontSize: 22 }}>{app.company}</h3>
          <div className="muted">{app.role}</div>
          {app.appliedAt && (
            <div className="muted" style={{ marginTop: 6 }}>
              Applied: {app.appliedAt.slice(0, 10)}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'start' }}>
          <select
            className="select"
            value={app.status}
            onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button className="btn btn-danger" onClick={() => onDelete(app.id)}>
            Delete
          </button>
        </div>
      </div>

      {app.notes && (
        <p style={{ marginTop: 12, lineHeight: 1.6 }}>
          {app.notes}
        </p>
      )}
    </div>
  );
}