import { Outlet, useLocation } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

function Layout() {
  const { pathname } = useLocation()
  const { activeRole, setActiveRole } = useRole()
  const showHeader = pathname.startsWith('/claim') || pathname.startsWith('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="screen" style={{ paddingTop: showHeader ? 32 : 56 }}>
        {showHeader ? (
          <header style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 600 }}>
              ChainRemit
            </p>
            <p className="muted mono-label" style={{ marginTop: 4 }}>
              ∅ → ∞
            </p>
          </header>
        ) : null}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--surface-low)',
              border: '1px solid var(--outline-dim)',
              borderRadius: 9999,
              padding: 4,
              gap: 4,
            }}
          >
            {['sender', 'receiver'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className="mono-label"
                style={{
                  border: 'none',
                  borderRadius: 9999,
                  padding: '8px 14px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  color: activeRole === role ? 'var(--on-surface)' : 'var(--on-surface-muted)',
                  background: activeRole === role ? 'var(--primary)' : 'transparent',
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
