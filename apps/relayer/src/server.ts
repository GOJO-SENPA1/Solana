import express from 'express'
import cors from 'cors'
import { RemittanceStore } from './store.js'
import { ClaimSchema, CreateRemittanceSchema } from './validation.js'

const PORT = Number(process.env.PORT ?? 8787)
const app = express()
const store = new RemittanceStore()

app.use(cors({ origin: true }))
app.use(express.json({ limit: '256kb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// Mock FX quote (replace with Pyth later)
function mockFx(pair: string) {
  // deterministic-ish for demos: small variation based on current minute
  const minute = Math.floor(Date.now() / 60000)
  const wobble = (minute % 7) * 0.002
  const base = pair === 'SOL/USD' ? 150 : 1
  const rate = Number((base * (1 + wobble)).toFixed(6))
  return { pair, rate, provider: 'PYTH_MOCK' as const, asOfMs: Date.now() }
}

app.post('/api/remittances', (req, res) => {
  const parsed = CreateRemittanceSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const fx = mockFx(parsed.data.asset === 'SOL' ? 'SOL/USD' : 'USDC/USD')
  const rem = store.create({
    amount: parsed.data.amount,
    asset: parsed.data.asset,
    payoutCurrency: parsed.data.payoutCurrency,
    payoutMethod: parsed.data.payoutMethod,
    recipientHint: parsed.data.recipientHint,
    fx,
  })

  const origin = `${req.protocol}://${req.get('host')}`
  res.json({
    remittance: sanitize(rem),
    claimUrl: `${origin}/claim#${rem.claimToken}`,
  })
})

app.get('/api/remittances/:id', (req, res) => {
  const rem = store.get(req.params.id)
  if (!rem) return res.status(404).json({ error: 'not_found' })
  res.json({ remittance: sanitize(rem) })
})

app.post('/api/remittances/:id/cancel', (req, res) => {
  const rem = store.cancel(req.params.id)
  if (!rem) return res.status(404).json({ error: 'not_found' })
  res.json({ remittance: sanitize(rem) })
})

app.post('/api/claim', (req, res) => {
  const parsed = ClaimSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const rem = store.claim(parsed.data.token)
  if (!rem) return res.status(404).json({ error: 'not_found' })

  res.json({
    remittance: sanitize(rem),
    // For the hackathon demo: what would happen next in real flow
    next: rem.payoutMethod === 'STABLECOIN' ? 'SEND_STABLECOIN' : 'OFFRAMP_FIAT',
  })
})

function sanitize(rem: any) {
  // never return token via normal status endpoints
  const { claimToken, ...rest } = rem
  return rest
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`relayer listening on http://localhost:${PORT}`)
})

