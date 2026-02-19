// API client — calls hawkeyelawn-api Cloudflare Worker
// Set NEXT_PUBLIC_API_URL in .env.local

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://hawkeyelawn-api.workers.dev";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Create a job after Stripe payment
  createJob: (payload: {
    address: string;
    zip_code: string;
    yard_size: string;
    service: string;
    price_usd: number;
    payment_method: string;
    payment_id?: string;
  }) =>
    request<{ success: boolean; job_id: string }>("/api/jobs/create", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Create a Coinbase Commerce charge
  createCryptoCharge: (payload: {
    job_id: string;
    amount_usd: number;
    description?: string;
  }) =>
    request<{
      success: boolean;
      charge_id: string;
      charge_code: string;
      hosted_url: string;
      expires_at: string;
    }>("/api/crypto/create-charge", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Contractor claims a job
  claimJob: (payload: { job_id: string; contractor_id: string }) =>
    request<{
      success: boolean;
      job_id: string;
      contractor_payout: number;
      homeowner_address: string;
      homeowner_phone?: string;
    }>("/api/jobs/claim", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Get available jobs by zip code
  getAvailableJobs: (zip: string) =>
    request<{ jobs: any[] }>(`/api/jobs/available?zip=${zip}`),

  // Get contractor earnings
  getEarnings: (contractorId: string) =>
    request<{ earnings: any }>(`/api/contractors/${contractorId}/earnings`),

  // Health check
  health: () => request<{ status: string; ts: string }>("/api/health"),
};
