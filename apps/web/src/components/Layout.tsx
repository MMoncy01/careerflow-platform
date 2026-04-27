import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Layout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const navLink = ({ isActive }: { isActive: boolean }) => ({
    padding: '10px 14px',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 800,
    color: isActive ? '#ffffff' : '#344054',
    background: isActive ? '#111827' : 'transparent',
  });

  async function onLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid #e6e9f0',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            flexWrap: 'wrap',
          }}
        >
          <NavLink
            to="/"
            style={{
              fontWeight: 950,
              fontSize: 21,
              textDecoration: 'none',
              color: '#111827',
            }}
          >
            CareerFlow
          </NavLink>

          <nav style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <NavLink to="/" style={navLink} end>
              Home
            </NavLink>

            {user && (
              <>
                <NavLink to="/dashboard" style={navLink}>
                  Dashboard
                </NavLink>
                <NavLink to="/applications" style={navLink}>
                  Applications
                </NavLink>
                <NavLink to="/interviews" style={navLink}>
                  Interviews
                </NavLink>
                <NavLink to="/ai-assistant" style={navLink}>
                  AI Assistant
                </NavLink>
              </>
            )}
          </nav>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            {!loading && user ? (
              <>
                <span className="muted">{user.email}</span>
                <button className="btn btn-secondary" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : !loading ? (
              <>
                <NavLink className="btn btn-secondary" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-primary" to="/register">
                  Register
                </NavLink>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}