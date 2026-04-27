import { useState } from 'react';
import { analyzeJobDescription, type AiJobAnalysis } from '../lib/api';

type TabKey =
  | 'overview'
  | 'resume'
  | 'outreach'
  | 'interview'
  | 'projects';

export default function AiAssistantPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AiJobAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setError(null);
    setResult(null);
    setCopied(null);

    if (jobDescription.trim().length < 50) {
      setError('Paste a job description with at least 50 characters.');
      return;
    }

    setLoading(true);

    try {
      const data = await analyzeJobDescription(jobDescription.trim());
      setResult(data);
      setActiveTab('overview');
    } catch (err: any) {
      setError(err?.message ?? 'AI analysis failed');
    } finally {
      setLoading(false);
    }
  }

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  }

  function copyList(label: string, items: string[]) {
    return copyText(label, items.map((item) => `- ${item}`).join('\n'));
  }

  return (
    <main className="page">
      <div className="badge">AI Career Assistant</div>

      <h1 style={{ fontSize: 42, margin: '12px 0 6px' }}>
        Job Description Analyzer
      </h1>

      <p className="muted" style={{ maxWidth: 850 }}>
        Paste a job description and generate ATS keywords, resume tailoring tips,
        recruiter messages, follow-up emails, interview questions, and portfolio talking points.
      </p>

      <section
        className="card"
        style={{
          padding: 22,
          marginTop: 20,
          display: 'grid',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0 }}>Paste Job Description</h2>
            <p className="muted" style={{ marginBottom: 0 }}>
              Use the full job posting for better resume and interview suggestions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={analyze} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Job'}
            </button>

            <button
              className="btn btn-secondary"
              disabled={loading}
              onClick={() => {
                setJobDescription('');
                setResult(null);
                setError(null);
                setCopied(null);
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          className="textarea"
          style={{ minHeight: 230 }}
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {error && <p className="error">❌ {error}</p>}
        {copied && <p className="success">✅ Copied {copied}</p>}
      </section>

      {result && (
        <section style={{ marginTop: 24 }}>
          <div
            className="card"
            style={{
              padding: 12,
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 16,
            }}
          >
            <TabButton label="Overview" value="overview" active={activeTab} onClick={setActiveTab} />
            <TabButton label="Resume Tips" value="resume" active={activeTab} onClick={setActiveTab} />
            <TabButton label="Outreach" value="outreach" active={activeTab} onClick={setActiveTab} />
            <TabButton label="Interview Prep" value="interview" active={activeTab} onClick={setActiveTab} />
            <TabButton label="Project Talking Points" value="projects" active={activeTab} onClick={setActiveTab} />
          </div>

          {activeTab === 'overview' && (
            <div className="grid">
              <AiCard title="Job Summary">
                <p style={{ lineHeight: 1.7 }}>{result.summary}</p>
              </AiCard>

              <AiCard
                title="ATS Keywords"
                action={
                  <button className="btn btn-secondary" onClick={() => copyList('ATS keywords', result.atsKeywords)}>
                    Copy Keywords
                  </button>
                }
              >
                <TagList items={result.atsKeywords} />
              </AiCard>

              <AiCard title="Key Skills">
                <TagList items={result.keySkills} />
              </AiCard>

              <AiCard title="Tools & Technologies">
                <TagList items={result.toolsAndTechnologies} />
              </AiCard>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="grid">
              <AiCard
                title="Resume Tailoring Tips"
                action={
                  <button className="btn btn-secondary" onClick={() => copyList('resume tips', result.resumeTips)}>
                    Copy Tips
                  </button>
                }
              >
                <BulletList items={result.resumeTips} />
              </AiCard>

              <AiCard title="Possible Skill Gaps">
                <BulletList items={result.skillGaps} />
              </AiCard>

              <AiCard title="Responsibilities to Mirror in Resume">
                <BulletList items={result.responsibilities} />
              </AiCard>

              <AiCard title="Qualifications to Highlight">
                <BulletList items={result.qualifications} />
              </AiCard>
            </div>
          )}

          {activeTab === 'outreach' && (
            <div className="grid">
              <AiCard
                title="Follow-Up Email Draft"
                action={
                  <button
                    className="btn btn-secondary"
                    onClick={() => copyText('follow-up email', result.followUpEmail)}
                  >
                    Copy Email
                  </button>
                }
              >
                <PreText text={result.followUpEmail} />
              </AiCard>

              <AiCard
                title="Recruiter / Referral Message"
                action={
                  <button
                    className="btn btn-secondary"
                    onClick={() => copyText('recruiter message', result.recruiterMessage)}
                  >
                    Copy Message
                  </button>
                }
              >
                <PreText text={result.recruiterMessage} />
              </AiCard>
            </div>
          )}

          {activeTab === 'interview' && (
            <div className="grid">
              <AiCard
                title="Likely Interview Questions"
                action={
                  <button
                    className="btn btn-secondary"
                    onClick={() => copyList('interview questions', result.interviewQuestions)}
                  >
                    Copy Questions
                  </button>
                }
              >
                <BulletList items={result.interviewQuestions} />
              </AiCard>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid">
              <AiCard
                title="Portfolio / Project Talking Points"
                action={
                  <button
                    className="btn btn-secondary"
                    onClick={() => copyList('project talking points', result.projectTalkingPoints)}
                  >
                    Copy Talking Points
                  </button>
                }
              >
                <BulletList items={result.projectTalkingPoints} />
              </AiCard>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function TabButton({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: TabKey;
  active: TabKey;
  onClick: (value: TabKey) => void;
}) {
  const isActive = active === value;

  return (
    <button
      className={isActive ? 'btn btn-primary' : 'btn btn-secondary'}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
}

function AiCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'center',
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map((item, index) => (
        <span className="badge" key={index}>
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ marginTop: 0, lineHeight: 1.8 }}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function PreText({ text }: { text: string }) {
  return (
    <pre
      style={{
        whiteSpace: 'pre-wrap',
        margin: 0,
        background: '#f5f7fb',
        padding: 14,
        borderRadius: 14,
        lineHeight: 1.6,
      }}
    >
      {text}
    </pre>
  );
}