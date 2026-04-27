import { useEffect, useState } from 'react';
import {
  createInterview,
  deleteInterview,
  listApplications,
  listInterviews,
  updateInterview,
  type Interview,
  type InterviewResult,
  type InterviewType,
  type JobApplication,
} from '../lib/api';

const TYPES: InterviewType[] = [
  'HR',
  'TECHNICAL',
  'BEHAVIORAL',
  'MANAGERIAL',
  'FINAL',
  'OTHER',
];

const RESULTS: InterviewResult[] = [
  'SCHEDULED',
  'COMPLETED',
  'PASSED',
  'REJECTED',
  'CANCELLED',
];

const emptyForm = {
  title: '',
  type: 'TECHNICAL',
  round: 1,
  scheduledAt: '',
  result: 'SCHEDULED',
  notes: '',
  nextRoundAt: '',
  applicationId: '',
};

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [resultFilter, setResultFilter] = useState('');
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [interviewData, applicationData] = await Promise.all([
      listInterviews(resultFilter || undefined),
      listApplications(),
    ]);
    setInterviews(interviewData);
    setApplications(applicationData);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [resultFilter]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await createInterview({
      title: form.title || undefined,
      type: form.type,
      round: Number(form.round),
      scheduledAt: form.scheduledAt,
      result: form.result,
      notes: form.notes || undefined,
      nextRoundAt: form.nextRoundAt || undefined,
      applicationId: form.applicationId || undefined,
    });

    setForm(emptyForm);
    setSaving(false);
    await load();
  }

  async function quickResult(id: string, result: InterviewResult) {
    await updateInterview(id, { result });
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this interview?')) return;
    await deleteInterview(id);
    await load();
  }

  return (
    <main className="page">
      <div className="badge">Interview Pipeline</div>
      <h1 style={{ fontSize: 42, margin: '12px 0 6px' }}>Interview Tracker</h1>
      <p className="muted">
        Track HR screens, technical interviews, next rounds, preparation notes,
        and outcomes linked to your applications.
      </p>

      <section className="card" style={{ padding: 22, marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>Add interview</h2>

        <form onSubmit={onCreate} className="grid">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input
              className="input"
              placeholder="Interview title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <select
              className="select"
              value={form.applicationId}
              onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
            >
              <option value="">No linked application</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.role}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <input
              className="input"
              type="number"
              min={1}
              placeholder="Round"
              value={form.round}
              onChange={(e) => setForm({ ...form, round: Number(e.target.value) })}
            />

            <input
              className="input"
              type="datetime-local"
              value={form.scheduledAt}
              required
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
            />

            <select
              className="select"
              value={form.result}
              onChange={(e) => setForm({ ...form, result: e.target.value })}
            >
              {RESULTS.map((result) => (
                <option key={result}>{result}</option>
              ))}
            </select>

            <input
              className="input"
              type="datetime-local"
              value={form.nextRoundAt}
              onChange={(e) => setForm({ ...form, nextRoundAt: e.target.value })}
            />
          </div>

          <textarea
            className="textarea"
            placeholder="Interview preparation notes, questions asked, feedback, next steps..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Add Interview'}
          </button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>Your interviews</h2>

          <select
            className="select"
            style={{ maxWidth: 220 }}
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
          >
            <option value="">ALL RESULTS</option>
            {RESULTS.map((result) => (
              <option key={result}>{result}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="muted">Loading interviews...</p>
        ) : interviews.length === 0 ? (
          <div className="card" style={{ padding: 22, marginTop: 18 }}>
            <p className="muted">No interviews found. Add one above.</p>
          </div>
        ) : (
          <div className="grid" style={{ marginTop: 18 }}>
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onResultChange={quickResult}
                onDelete={remove}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function InterviewCard({
  interview,
  onResultChange,
  onDelete,
}: {
  interview: Interview;
  onResultChange: (id: string, result: InterviewResult) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
        <div>
          <div className="badge">{interview.result}</div>
          <h3 style={{ margin: '10px 0 4px', fontSize: 22 }}>
            {interview.title || `${interview.type} Interview`}
          </h3>

          {interview.application && (
            <div className="muted">
              {interview.application.company} — {interview.application.role}
            </div>
          )}

          <div className="muted">Type: {interview.type}</div>
          <div className="muted">Round: {interview.round}</div>
          <div className="muted">
            Scheduled: {new Date(interview.scheduledAt).toLocaleString()}
          </div>

          {interview.nextRoundAt && (
            <div className="muted">
              Next round: {new Date(interview.nextRoundAt).toLocaleString()}
            </div>
          )}

          {interview.notes && <p style={{ lineHeight: 1.6 }}>{interview.notes}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <select
            className="select"
            value={interview.result}
            onChange={(e) => onResultChange(interview.id, e.target.value as InterviewResult)}
          >
            {RESULTS.map((result) => (
              <option key={result}>{result}</option>
            ))}
          </select>

          <button className="btn btn-danger" onClick={() => onDelete(interview.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}