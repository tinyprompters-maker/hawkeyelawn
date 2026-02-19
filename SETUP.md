# HawkeyeLawn — Setup Guide

## Step 1: Push to GitHub

```bash
cd hawkeyelawn
git init
git add .
git commit -m "🦅 Initial commit — HawkeyeLawn.com"
git remote add origin https://github.com/YOUR_USERNAME/hawkeyelawn.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy the Cloudflare Worker

```bash
cd workers/api
npm install
npx wrangler login
npx wrangler deploy
```

**After deploy, add your secrets in the Cloudflare Dashboard:**
1. Go to dash.cloudflare.com → Workers & Pages → hawkeyelawn-api
2. Click Settings → Variables and Secrets
3. Add as **Secret** (encrypted):
   - `COINBASE_COMMERCE_API_KEY` → your Coinbase Commerce API key
   - `COINBASE_WEBHOOK_SECRET` → from Coinbase Commerce webhook settings

---

## Step 3: Deploy the Frontend to Vercel

```bash
cd apps/web
npm install
npx vercel
```

Or connect your GitHub repo at vercel.com/new and it auto-deploys on every push to main.

**Add these Environment Variables in Vercel dashboard:**
- `NEXT_PUBLIC_API_URL` = your worker URL (e.g. https://hawkeyelawn-api.xyz.workers.dev)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = pk_live_...

---

## Step 4: Set up GitHub Actions (auto-deploy on push)

Add these secrets in GitHub → Settings → Secrets and variables → Actions:

| Secret | Where to get it |
|--------|----------------|
| `CLOUDFLARE_API_TOKEN` | dash.cloudflare.com → Profile → API Tokens → Create Token |
| `VERCEL_TOKEN` | vercel.com → Settings → Tokens |
| `VERCEL_ORG_ID` | vercel.com → Settings → General |
| `VERCEL_PROJECT_ID` | vercel.com → Project → Settings → General |
| `NEXT_PUBLIC_API_URL` | Your worker URL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard |

After this, every `git push` to `main` auto-deploys everything. 🚀

---

## Step 5: Set up Coinbase Commerce Webhook

1. Go to commerce.coinbase.com → Settings → Webhook subscriptions
2. Add endpoint: `https://hawkeyelawn-api.YOUR_SUBDOMAIN.workers.dev/api/crypto/webhook`
3. Copy the webhook secret → add it as `COINBASE_WEBHOOK_SECRET` in Cloudflare secrets

---

## Live URLs (after deploy)

| Service | URL |
|---------|-----|
| Frontend | https://hawkeyelawn.com (or your Vercel URL) |
| API Worker | https://hawkeyelawn-api.YOUR_SUBDOMAIN.workers.dev |
| Health Check | https://hawkeyelawn-api.YOUR_SUBDOMAIN.workers.dev/api/health |
