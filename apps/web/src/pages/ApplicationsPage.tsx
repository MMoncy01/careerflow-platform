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

const emptyForm = {
  company: '',
  role: '',
  status: 'APPLIED',
  location: '',
  jobUrl: '',
  source: '',
  contactName: '',
  contactEmail: '',
  resumeVersion: '',
  jobDescription: '',
  notes: '',
  appliedAt: '',
  followUpDate: '',
};

export default function ApplicationsPage() {
  const [items, setItems] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<any>(emptyForm);

  async function load() {
    const data = await listApplications(filter || undefined, search || undefined);
    setItems(data);
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    await createApplication(form);
    setForm(emptyForm);
    await load();
  }

  async function quickStatus(id: string, status: ApplicationStatus) {
    await updateApplication(id, { status });
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this application?')) return;
    await deleteApplication(id);
    await load();
  }

  return (
    <main className="page">
      <div className="badge">Career Applications Workspace</div>
      <h1 style={{ fontSize: 42, margin: '12px 0 6px' }}>Applications Manager</h1>
      <p className="muted">
        Track every application, recruiter contact, follow-up, resume version, and outcome.
      </p>

      <section className="card" style={{ padding: 22, marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>Add new application</h2>

        <form onSubmit={onCreate} className="grid">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input className="input" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            <input className="input" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />

            <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>

            <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input className="input" placeholder="Job URL" value={form.jobUrl} onChange={(e) => setForm({ ...form, jobUrl: e.target.value })} />
            <input className="input" placeholder="Source (LinkedIn, Referral...)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            <input className="input" placeholder="Recruiter Contact Name" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            <input className="input" placeholder="Recruiter Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            <input className="input" placeholder="Resume Version Used" value={form.resumeVersion} onChange={(e) => setForm({ ...form, resumeVersion: e.target.value })} />
            <input className="input" type="date" value={form.appliedAt} onChange={(e) => setForm({ ...form, appliedAt: e.target.value })} />
            <input className="input" type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} />
          </div>

          <textarea className="textarea" placeholder="Job Description" value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} />
          <textarea className="textarea" placeholder="Private Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

          <button className="btn btn-primary">Add Application</button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="input"
            style={{ maxWidth: 300 }}
            placeholder="Search company / role / recruiter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn btn-secondary" onClick={load}>Search</button>

          <select className="select" style={{ maxWidth: 220 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">ALL STATUS</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid" style={{ marginTop: 18 }}>
          {items.map((a) => (
            <div key={a.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
                <div style={{ maxWidth: 720 }}>
                  <div className="badge">{a.status}</div>
                  <h3 style={{ margin: '10px 0 4px', fontSize: 22 }}>{a.company}</h3>
                  <div className="muted">{a.role}</div>
                  {a.location && <div className="muted">{a.location}</div>}
                  {(a.contactName || a.contactEmail) && (
                    <div className="muted">
                      {a.contactName} {a.contactEmail ? `• ${a.contactEmail}` : ''}
                    </div>
                  )}
                  {a.resumeVersion && <div className="muted">Resume: {a.resumeVersion}</div>}
                  {a.followUpDate && <div className="muted">Follow up: {a.followUpDate.slice(0, 10)}</div>}
                  {a.jobUrl && (
                    <div style={{ marginTop: 6 }}>
                      <a href={a.jobUrl} target="_blank" rel="noreferrer">
                        View Job Posting
                      </a>
                    </div>
                  )}
                  {a.notes && <p>{a.notes}</p>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <select className="select" value={a.status} onChange={(e) => quickStatus(a.id, e.target.value as ApplicationStatus)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>

                  <button className="btn btn-danger" onClick={() => remove(a.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="card" style={{ padding: 22 }}>
              <p className="muted">No applications found. Add one above.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}