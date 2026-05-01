import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import SolanaLogo from '../components/SolanaLogo'
import { useRole } from '../context/RoleContext'

function LandingPage() {
  const { activeRole } = useRole()

  return (
    <section style={{ display: 'grid', gap: 32 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'grid', gap: 24 }}>
          <span
            className="mono-label"
            style={{
              display: 'inline-flex',
              width: 'fit-content',
              color: 'var(--green)',
              border: '1px solid var(--outline-dim)',
              borderRadius: 9999,
              padding: '6px 12px',
            }}
          >
            Built on Solana · Devnet
          </span>
          <h1>
            Send money home.
            <br />
            Not fees.
          </h1>
          <p className="body-lg muted" style={{ maxWidth: 560 }}>
            Transfer SOL or USDC to Nepal in seconds. Recipients cash out in NPR. No banks. No 7%
            cut.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/send">
              <Button>Send Money</Button>
            </Link>
            <Link to="/claim/demo">
              <Button variant="ghost">Receive a Transfer</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost">Open Dashboard</Button>
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { value: '< $0.01', label: 'per transfer' },
              { value: '~0.4s', label: 'finality' },
              { value: '$8B+', label: 'market size' },
            ].map((item) => (
              <div key={item.label}>
                <p className="mono-data">{item.value}</p>
                <p className="mono-label muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <div style={{ display: 'grid', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🇺🇸 You</span>
              <span className="mono-data">$200 USDC</span>
            </div>
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div className="hr" />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <span
                  style={{
                    background: 'var(--surface)',
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <SolanaLogo size={18} />
                  <span
                    className="mono-label"
                    style={{
                      color: 'var(--green)',
                      borderRadius: 9999,
                      border: '1px solid var(--green)',
                      padding: '4px 10px',
                    }}
                  >
                    &lt; $0.01 fee
                  </span>
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🇳🇵 Ama</span>
              <span className="mono-data">NPR 26,800</span>
            </div>
            <span
              style={{
                background: '#052916',
                color: '#14f195',
                border: '1px solid #14f195',
                borderRadius: 9999,
                padding: '4px 12px',
                width: 'fit-content',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
              }}
            >
              Confirmed in 0.4s ✓
            </span>
          </div>
        </Card>
      </div>

      <Card style={{ background: 'var(--surface-low)' }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <p className="mono-label muted">Role based quick actions</p>
          <p className="body-md">
            {activeRole === 'sender'
              ? 'Sender mode focuses on transfer setup, claim-link sharing, and fee transparency.'
              : 'Receiver mode focuses on phone login, payout claiming, and status visibility.'}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 12,
            }}
          >
            <ValueCard title="Instant Finality" value="~0.4s" />
            <ValueCard title="Median Fee" value="< $0.01" />
            <ValueCard title="On-chain Security" value="Escrow Locked" />
          </div>
        </div>
      </Card>
    </section>
  )
}

function ValueCard({ title, value }) {
  return (
    <div
      style={{
        border: '1px solid var(--outline-dim)',
        background: 'var(--surface)',
        borderRadius: 12,
        padding: 16,
      }}
    >
      <p className="mono-label muted">{title}</p>
      <p className="mono-data" style={{ marginTop: 8 }}>
        {value}
      </p>
    </div>
  )
}

export default LandingPage
