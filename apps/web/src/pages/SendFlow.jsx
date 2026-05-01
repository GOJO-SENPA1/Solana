import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import ProgressStepper from '../components/ProgressStepper'
import SolanaLogo from '../components/SolanaLogo'

const statusStages = ['Signing transaction...', 'Broadcasting...', 'Locking in escrow...', 'Confirmed ✓']

function AmountStep() {
  const navigate = useNavigate()
  const [currency, setCurrency] = useState('USD')
  const [showFees, setShowFees] = useState(false)

  return (
    <Card style={{ maxWidth: 480, margin: '0 auto' }}>
      <ProgressStepper steps={['Amount', 'Recipient', 'Confirm']} currentStep={1} />
      <div style={{ display: 'grid', justifyItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 48, fontWeight: 700 }}>$</span>
          <input
            placeholder="0.00"
            className="focusable"
            style={{
              border: 'none',
              background: 'transparent',
              textAlign: 'center',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 48,
              color: 'var(--on-surface)',
              width: 220,
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['USD', 'USDC', 'SOL'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCurrency(item)}
              style={{
                borderRadius: 9999,
                border: '1px solid var(--primary)',
                padding: '8px 14px',
                background: currency === item ? 'rgba(124,58,237,0.25)' : 'transparent',
                color: 'var(--primary-light)',
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="mono-label" style={{ color: 'var(--green)' }}>= 0.412 SOL · NPR 26,840 at recipient</p>
      </div>
      <div style={{ marginTop: 20 }}>
        <button
          type="button"
          onClick={() => setShowFees((value) => !value)}
          style={{ border: 'none', background: 'transparent', color: 'var(--outline)', padding: 0 }}
          className="mono-label"
        >
          Show fee breakdown {showFees ? '↑' : '↓'}
        </button>
        {showFees ? (
          <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
            <FeeRow label="Network fee" value="$0.0008" />
            <FeeRow label="Off-ramp" value="0.50%" />
            <FeeRow label="FX rate" value="1 USD = 134.2 NPR" />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mono-data">Pyth oracle</span>
              <span
                className="mono-label"
                style={{ border: '1px solid var(--green)', color: 'var(--green)', padding: '2px 8px' }}
              >
                Live
              </span>
            </div>
          </div>
        ) : null}
      </div>
      <div className="hr" style={{ margin: '20px 0' }} />
      <Button fullWidth onClick={() => navigate('/send?step=recipient')}>
        Set Amount →
      </Button>
    </Card>
  )
}

function RecipientStep() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')
  const [showWallet, setShowWallet] = useState(false)
  const [wallet, setWallet] = useState('')
  const [showLinkCard, setShowLinkCard] = useState(false)

  return (
    <Card style={{ maxWidth: 480, margin: '0 auto' }}>
      <ProgressStepper steps={['Amount', 'Recipient', 'Confirm']} currentStep={2} />
      <Input
        label="Recipient phone or email"
        leftSlot="🇳🇵 +977"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="98XXXXXXXX"
      />
      <button
        type="button"
        onClick={() => setShowWallet((current) => !current)}
        className="mono-label"
        style={{
          marginTop: 12,
          border: 'none',
          background: 'transparent',
          color: 'var(--primary-light)',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        Or paste wallet address
      </button>
      {showWallet ? (
        <div style={{ marginTop: 12 }}>
          <Input
            label="Wallet address"
            value={wallet}
            onChange={(event) => setWallet(event.target.value)}
            helperText="Use recipient's Solana address; long addresses will truncate in shared link."
            data-mono
          />
        </div>
      ) : null}

      <div style={{ marginTop: 16 }}>
        <Button fullWidth onClick={() => setShowLinkCard(true)}>
          Generate Link →
        </Button>
      </div>
      {showLinkCard ? (
        <Card style={{ marginTop: 16, background: 'var(--surface-low)' }}>
          <div style={{ display: 'grid', gap: 12 }}>
            <span className="mono-label muted">Claim link</span>
            <p className="mono-data">chainremit.app/claim/xK9mP...</p>
            <div
              style={{
                width: 120,
                height: 120,
                border: '1px solid var(--outline-dim)',
                background: 'var(--surface-high)',
                display: 'grid',
                placeItems: 'center',
              }}
              className="mono-label muted"
            >
              QR
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="ghost" fullWidth>
                Copy Link
              </Button>
              <Button
                variant="ghost"
                fullWidth
                style={{ borderColor: 'var(--green)', color: 'var(--green)' }}
              >
                Share via WhatsApp
              </Button>
            </div>
            <p className="body-md muted">
              Recipient logs in with their phone. No crypto wallet needed.
            </p>
          </div>
        </Card>
      ) : null}
      <div style={{ marginTop: 16 }}>
        <Button fullWidth onClick={() => navigate('/send/confirm')}>
          Lock Funds →
        </Button>
      </div>
    </Card>
  )
}

function ConfirmStep() {
  const navigate = useNavigate()
  const [statusIndex, setStatusIndex] = useState(0)

  useEffect(() => {
    const timers = [1, 2, 3].map((value) =>
      window.setTimeout(() => setStatusIndex(value), value * 800),
    )

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    if (statusIndex === statusStages.length - 1) {
      const doneTimer = window.setTimeout(() => navigate('/send/done'), 700)
      return () => window.clearTimeout(doneTimer)
    }
    return undefined
  }, [navigate, statusIndex])

  const isConfirmed = statusIndex === statusStages.length - 1

  return (
    <Card style={{ maxWidth: 480, margin: '0 auto' }}>
      <ProgressStepper steps={['Amount', 'Recipient', 'Confirm']} currentStep={3} />
      <Card style={{ width: '100%', background: 'var(--surface-low)' }}>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
          <div style={{ animation: 'pulse 1.4s ease infinite' }}>
            <SolanaLogo size={40} color="var(--primary)" />
          </div>
          <p className="mono-data">{statusStages[statusIndex]}</p>
        </div>
      </Card>

      {isConfirmed ? (
        <Card style={{ marginTop: 16, background: 'var(--surface-low)' }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <DetailRow label="Escrow PDA" value="7xKp...mN3q" />
            <DetailRow label="Amount locked" value="200 USDC" />
            <DetailRow label="FX rate (Pyth)" value="1 USD = 134.2 NPR" />
            <DetailRow label="Recipient gets" value="≈ NPR 26,840" />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mono-label muted">Solana TX</span>
              <a href="#" className="mono-data" style={{ color: 'var(--primary-light)' }}>
                Explorer <span className="link-icon">↗</span>
              </a>
            </div>
          </div>
        </Card>
      ) : null}
      <p className="body-md muted" style={{ marginTop: 16 }}>
        Funds are locked on-chain. Only your recipient can release them.
      </p>
      {isConfirmed ? (
        <div style={{ marginTop: 16 }}>
          <Link to="/send">
            <Button variant="ghost" fullWidth>
              Send Another Transfer
            </Button>
          </Link>
        </div>
      ) : null}
    </Card>
  )
}

function FeeRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className="mono-data">{label}</span>
      <span className="mono-data">{value}</span>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className="mono-label muted">{label}</span>
      <span className="mono-data">{value}</span>
    </div>
  )
}

function SendFlow({ step = 1 }) {
  const [searchParams] = useSearchParams()
  const parsedStep = useMemo(
    () => (searchParams.get('step') === 'recipient' ? 2 : step),
    [searchParams, step],
  )

  if (parsedStep === 2) return <RecipientStep />
  if (parsedStep === 3) return <ConfirmStep />
  return <AmountStep />
}

export default SendFlow
