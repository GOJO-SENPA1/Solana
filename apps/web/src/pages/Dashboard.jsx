import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import TransferRow from '../components/TransferRow'
import { useRole } from '../context/RoleContext'
import { mockProfiles } from '../data/mockProfiles'
import { mockTransfers } from '../data/mockTransfers'

function Dashboard() {
  const { activeRole } = useRole()
  const [searchParams] = useSearchParams()
  const [sectionTab, setSectionTab] = useState('history')
  const [historyTab, setHistoryTab] = useState(activeRole === 'sender' ? 'sent' : 'received')
  const defaultTabFromRole = activeRole === 'sender' ? 'sent' : 'received'

  useEffect(() => {
    const view = searchParams.get('view')
    if (view === 'sent' || view === 'received') {
      setHistoryTab(view)
      return
    }
    setHistoryTab(defaultTabFromRole)
  }, [defaultTabFromRole, searchParams])

  const transfers = useMemo(
    () => mockTransfers.filter((transfer) => transfer.direction === historyTab),
    [historyTab],
  )
  const profile = mockProfiles[activeRole]
  const totalSent = useMemo(
    () => mockTransfers.filter((transfer) => transfer.direction === 'sent').length,
    [],
  )
  const totalReceived = useMemo(
    () => mockTransfers.filter((transfer) => transfer.direction === 'received').length,
    [],
  )
  const roleTransfers = useMemo(
    () => mockTransfers.filter((transfer) => transfer.direction === defaultTabFromRole),
    [defaultTabFromRole],
  )
  const roleVolume = useMemo(
    () => roleTransfers.reduce((sum, transfer) => sum + transfer.amountUSDC, 0),
    [roleTransfers],
  )

  return (
    <section style={{ display: 'grid', gap: 24 }}>
      <Card style={{ background: 'var(--surface-low)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <p className="mono-label muted">Active role dashboard</p>
            <h3 style={{ textTransform: 'capitalize' }}>{activeRole}</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="mono-label muted">Role transfer volume</p>
            <p className="mono-data">{roleVolume} USDC</p>
          </div>
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['history', 'profile'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSectionTab(item)}
            className="mono-label"
            style={{
              borderRadius: 9999,
              border: '1px solid var(--primary)',
              padding: '8px 16px',
              background: sectionTab === item ? 'rgba(124,58,237,0.35)' : 'transparent',
              color: 'var(--primary-light)',
              textTransform: 'capitalize',
              cursor: 'pointer',
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {sectionTab === 'history' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card>
              <p className="mono-label muted">Total sent</p>
              <h2 style={{ marginTop: 8 }}>$1,240 USDC</h2>
              <p className="mono-label muted" style={{ marginTop: 8 }}>
                {totalSent} transfers
              </p>
            </Card>
            <Card style={{ border: '1px solid var(--green)' }}>
              <p className="mono-label muted">Total received</p>
              <h2 style={{ marginTop: 8, color: 'var(--green)' }}>NPR 56,364</h2>
              <p className="mono-label muted" style={{ marginTop: 8 }}>
                {totalReceived} transfers
              </p>
            </Card>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['sent', 'received'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setHistoryTab(item)}
                className="mono-label"
                style={{
                  borderRadius: 9999,
                  border: '1px solid var(--primary)',
                  padding: '8px 16px',
                  background: historyTab === item ? 'rgba(124,58,237,0.35)' : 'transparent',
                  color: 'var(--primary-light)',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                }}
              >
                {item}
              </button>
            ))}
          </div>
          {transfers.length > 0 ? (
            <div>
              {transfers.map((transfer) => (
                <TransferRow key={transfer.id} transfer={transfer} view={historyTab} />
              ))}
            </div>
          ) : (
            <Card style={{ display: 'grid', justifyItems: 'center', gap: 12, textAlign: 'center' }}>
              <span className="muted" style={{ fontSize: 28 }}>
                ⟲
              </span>
              <h3>No {historyTab} transfers yet</h3>
              <Link to="/send">
                <Button>Send Your First Transfer</Button>
              </Link>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <div style={{ display: 'grid', gap: 16 }}>
            <h3>Profile</h3>
            <Detail label="Username" value={profile.username} />
            <Detail label="Full name" value={profile.fullName} />
            <Detail label="Location" value={profile.location} />
            <Detail label="Language" value={profile.language} />
            <Detail label="Settlement preference" value={profile.settlementPreference} />
            <Detail label="Preferred asset" value={profile.preferredAsset} />
            <Detail label="Payout default" value={profile.payoutDefault} />
            <Detail label="Notifications" value={profile.notifications} />
            <div className="hr" />
            <h3>Settings</h3>
            <Detail label="Role mode" value={activeRole} />
            <Detail label="KYC status" value={profile.securityTier} />
            <Detail label="2FA" value="otp enabled" />
            <Detail label="Role transfers" value={`${roleTransfers.length}`} />
          </div>
        </Card>
      )}
    </section>
  )
}

function Detail({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className="mono-label muted">{label}</span>
      <span className="mono-data" style={{ textTransform: 'capitalize' }}>
        {value}
      </span>
    </div>
  )
}

export default Dashboard
