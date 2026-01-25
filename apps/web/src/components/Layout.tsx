import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: '8px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    color: isActive ? 'white' : '#222',
    background: isActive ? '#111' : 'transparent',
    border: '1px solid #ddd',
  });

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <header style={{ borderBottom: '1px solid #eee', padding: 12 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ fontWeight: 700 }}>CareerFlow</div>

          <nav style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
            <NavLink to="/" style={linkStyle} end>
              Home
            </NavLink>
            <NavLink to="/users" style={linkStyle}>
              Users
            </NavLink>
            <NavLink to="/applications" style={linkStyle}>
              Applications
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}