// HawkeyeLawn API Worker
// Cloudflare Worker — hawkeyelawn-api
// D1 binding: DB → 174d9cc0-0a9a-4ed4-ad7b-34c54c1821ff (hawkeyelawn-db)
// KV binding: KV → 7dd359bdc70049ee85498f5be04c9330 (AUTH_STORE)
// Secret: COINBASE_COMMERCE_API_KEY (add via dashboard → Settings → Variables & Secrets)

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-CC-Webhook-Signature",
  "Content-Type": "application/json",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

function uid() {
  return crypto.randomUUID();
}

// ── ROUTER ──────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // POST /api/jobs/create — homeowner submits a new job
    if (path === "/api/jobs/create" && request.method === "POST") {
      return handleCreateJob(request, env);
    }

    // POST /api/crypto/create-charge — create a Coinbase Commerce charge
    if (path === "/api/crypto/create-charge" && request.method === "POST") {
      return handleCryptoCharge(request, env);
    }

    // POST /api/crypto/webhook — Coinbase Commerce webhook
    if (path === "/api/crypto/webhook" && request.method === "POST") {
      return handleCryptoWebhook(request, env);
    }

    // POST /api/jobs/claim — contractor claims a job
    if (path === "/api/jobs/claim" && request.method === "POST") {
      return handleClaimJob(request, env);
    }

    // GET /api/jobs/available?zip=52402 — contractor polls for open jobs
    if (path === "/api/jobs/available" && request.method === "GET") {
      return handleAvailableJobs(request, env);
    }

    // GET /api/jobs/:id — get job details
    if (path.startsWith("/api/jobs/") && request.method === "GET") {
      const jobId = path.split("/")[3];
      return handleGetJob(jobId, env);
    }

    // GET /api/contractors/:id/earnings
    if (path.startsWith("/api/contractors/") && path.endsWith("/earnings")) {
      const contractorId = path.split("/")[3];
      return handleEarnings(contractorId, env);
    }

    // GET /api/health
    if (path === "/api/health") {
      return json({ status: "ok", service: "hawkeyelawn-api", ts: new Date().toISOString() });
    }

    return json({ error: "Not found" }, 404);
  },
};

// ── HANDLERS ────────────────────────────────────────────────

async function handleCreateJob(request, env) {
  try {
    const { address, zip_code, yard_size, service, price_usd, payment_method, payment_id } = await request.json();

    if (!address || !zip_code || !yard_size || !service || !price_usd) {
      return json({ error: "Missing required fields" }, 400);
    }

    const jobId = "job_" + uid();

    await env.DB.prepare(`
      INSERT INTO jobs (id, address, zip_code, yard_size, service, price_usd, payment_method, payment_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).bind(jobId, address, zip_code, yard_size, service, price_usd, payment_method || "stripe", payment_id || null).run();

    // Notify contractors in this zip via KV (real-time signal)
    const notifKey = `notify:${zip_code}:${jobId}`;
    await env.KV.put(notifKey, JSON.stringify({
      job_id: jobId, address, yard_size, service, price_usd,
      payout: Math.round(price_usd * 0.85 * 100) / 100,
      posted_at: new Date().toISOString(),
    }), { expirationTtl: 3600 }); // expires in 1 hour if unclaimed

    return json({ success: true, job_id: jobId });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function handleCryptoCharge(request, env) {
  try {
    const { job_id, amount_usd, description } = await request.json();

    if (!env.COINBASE_COMMERCE_API_KEY) {
      return json({ error: "Coinbase Commerce API key not configured. Add it in Cloudflare dashboard → Workers → hawkeyelawn-api → Settings → Variables & Secrets → COINBASE_COMMERCE_API_KEY" }, 500);
    }

    // Create charge via Coinbase Commerce API
    const chargeRes = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": env.COINBASE_COMMERCE_API_KEY,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify({
        name: "HawkeyeLawn Service",
        description: description || "Lawn care service — Cedar Rapids, Iowa",
        pricing_type: "fixed_price",
        local_price: { amount: amount_usd.toString(), currency: "USD" },
        metadata: { job_id },
        redirect_url: "https://hawkeyelawn.com/confirmed",
        cancel_url: "https://hawkeyelawn.com/book",
      }),
    });

    const chargeData = await chargeRes.json();

    if (!chargeRes.ok) {
      return json({ error: "Coinbase Commerce error", detail: chargeData }, 500);
    }

    const charge = chargeData.data;

    // Store in D1
    await env.DB.prepare(`
      INSERT INTO crypto_charges (id, job_id, coinbase_charge_id, coinbase_charge_code, hosted_url, amount_usd, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      "cc_" + uid(), job_id,
      charge.id, charge.code,
      charge.hosted_url,
      amount_usd,
      charge.expires_at || null
    ).run();

    return json({
      success: true,
      charge_id: charge.id,
      charge_code: charge.code,
      hosted_url: charge.hosted_url,
      expires_at: charge.expires_at,
    });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function handleCryptoWebhook(request, env) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("X-CC-Webhook-Signature");

    // TODO: verify HMAC signature using env.COINBASE_WEBHOOK_SECRET
    // For now we trust the payload structure
    const event = JSON.parse(rawBody);
    const eventType = event?.event?.type;
    const chargeCode = event?.event?.data?.code;
    const jobId = event?.event?.data?.metadata?.job_id;

    if (eventType === "charge:confirmed" || eventType === "charge:resolved") {
      // Update crypto_charge status
      await env.DB.prepare(`
        UPDATE crypto_charges SET status = 'CONFIRMED', confirmed_at = ? WHERE coinbase_charge_code = ?
      `).bind(new Date().toISOString(), chargeCode).run();

      // Update job to paid
      if (jobId) {
        await env.DB.prepare(`
          UPDATE jobs SET status = 'paid', payment_method = 'crypto' WHERE id = ?
        `).bind(jobId).run();

        // Fetch job to get zip for notification
        const job = await env.DB.prepare("SELECT * FROM jobs WHERE id = ?").bind(jobId).first();
        if (job) {
          const notifKey = `notify:${job.zip_code}:${jobId}`;
          await env.KV.put(notifKey, JSON.stringify({
            job_id: jobId, address: job.address, yard_size: job.yard_size,
            service: job.service, price_usd: job.price_usd,
            payout: Math.round(job.price_usd * 0.85 * 100) / 100,
            payment_method: "crypto", posted_at: new Date().toISOString(),
          }), { expirationTtl: 3600 });
        }
      }
    }

    if (eventType === "charge:failed" || eventType === "charge:expired") {
      await env.DB.prepare(`
        UPDATE crypto_charges SET status = ? WHERE coinbase_charge_code = ?
      `).bind(eventType === "charge:failed" ? "FAILED" : "EXPIRED", chargeCode).run();
    }

    return json({ received: true });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function handleClaimJob(request, env) {
  try {
    const { job_id, contractor_id } = await request.json();

    if (!job_id || !contractor_id) {
      return json({ error: "Missing job_id or contractor_id" }, 400);
    }

    // Atomic claim — only succeed if job is still unclaimed
    const job = await env.DB.prepare("SELECT * FROM jobs WHERE id = ? AND status = 'paid'").bind(job_id).first();

    if (!job) {
      return json({ error: "Job not available — already claimed or not yet paid" }, 409);
    }

    // Claim it
    await env.DB.prepare(`
      UPDATE jobs SET status = 'claimed', contractor_id = ?, claimed_at = ? WHERE id = ? AND status = 'paid'
    `).bind(contractor_id, new Date().toISOString(), job_id).run();

    // Verify the update actually happened (race condition check)
    const updated = await env.DB.prepare("SELECT * FROM jobs WHERE id = ? AND contractor_id = ?").bind(job_id, contractor_id).first();

    if (!updated) {
      return json({ error: "Another contractor claimed this job first" }, 409);
    }

    // Create payout record (85/15 split)
    const gross = job.price_usd;
    const platformFee = Math.round(gross * 0.15 * 100) / 100;
    const contractorPayout = Math.round(gross * 0.85 * 100) / 100;

    await env.DB.prepare(`
      INSERT INTO payouts (id, job_id, contractor_id, gross_usd, platform_fee_usd, contractor_payout_usd, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `).bind("pay_" + uid(), job_id, contractor_id, gross, platformFee, contractorPayout).run();

    // Remove from KV notification queue
    await env.KV.delete(`notify:${job.zip_code}:${job_id}`);

    return json({
      success: true,
      job_id,
      contractor_payout: contractorPayout,
      homeowner_address: updated.address,
      homeowner_phone: updated.homeowner_phone,
    });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function handleAvailableJobs(request, env) {
  try {
    const url = new URL(request.url);
    const zip = url.searchParams.get("zip");

    if (!zip) return json({ error: "zip parameter required" }, 400);

    const jobs = await env.DB.prepare(`
      SELECT id, address, zip_code, yard_size, service, price_usd,
             ROUND(price_usd * 0.85, 2) as payout, payment_method, created_at
      FROM jobs
      WHERE zip_code = ? AND status = 'paid'
      ORDER BY created_at DESC
      LIMIT 20
    `).bind(zip).all();

    return json({ jobs: jobs.results || [] });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function handleGetJob(jobId, env) {
  try {
    const job = await env.DB.prepare("SELECT * FROM jobs WHERE id = ?").bind(jobId).first();
    if (!job) return json({ error: "Job not found" }, 404);
    return json({ job });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function handleEarnings(contractorId, env) {
  try {
    const earnings = await env.DB.prepare(`
      SELECT
        SUM(contractor_payout_usd) as total_lifetime,
        SUM(CASE WHEN DATE(created_at) = DATE('now') THEN contractor_payout_usd ELSE 0 END) as today,
        SUM(CASE WHEN created_at >= DATE('now', '-7 days') THEN contractor_payout_usd ELSE 0 END) as this_week,
        COUNT(*) as total_jobs
      FROM payouts
      WHERE contractor_id = ?
    `).bind(contractorId).first();

    return json({ earnings });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
