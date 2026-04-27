import { useEffect, useMemo, useState } from 'react';
import {
  listApplications,
  updateApplication,
  type ApplicationStatus,
  type JobApplication,
} from '../lib/api';

const COLUMNS: {
  status: ApplicationStatus;
  title: string;
  description: string;
}[] = [
  {
    status: 'APPLIED',
    title: 'Applied',
    description: 'Applications submitted and waiting for response.',
  },
  {
    status: 'INTERVIEW',
    title: 'Interview',
    description: 'Applications currently in interview process.',
  },
  {
    status: 'OFFER',
    title: 'Offer',
    description: 'Offers received or final-stage opportunities.',
  },
  {
    status: 'REJECTED',
    title: 'Rejected',
    description: 'Closed applications that did not move forward.',
  },
  {
    status: 'WITHDRAWN',
    title: 'Withdrawn',
    description: 'Applications you decided to withdraw.',
  },
];

export default function PipelinePage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);

    try {
      const data = await listApplications();
      setApplications(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const result: Record<ApplicationStatus, JobApplication[]> = {
      APPLIED: [],
      INTERVIEW: [],
      OFFER: [],
      REJECTED: [],
      WITHDRAWN: [],
    };

    for (const app of applications) {
      result[app.status].push(app);
    }

    return result;
  }, [applications]);

  async function moveApplication(id: string, status: ApplicationStatus) {
    setUpdatingId(id);
    setError(null);

    try {
      await updateApplication(id, { status });
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to update application');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="page">
      <div className="badge">Board View</div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h1 style={{ fontSize: 42, margin: '12px 0 6px' }}>
          Application Board View
          </h1>
          <p className="muted" style={{ maxWidth: 800 }}>
          Visualize and manage your job applications by moving them across each status stage.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={load} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Board'}
        </button>
      </div>

      {error && <p className="error">❌ {error}</p>}

      {loading ? (
        <p className="muted">Loading pipeline...</p>
      ) : (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
            gap: 14,
            marginTop: 24,
            overflowX: 'auto',
            paddingBottom: 10,
          }}
        >
          {COLUMNS.map((column) => (
            <PipelineColumn
              key={column.status}
              title={column.title}
              description={column.description}
              status={column.status}
              items={grouped[column.status]}
              updatingId={updatingId}
              onMove={moveApplication}
            />
          ))}
        </section>
      )}
    </main>
  );
}

function PipelineColumn({
  title,
  description,
  status,
  items,
  updatingId,
  onMove,
}: {
  title: string;
  description: string;
  status: ApplicationStatus;
  items: JobApplication[];
  updatingId: string | null;
  onMove: (id: string, status: ApplicationStatus) => void;
}) {
  return (
    <div
      className="card"
      style={{
        padding: 14,
        minHeight: 520,
        background: '#fbfcff',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 10,
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>
            {description}
          </p>
        </div>

        <span className="badge">{items.length}</span>
      </div>

      <div className="grid" style={{ marginTop: 14 }}>
        {items.length === 0 ? (
          <div
            style={{
              border: '1px dashed #d9deea',
              borderRadius: 14,
              padding: 16,
              color: '#667085',
              background: 'white',
            }}
          >
            No applications
          </div>
        ) : (
          items.map((app) => (
            <PipelineCard
              key={app.id}
              app={app}
              currentStatus={status}
              updatingId={updatingId}
              onMove={onMove}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PipelineCard({
  app,
  currentStatus,
  updatingId,
  onMove,
}: {
  app: JobApplication;
  currentStatus: ApplicationStatus;
  updatingId: string | null;
  onMove: (id: string, status: ApplicationStatus) => void;
}) {
  const possibleMoves = COLUMNS.filter((c) => c.status !== currentStatus);

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e6e9f0',
        borderRadius: 16,
        padding: 14,
        boxShadow: '0 8px 20px rgba(23,32,51,0.05)',
      }}
    >
      <div className="badge">{app.status}</div>

      <h3 style={{ margin: '10px 0 4px', fontSize: 18 }}>
        {app.company}
      </h3>

      <div className="muted" style={{ fontSize: 14 }}>
        {app.role}
      </div>

      {app.location && (
        <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
          {app.location}
        </div>
      )}

      {app.followUpDate && (
        <div
          style={{
            marginTop: 10,
            padding: 8,
            borderRadius: 10,
            background: '#fff7ed',
            color: '#9a3412',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Follow up: {app.followUpDate.slice(0, 10)}
        </div>
      )}

      {app.notes && (
        <p
          className="muted"
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            marginTop: 10,
          }}
        >
          {app.notes.length > 120 ? `${app.notes.slice(0, 120)}...` : app.notes}
        </p>
      )}

      <div style={{ marginTop: 12 }}>
        <label className="muted" style={{ fontSize: 13 }}>
          Move to
        </label>

        <select
          className="select"
          value=""
          disabled={updatingId === app.id}
          onChange={(e) => {
            if (e.target.value) {
              onMove(app.id, e.target.value as ApplicationStatus);
            }
          }}
        >
          <option value="">
            {updatingId === app.id ? 'Updating...' : 'Choose status'}
          </option>

          {possibleMoves.map((move) => (
            <option key={move.status} value={move.status}>
              {move.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}