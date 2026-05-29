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

## Deployment Notes

This repository is safe to inspect publicly. Live account IDs, payment links, worker URLs, database IDs, and namespace IDs are intentionally kept out of the README and should live in private ops documentation or provider dashboards.

The production deployment uses:

- Vercel for the web app
- Cloudflare Workers for the API
- Cloudflare D1/KV for edge data and lightweight state
- Stripe Checkout for card payments
- Coinbase Commerce for crypto payments

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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
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
