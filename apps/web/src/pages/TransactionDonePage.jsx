import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import SolanaLogo from '../components/SolanaLogo'
import StatusPill from '../components/StatusPill'
import { useRole } from '../context/RoleContext'

function TransactionDonePage() {
  const { activeRole, isSender } = useRole()

  return (
    <section style={{ maxWidth: 560, margin: '0 auto', display: 'grid', gap: 20 }}>
      <Card>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 14, textAlign: 'center' }}>
          <SolanaLogo size={44} color="var(--green)" />
          <p className="mono-label" style={{ color: 'var(--green)' }}>
            Transaction Complete
          </p>
          <h2>Funds locked and claim ready</h2>
          <p className="body-md muted">
            {isSender
              ? 'Your recipient can now claim the payout securely with their phone number.'
              : 'Your transfer status is confirmed and ready for payout tracking.'}
          </p>
          <StatusPill status="confirmed" />
        </div>
      </Card>

      <Card style={{ background: 'var(--surface-low)' }}>
        <div style={{ display: 'grid', gap: 10 }}>
          <DetailRow label="Escrow PDA" value="7xKp...mN3q" />
          <DetailRow label="Amount" value="200 USDC" />
          <DetailRow label="Recipient gets" value="≈ NPR 26,840" />
          <DetailRow label="Role context" value={activeRole} />
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 10 }}>
        <Link to="/send">
          <Button fullWidth>Send Another</Button>
        </Link>
        <Link to={isSender ? '/dashboard?view=sent' : '/dashboard?view=received'}>
          <Button variant="ghost" fullWidth>
            Go to Dashboard
          </Button>
        </Link>
        <Button variant="ghost" fullWidth style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>
          {isSender ? 'Share Claim Link' : 'Track Receipt'}
        </Button>
      </div>
    </section>
  )
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className="mono-label muted">{label}</span>
      <span className="mono-data" style={{ textTransform: 'capitalize' }}>
        {value}
      </span>
    </div>
  )
}

export default TransactionDonePage
