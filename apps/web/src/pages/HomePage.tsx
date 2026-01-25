export default function HomePage() {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
        <h1>CareerFlow</h1>
        <p>
          CareerFlow is a full-stack app (React + NestJS + Prisma + Postgres) to track job applications and career
          progress.
        </p>
  
        <h2>What’s working right now</h2>
        <ul>
          <li>Users API + DB persistence</li>
          <li>Swagger docs at <code>/docs</code></li>
          <li>Health endpoint at <code>/health</code></li>
        </ul>
  
        <p style={{ marginTop: 16 }}>
          Use the navigation bar to open the Users page.
        </p>
      </div>
    );
  }