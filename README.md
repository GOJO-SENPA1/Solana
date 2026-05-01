# ChainRemit (Solona) — Hackathon MVP

Permissionless remittance rails for Nepal/South Asia on Solana:

- **Sender UI**: pay in SOL/USDC, get a claim link
- **Escrow (Anchor program)**: hold funds until recipient claims or sender cancels
- **Relayer + event listener**: watches escrow state and coordinates off-chain steps
- **Receiver UI**: mobile-first, Privy login, claim funds
- **Oracle**: Pyth for FX quoting (SOL/USD + local fiat proxy)
- **Off-ramp**: MoonPay (stubbed in MVP; wire to sponsor APIs later)

## Repo layout

- `apps/web`: Vite + React (sender + receiver flows)
- `apps/relayer`: Express API (claim links, mocked escrow, later on-chain integration)
- `programs/escrow`: Anchor program source (added next)

## Quick start (UI + API)

```bash
npm install
npm run dev
```

- Web: `http://localhost:5173`
- Relayer: `http://localhost:8787`

## Solana/Anchor setup (needed to deploy on-chain)

This machine currently doesn’t have Solana/Anchor/Rust installed. When you’re ready:

1. Install Rust (`rustup`)
2. Install Solana CLI
3. Install Anchor
4. Build + deploy the program in `programs/escrow`

Once installed, we’ll wire `apps/relayer` to:
- create escrow accounts
- verify deposits
- release funds on recipient claim

