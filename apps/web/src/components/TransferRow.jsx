import { useState } from 'react'
import Card from './Card'
import StatusPill from './StatusPill'

function TransferRow({ transfer, view = 'sent' }) {
  const [expanded, setExpanded] = useState(false)
  const actorLabel = view === 'sent' ? 'Recipient' : 'Sender'
  const actorName = view === 'sent' ? transfer.recipient : transfer.counterparty
  const contextLine =
    view === 'sent'
      ? `You sent ${transfer.amountUSDC} USDC to ${actorName}`
      : `${actorName} sent you ${transfer.amountUSDC} USDC`

  return (
    <div style={{ borderBottom: '1px solid var(--outline-dim)' }}>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          padding: '16px 0',
          textAlign: 'left',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: 16,
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'grid', gap: 4 }}>
          <span>
            {transfer.recipientFlag} {actorName}
          </span>
          <span className="mono-label muted">{transfer.phone}</span>
          <span className="mono-label" style={{ color: 'var(--primary-light)' }}>
            {contextLine}
          </span>
        </div>
        <div style={{ display: 'grid', gap: 4 }}>
          <span className="mono-data">
            {view === 'sent' ? '-' : '+'}
            {transfer.amountUSDC} USDC
          </span>
          <span className="mono-label" style={{ color: 'var(--green)' }}>
            → NPR {transfer.amountNPR.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'grid', justifyItems: 'end', gap: 6 }}>
          <StatusPill status={transfer.status} />
          <span className="mono-label muted">{transfer.date}</span>
        </div>
      </button>
      {expanded ? (
        <Card style={{ marginBottom: 16, background: 'var(--surface-low)' }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mono-label muted">{actorLabel}</span>
              <span className="mono-data">{actorName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mono-label muted">Escrow PDA</span>
              <span className="mono-data">{transfer.escrowPDA}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mono-label muted">Pyth rate</span>
              <span className="mono-data">1 USD = {transfer.pythRate} NPR</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mono-label muted">Timestamp</span>
              <span className="mono-data">{transfer.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mono-label muted">Claim status</span>
              <span className="mono-data" style={{ textTransform: 'capitalize' }}>
                {transfer.claimStatus}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mono-label muted">Settled at</span>
              <span className="mono-data">{transfer.settledAt}</span>
            </div>
            <a href="#" className="mono-label" style={{ color: 'var(--primary-light)' }}>
              View on Solana Explorer <span className="link-icon">↗</span>
            </a>
          </div>
        </Card>
      ) : null}
    </div>
  )
}

export default TransferRow
