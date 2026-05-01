import './App.css'
import { useEffect, useState } from 'react'

type Remittance = {
  id: string
  createdAtMs: number
  amount: string
  asset: 'USDC' | 'SOL'
  payoutCurrency: string
  payoutMethod: 'STABLECOIN' | 'MOBILE_MONEY' | 'BANK'
  recipientHint?: string
  status: 'CREATED' | 'CLAIMED' | 'CANCELLED'
  claimedAtMs?: number
  cancelledAtMs?: number
  fx?: { pair: string; rate: number; provider: 'PYTH_MOCK'; asOfMs: number }
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.error ? JSON.stringify(json.error) : `HTTP ${res.status}`)
  return json as T
}

function App() {
  const [tab, setTab] = useState<'send' | 'receive'>('send')

  // Sender form
  const [amount, setAmount] = useState('25')
  const [asset, setAsset] = useState<'USDC' | 'SOL'>('USDC')
  const [payoutCurrency, setPayoutCurrency] = useState('NPR')
  const [payoutMethod, setPayoutMethod] = useState<'MOBILE_MONEY' | 'STABLECOIN' | 'BANK'>(
    'MOBILE_MONEY',
  )
  const [recipientHint, setRecipientHint] = useState('98XXXXXXXX')
  const [created, setCreated] = useState<{ remittance: Remittance; claimUrl: string } | null>(null)
  const [senderError, setSenderError] = useState<string | null>(null)
  const [loadingSend, setLoadingSend] = useState(false)

  // Receiver claim
  const [claimToken, setClaimToken] = useState('')
  const [claimed, setClaimed] = useState<{ remittance: Remittance; next: string } | null>(null)
  const [receiverError, setReceiverError] = useState<string | null>(null)
  const [loadingClaim, setLoadingClaim] = useState(false)

  useEffect(() => {
    const tokenFromHash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1).trim()
      : ''
    if (tokenFromHash) {
      setTab('receive')
      setClaimToken(tokenFromHash)
    }
  }, [])

  return (
    <div className="page">
      <header className="top">
        <div className="brand">
          <div className="logoMark" aria-hidden="true" />
          <div className="brandText">
            <div className="brandName">ChainRemit</div>
            <div className="brandTag">Biratnagar → South Asia remittance demo (mocked escrow)</div>
          </div>
        </div>
        <nav className="tabs" aria-label="Primary">
          <button
            type="button"
            className={tab === 'send' ? 'tab active' : 'tab'}
            onClick={() => setTab('send')}
          >
            Sender
          </button>
          <button
            type="button"
            className={tab === 'receive' ? 'tab active' : 'tab'}
            onClick={() => setTab('receive')}
          >
            Receiver
          </button>
        </nav>
      </header>

      <main className="main">
        {tab === 'send' ? (
          <section className="card">
            <h1>Send remittance</h1>
            <p className="muted">
              This MVP creates a remittance intent in the relayer and returns a claim link. Next step
              is wiring it to the Anchor escrow program.
            </p>

            <div className="grid">
              <label className="field">
                <span>Amount</span>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
              </label>

              <label className="field">
                <span>Asset</span>
                <select value={asset} onChange={(e) => setAsset(e.target.value as any)}>
                  <option value="USDC">USDC</option>
                  <option value="SOL">SOL</option>
                </select>
              </label>

              <label className="field">
                <span>Payout currency</span>
                <input value={payoutCurrency} onChange={(e) => setPayoutCurrency(e.target.value)} />
              </label>

              <label className="field">
                <span>Payout method</span>
                <select value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value as any)}>
                  <option value="MOBILE_MONEY">Mobile money (eSewa/Khalti)</option>
                  <option value="BANK">Bank transfer</option>
                  <option value="STABLECOIN">Stablecoin (recipient wallet)</option>
                </select>
              </label>

              <label className="field full">
                <span>Recipient hint (phone / handle)</span>
                <input value={recipientHint} onChange={(e) => setRecipientHint(e.target.value)} />
              </label>
            </div>

            <div className="actions">
              <button
                type="button"
                className="primary"
                disabled={loadingSend}
                onClick={async () => {
                  setSenderError(null)
                  setCreated(null)
                  setLoadingSend(true)
                  try {
                    const out = await api<{ remittance: Remittance; claimUrl: string }>('/api/remittances', {
                      method: 'POST',
                      body: JSON.stringify({
                        amount,
                        asset,
                        payoutCurrency,
                        payoutMethod,
                        recipientHint,
                      }),
                    })
                    setCreated(out)
                  } catch (e: any) {
                    setSenderError(e?.message ?? 'Failed to create remittance')
                  } finally {
                    setLoadingSend(false)
                  }
                }}
              >
                {loadingSend ? 'Creating…' : 'Create remittance'}
              </button>
              {created?.remittance?.id ? (
                <button
                  type="button"
                  className="ghost"
                  onClick={async () => {
                    try {
                      const out = await api<{ remittance: Remittance }>(`/api/remittances/${created.remittance.id}`)
                      setCreated((prev) => (prev ? { ...prev, remittance: out.remittance } : prev))
                    } catch {
                      // ignore
                    }
                  }}
                >
                  Refresh status
                </button>
              ) : null}
            </div>

            {senderError ? <div className="alert">{senderError}</div> : null}

            {created ? (
              <div className="result">
                <div className="row">
                  <span className="k">Remittance ID</span>
                  <span className="v">{created.remittance.id}</span>
                </div>
                <div className="row">
                  <span className="k">Status</span>
                  <span className="v pill">{created.remittance.status}</span>
                </div>
                <div className="row">
                  <span className="k">FX quote</span>
                  <span className="v">
                    {created.remittance.fx?.pair} @ {created.remittance.fx?.rate} ({created.remittance.fx?.provider})
                  </span>
                </div>
                <div className="row">
                  <span className="k">Claim link</span>
                  <span className="v mono">{created.claimUrl}</span>
                </div>
                <div className="actions">
                  <button
                    type="button"
                    className="ghost"
                    onClick={async () => {
                      await navigator.clipboard.writeText(created.claimUrl)
                    }}
                  >
                    Copy claim link
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={async () => {
                      try {
                        const out = await api<{ remittance: Remittance }>(
                          `/api/remittances/${created.remittance.id}/cancel`,
                          { method: 'POST' },
                        )
                        setCreated((prev) => (prev ? { ...prev, remittance: out.remittance } : prev))
                      } catch (e: any) {
                        setSenderError(e?.message ?? 'Cancel failed')
                      }
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="card">
            <h1>Claim remittance</h1>
            <p className="muted">
              Paste the claim token (the part after <span className="mono">#</span>) or open the
              claim link and it will autofill.
            </p>

            <label className="field full">
              <span>Claim token</span>
              <input
                value={claimToken}
                onChange={(e) => setClaimToken(e.target.value)}
                placeholder="e.g. 7Rj... (base64url)"
              />
            </label>

            <div className="actions">
              <button
                type="button"
                className="primary"
                disabled={loadingClaim}
                onClick={async () => {
                  setReceiverError(null)
                  setClaimed(null)
                  setLoadingClaim(true)
                  try {
                    const out = await api<{ remittance: Remittance; next: string }>('/api/claim', {
                      method: 'POST',
                      body: JSON.stringify({ token: claimToken }),
                    })
                    setClaimed(out)
                  } catch (e: any) {
                    setReceiverError(e?.message ?? 'Claim failed')
                  } finally {
                    setLoadingClaim(false)
                  }
                }}
              >
                {loadingClaim ? 'Claiming…' : 'Claim'}
              </button>
            </div>

            {receiverError ? <div className="alert">{receiverError}</div> : null}

            {claimed ? (
              <div className="result">
                <div className="row">
                  <span className="k">Status</span>
                  <span className="v pill">{claimed.remittance.status}</span>
                </div>
                <div className="row">
                  <span className="k">Next step</span>
                  <span className="v">{claimed.next}</span>
                </div>
                <div className="row">
                  <span className="k">Payout method</span>
                  <span className="v">{claimed.remittance.payoutMethod}</span>
                </div>
              </div>
            ) : null}
          </section>
        )}

        <aside className="side card">
          <h2>Demo checklist</h2>
          <ol className="list">
            <li>Create remittance as sender</li>
            <li>Copy claim link</li>
            <li>Switch to receiver tab</li>
            <li>Paste token and claim</li>
            <li>Show status becomes CLAIMED</li>
          </ol>
          <div className="hr" />
          <div className="muted small">
            Upcoming: Anchor escrow + Pyth real feeds + Privy + Solana Pay + MoonPay off-ramp.
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
