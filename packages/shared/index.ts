// ─── Shared constants — used by both apps/web and workers/api ───

export const STRIPE_PAYMENT_LINKS: Record<string, string> = {
  small:  "https://buy.stripe.com/00w28qfTy3xu0dy3Vl0oM07", // $35
  medium: "https://buy.stripe.com/3cIdR88r63xu3pKdvV0oM08", // $65
  large:  "https://buy.stripe.com/fZudR88r68RO3pKbnN0oM09", // $95
  xl:     "https://buy.stripe.com/8x27sKfTy4Byf8s2Rh0oM0a", // $125
};

export const YARD_SIZES = [
  { id: "small",  label: "Small",  range: "< 5,000 sq ft",       sqft: 2500,  basePrice: 35  },
  { id: "medium", label: "Medium", range: "5,000–10,000 sq ft",  sqft: 7500,  basePrice: 65  },
  { id: "large",  label: "Large",  range: "10,000–20,000 sq ft", sqft: 15000, basePrice: 95  },
  { id: "xl",     label: "XL",     range: "> 20,000 sq ft",      sqft: 25000, basePrice: 125 },
] as const;

export const SERVICES = [
  { id: "mow",  label: "Standard Mow", adder: 0  },
  { id: "trim", label: "Mow + Trim",   adder: 15 },
  { id: "edge", label: "Full Service", adder: 25 },
] as const;

export const CRYPTO_COINS = [
  { id: "BTC",  label: "Bitcoin",  symbol: "₿", color: "#F7931A" },
  { id: "ETH",  label: "Ethereum", symbol: "Ξ", color: "#627EEA" },
  { id: "USDC", label: "USDC",     symbol: "$", color: "#2775CA" },
  { id: "SOL",  label: "Solana",   symbol: "◎", color: "#9945FF" },
  { id: "DOGE", label: "Dogecoin", symbol: "Ð", color: "#C2A633" },
] as const;

export const PLATFORM_FEE = 0.15;        // 15% platform fee
export const CONTRACTOR_SHARE = 0.85;    // 85% to contractor

export const TARGET_ZIPS = ["52402", "52403", "52404", "52302", "52233"];

export function calcPrice(yardId: string, serviceId: string): number {
  const yard = YARD_SIZES.find((y) => y.id === yardId);
  const svc  = SERVICES.find((s) => s.id === serviceId);
  return (yard?.basePrice ?? 35) + (svc?.adder ?? 0);
}

export function calcPayout(price: number): number {
  return Math.round(price * CONTRACTOR_SHARE * 100) / 100;
}

// ─── Types ───────────────────────────────────────────────────

export type YardSize = "small" | "medium" | "large" | "xl";
export type ServiceType = "mow" | "trim" | "edge";
export type PaymentMethod = "stripe" | "crypto";
export type JobStatus = "pending" | "paid" | "claimed" | "completed" | "cancelled";
export type CryptoStatus = "NEW" | "PENDING" | "CONFIRMED" | "FAILED" | "EXPIRED";

export interface Job {
  id: string;
  address: string;
  zip_code: string;
  yard_size: YardSize;
  service: ServiceType;
  price_usd: number;
  payment_method: PaymentMethod;
  payment_id?: string;
  crypto_currency?: string;
  crypto_tx_hash?: string;
  status: JobStatus;
  contractor_id?: string;
  homeowner_phone?: string;
  claimed_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface Contractor {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  zip_codes: string;
  stripe_connect_id?: string;
  coinbase_wallet?: string;
  status: "active" | "inactive";
  rating: number;
  jobs_completed: number;
  created_at: string;
}

export interface CreateJobPayload {
  address: string;
  zip_code: string;
  yard_size: YardSize;
  service: ServiceType;
  price_usd: number;
  payment_method: PaymentMethod;
  payment_id?: string;
}

export interface CreateChargePayload {
  job_id: string;
  amount_usd: number;
  description?: string;
}

export interface ClaimJobPayload {
  job_id: string;
  contractor_id: string;
}
