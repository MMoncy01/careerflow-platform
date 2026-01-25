import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>404</h1>
      <p>That page doesn’t exist.</p>
      <Link to="/" style={{ textDecoration: 'none' }}>← Back to Home</Link>
    </div>
  );
}