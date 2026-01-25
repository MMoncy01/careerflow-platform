import { useEffect, useState } from 'react';
import {
  createApplication,
  deleteApplication,
  listApplications,
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

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await listApplications(filter === 'ALL' ? undefined : filter);
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

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

      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this application?')) return;
    try {
      await deleteApplication(id);
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Delete failed');
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>CareerFlow – Applications</h1>

      <form onSubmit={onCreate} style={{ border: '1px solid #eee', padding: 16, borderRadius: 10 }}>
        <h2 style={{ marginTop: 0 }}>Add application</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input
            placeholder="Company"
            value={company}
            required
            onChange={(e) => setCompany(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            placeholder="Role"
            value={role}
            required
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: 8 }}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)} style={{ padding: 8 }}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={appliedAt}
            onChange={(e) => setAppliedAt(e.target.value)}
            style={{ padding: 8 }}
          />
        </div>

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 10, minHeight: 80 }}
        />

        <button disabled={saving} style={{ marginTop: 10, padding: '8px 12px', cursor: 'pointer' }}>
          {saving ? 'Saving…' : 'Add'}
        </button>
      </form>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 20 }}>
        <h2 style={{ margin: 0 }}>List</h2>

        <div style={{ marginLeft: 'auto' }}>
          <label style={{ marginRight: 6 }}>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} style={{ padding: 6 }}>
            <option value="ALL">ALL</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button onClick={load} style={{ marginLeft: 10, padding: '6px 10px', cursor: 'pointer' }}>
            Refresh
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'crimson' }}>❌ {error}</p>}

      {loading ? (
        <p>Loading applications…</p>
      ) : items.length === 0 ? (
        <p style={{ color: '#555' }}>No applications yet. Add your first one.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          {items.map((a) => (
            <div key={a.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{a.company}</div>
                  <div>{a.role}</div>
                  <div style={{ color: '#555', marginTop: 4 }}>
                    Status: <b>{a.status}</b>
                    {a.appliedAt ? ` • Applied: ${a.appliedAt.slice(0, 10)}` : ''}
                  </div>
                </div>

                <button onClick={() => onDelete(a.id)} style={{ height: 36, cursor: 'pointer' }}>
                  Delete
                </button>
              </div>

              {a.notes && <div style={{ marginTop: 8, color: '#333' }}>{a.notes}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}