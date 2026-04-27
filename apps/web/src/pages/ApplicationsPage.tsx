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
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await listApplications(filter || undefined, search || undefined);
    setItems(data);
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await createApplication(cleanApplicationPayload(form));

    setForm(emptyForm);
    setSaving(false);
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

      <section className="card" style={{ padding: 24, marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>Add new application</h2>

        <form onSubmit={onCreate} className="grid">
          <FormSection title="Job Details">
            <Field label="Company *">
              <input
                className="input"
                placeholder="Example: Scotiabank"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />
            </Field>

            <Field label="Role / Position *">
              <input
                className="input"
                placeholder="Example: Software Developer"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              />
            </Field>

            <Field label="Application Status">
              <select
                className="select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Location">
              <input
                className="input"
                placeholder="Example: Toronto, ON / Remote"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </Field>

            <Field label="Job Posting URL">
              <input
                className="input"
                placeholder="Paste job posting link"
                value={form.jobUrl}
                onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
              />
            </Field>

            <Field label="Source">
              <input
                className="input"
                placeholder="Example: LinkedIn, Referral, Company Website"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              />
            </Field>
          </FormSection>

          <FormSection title="Recruiter & Resume Details">
            <Field label="Recruiter / Contact Name">
              <input
                className="input"
                placeholder="Example: Jane Recruiter"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              />
            </Field>

            <Field label="Recruiter / Contact Email">
              <input
                className="input"
                placeholder="Example: jane@company.com"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </Field>

            <Field label="Resume Version Used">
              <input
                className="input"
                placeholder="Example: Software Developer Resume v2"
                value={form.resumeVersion}
                onChange={(e) => setForm({ ...form, resumeVersion: e.target.value })}
              />
            </Field>
          </FormSection>

          <FormSection title="Dates & Follow-Up">
            <Field label="Applied Date">
              <input
                className="input"
                type="date"
                value={form.appliedAt}
                onChange={(e) => setForm({ ...form, appliedAt: e.target.value })}
              />
            </Field>

            <Field label="Follow-Up Date">
              <input
                className="input"
                type="date"
                value={form.followUpDate}
                onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
              />
            </Field>
          </FormSection>

          <Field label="Job Description">
            <textarea
              className="textarea"
              placeholder="Paste job description or key requirements here..."
              value={form.jobDescription}
              onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
            />
          </Field>

          <Field label="Private Notes">
            <textarea
              className="textarea"
              placeholder="Referral details, recruiter updates, next steps, interview notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Field>

          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Adding...' : 'Add Application'}
          </button>
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

          <button className="btn btn-secondary" onClick={load}>
            Search
          </button>

          <select
            className="select"
            style={{ maxWidth: 220 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">ALL STATUS</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
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

                  {a.appliedAt && <div className="muted">Applied: {a.appliedAt.slice(0, 10)}</div>}

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
                  <select
                    className="select"
                    value={a.status}
                    onChange={(e) => quickStatus(a.id, e.target.value as ApplicationStatus)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>

                  <button className="btn btn-danger" onClick={() => remove(a.id)}>
                    Delete
                  </button>
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

function cleanApplicationPayload(form: any) {
  return {
    company: form.company,
    role: form.role,
    status: form.status,

    location: form.location || undefined,
    jobUrl: form.jobUrl || undefined,
    source: form.source || undefined,
    contactName: form.contactName || undefined,
    contactEmail: form.contactEmail || undefined,
    resumeVersion: form.resumeVersion || undefined,
    jobDescription: form.jobDescription || undefined,
    notes: form.notes || undefined,
    appliedAt: form.appliedAt || undefined,
    followUpDate: form.followUpDate || undefined,
  };
}


function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 style={{ margin: '8px 0 12px' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'grid', gap: 6, fontWeight: 700 }}>
      <span>{label}</span>
      {children}
    </label>
  );
}