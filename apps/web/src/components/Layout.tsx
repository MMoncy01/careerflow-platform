import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Layout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: '8px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    color: isActive ? 'white' : '#222',
    background: isActive ? '#111' : 'transparent',
    border: '1px solid #ddd',
  });

  async function onLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <header style={{ borderBottom: '1px solid #eee', padding: 12 }}>
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <div style={{ fontWeight: 700 }}>CareerFlow</div>

          <nav style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
            <NavLink to="/" style={linkStyle} end>
              Home
            </NavLink>

            {user && (
              <>
                <NavLink to="/dashboard" style={linkStyle}>
                  Dashboard
                </NavLink>
                <NavLink to="/applications" style={linkStyle}>
                  Applications
                </NavLink>
              </>
            )}

            <NavLink to="/users" style={linkStyle}>
              Users
            </NavLink>
          </nav>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {!loading && user ? (
              <>
                <span style={{ color: '#555' }}>{user.email}</span>
                <button onClick={onLogout} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : !loading ? (
              <>
                <NavLink to="/login" style={linkStyle}>
                  Login
                </NavLink>
                <NavLink to="/register" style={linkStyle}>
                  Register
                </NavLink>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}