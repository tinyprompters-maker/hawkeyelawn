# 🦅 HawkeyeLawn.com

> **Lawn care at Iowa Speed.** On-demand mowing marketplace for Cedar Rapids, Iowa.  
> Pay with card or crypto. Book in 60 seconds. No account required.

---

## Monorepo Structure

```
hawkeyelawn/
├── apps/
│   └── web/              # Next.js frontend (Vercel)
├── workers/
│   └── api/              # Cloudflare Worker (API + Coinbase webhooks)
└── packages/
    └── shared/           # Shared types and constants
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + Tailwind CSS |
| API | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite edge) |
| KV / Real-time | Cloudflare KV |
| Card Payments | Stripe Checkout |
| Crypto Payments | Coinbase Commerce |
| Hosting | Vercel (web) + Cloudflare Workers (API) |

## Live Infrastructure

| Resource | ID |
|----------|----|
| Stripe Account | `acct_1R0mI1CHq2ueHUIS` |
| Cloudflare Account | `30448c96f02660484f02a55f859a786f` |
| D1 Database | `hawkeyelawn-db` · `174d9cc0-0a9a-4ed4-ad7b-34c54c1821ff` |
| KV Namespace | `AUTH_STORE` · `7dd359bdc70049ee85498f5be04c9330` |

## Stripe Payment Links (Live)

| Yard Size | Price | Link |
|-----------|-------|------|
| Small (< 5k sq ft) | $35 | https://buy.stripe.com/00w28qfTy3xu0dy3Vl0oM07 |
| Medium (5–10k sq ft) | $65 | https://buy.stripe.com/3cIdR88r63xu3pKdvV0oM08 |
| Large (10–20k sq ft) | $95 | https://buy.stripe.com/fZudR88r68RO3pKbnN0oM09 |
| XL (> 20k sq ft) | $125 | https://buy.stripe.com/8x27sKfTy4Byf8s2Rh0oM0a |

## Quick Start

```bash
# Install dependencies
npm install

# Run frontend locally
npm run dev

# Deploy Cloudflare Worker
npm run deploy:worker

# Deploy frontend to Vercel
npm run deploy:web
```

## Environment Variables

### apps/web/.env.local
```
NEXT_PUBLIC_API_URL=https://hawkeyelawn-api.<subdomain>.workers.dev
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### workers/api — set as Cloudflare Secrets (never in files)
```
COINBASE_COMMERCE_API_KEY=...   # Cloudflare Dashboard → Worker → Settings → Secrets
COINBASE_WEBHOOK_SECRET=...
```

## Payment Split
- **85%** → Contractor (via Stripe Connect or crypto wallet)
- **15%** → HawkeyeLawn platform fee

## Target Market
Cedar Rapids, Iowa · ZIP codes 52402, 52403, 52404  
Phase 2: Marion (52302), Hiawatha (52233)
