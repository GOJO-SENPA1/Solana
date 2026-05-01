import crypto from 'node:crypto'

export type Asset = 'USDC' | 'SOL'
export type RemittanceStatus = 'CREATED' | 'CLAIMED' | 'CANCELLED'

export type Remittance = {
  id: string
  createdAtMs: number
  amount: string
  asset: Asset
  payoutCurrency: string
  payoutMethod: 'STABLECOIN' | 'MOBILE_MONEY' | 'BANK'
  recipientHint?: string
  status: RemittanceStatus
  claimToken: string
  claimedAtMs?: number
  cancelledAtMs?: number
  fx?: {
    pair: string
    rate: number
    provider: 'PYTH_MOCK'
    asOfMs: number
  }
}

function randomId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`
}

function randomToken() {
  return crypto.randomBytes(24).toString('base64url')
}

export class RemittanceStore {
  private remittances = new Map<string, Remittance>()
  private claimTokenToId = new Map<string, string>()

  create(input: Omit<Remittance, 'id' | 'createdAtMs' | 'status' | 'claimToken'>): Remittance {
    const id = randomId('rem')
    const claimToken = randomToken()
    const rem: Remittance = {
      id,
      createdAtMs: Date.now(),
      status: 'CREATED',
      claimToken,
      ...input,
    }
    this.remittances.set(id, rem)
    this.claimTokenToId.set(claimToken, id)
    return rem
  }

  get(id: string) {
    return this.remittances.get(id) ?? null
  }

  getByClaimToken(token: string) {
    const id = this.claimTokenToId.get(token)
    if (!id) return null
    return this.get(id)
  }

  cancel(id: string) {
    const rem = this.get(id)
    if (!rem) return null
    if (rem.status !== 'CREATED') return rem
    rem.status = 'CANCELLED'
    rem.cancelledAtMs = Date.now()
    return rem
  }

  claim(token: string) {
    const rem = this.getByClaimToken(token)
    if (!rem) return null
    if (rem.status !== 'CREATED') return rem
    rem.status = 'CLAIMED'
    rem.claimedAtMs = Date.now()
    return rem
  }
}

