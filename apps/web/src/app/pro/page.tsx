"use client";
import { useState } from "react";

const GOLD = "#F5A623";
const BLACK = "#0a0a0a";

export default function ProPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", zip: "", experience: "", equipment: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = form.name.length > 1 && form.phone.length >= 10 && form.zip.length === 5;

  async function handleSubmit() {
    if (!valid) return;
    setLoading(true);
    try {
      await fetch("https://hawkeyelawn-api.tinyprompters.workers.dev/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: `Contractor — Zip ${form.zip}`,
          yard_size: null,
          service: "Contractor Application",
          price_usd: null,
          timestamp: new Date().toISOString(),
          type: "contractor"
        })
      });
    } catch (_) {}
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: BLACK, color: "white", fontFamily: "'Barlow', sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #1a1a1a" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, background: GOLD, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🦅</div>
          <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: 1, color: GOLD }}>HAWKEYE<span style={{ color: "white" }}>LAWN</span></span>
        </a>
        <a href="/" style={{ color: "#888", fontSize: 14, textDecoration: "none" }}>← Back to site</a>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #111 0%, #1a1200 100%)", padding: "60px 24px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: GOLD, margin: "0 0 12px", letterSpacing: 1 }}>
          BECOME A HAWKEYE PRO
        </h1>
        <p style={{ color: "#ccc", fontSize: 18, margin: "0 0 8px" }}>
          Earn $35–$106/job on your own schedule in Cedar Rapids
        </p>
        <p style={{ color: "#888", fontSize: 14 }}>
          Keep 85% of every job • Get paid same day • You set your zip codes
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: 40, padding: "20px 24px", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" }}>
        {[["$847", "Avg weekly earnings"], ["4.9★", "Pro rating"], ["<60s", "Job claim time"]].map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: GOLD }}>{val}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
              <h2 style={{ color: GOLD, fontSize: 28, fontWeight: 900, margin: "0 0 12px" }}>You're on the list!</h2>
              <p style={{ color: "#ccc", fontSize: 16, marginBottom: 8 }}>
                We'll reach out to {form.name.split(" ")[0]} at {form.phone} within 24 hours to get you set up.
              </p>
              <p style={{ color: "#888", fontSize: 14 }}>
                Cedar Rapids pros are earning this week. Don't miss your spot.
              </p>
              <a href="/" style={{ display: "inline-block", marginTop: 32, padding: "14px 32px", background: GOLD, color: BLACK, fontWeight: 900, borderRadius: 8, textDecoration: "none", fontSize: 16 }}>
                View the Platform →
              </a>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24, color: "white" }}>
                Apply to join the crew
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input
                  placeholder="Full name *"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ padding: "14px 16px", background: "#111", border: "1px solid #333", borderRadius: 8, color: "white", fontSize: 16 }}
                />
                <input
                  placeholder="Phone number *"
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={{ padding: "14px 16px", background: "#111", border: "1px solid #333", borderRadius: 8, color: "white", fontSize: 16 }}
                />
                <input
                  placeholder="Your zip code * (52402, 52403, etc.)"
                  value={form.zip}
                  onChange={e => setForm({ ...form, zip: e.target.value.replace(/\D/g, "").slice(0, 5) })}
                  style={{ padding: "14px 16px", background: "#111", border: "1px solid #333", borderRadius: 8, color: "white", fontSize: 16 }}
                />
                <input
                  placeholder="Email (optional)"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ padding: "14px 16px", background: "#111", border: "1px solid #333", borderRadius: 8, color: "white", fontSize: 16 }}
                />
                <select
                  value={form.experience}
                  onChange={e => setForm({ ...form, experience: e.target.value })}
                  style={{ padding: "14px 16px", background: "#111", border: "1px solid #333", borderRadius: 8, color: form.experience ? "white" : "#888", fontSize: 16 }}
                >
                  <option value="" disabled>Years of lawn experience</option>
                  <option value="new">Just starting out</option>
                  <option value="1-2">1–2 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="5+">5+ years</option>
                </select>
                <select
                  value={form.equipment}
                  onChange={e => setForm({ ...form, equipment: e.target.value })}
                  style={{ padding: "14px 16px", background: "#111", border: "1px solid #333", borderRadius: 8, color: form.equipment ? "white" : "#888", fontSize: 16 }}
                >
                  <option value="" disabled>Equipment you own</option>
                  <option value="push">Push mower only</option>
                  <option value="riding">Riding mower</option>
                  <option value="commercial">Commercial zero-turn</option>
                  <option value="full">Full kit (mower + trimmer + blower)</option>
                </select>

                <button
                  onClick={handleSubmit}
                  disabled={!valid || loading}
                  style={{
                    marginTop: 8,
                    padding: "16px",
                    background: valid ? GOLD : "#333",
                    color: valid ? BLACK : "#666",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 900,
                    fontSize: 18,
                    cursor: valid ? "pointer" : "not-allowed",
                    letterSpacing: 0.5
                  }}
                >
                  {loading ? "Submitting..." : "🦅 APPLY NOW — IT'S FREE"}
                </button>

                <p style={{ color: "#555", fontSize: 12, textAlign: "center", margin: 0 }}>
                  No fees to join. We contact you within 24 hours. Cedar Rapids area only for now.
                </p>
              </div>

              {/* What you get */}
              <div style={{ marginTop: 40, padding: "24px", background: "#0d0d0d", borderRadius: 12, border: "1px solid #1a1a1a" }}>
                <h3 style={{ color: GOLD, fontWeight: 900, margin: "0 0 16px", fontSize: 16 }}>What Hawkeye Pros get:</h3>
                {[
                  ["💰", "Keep 85% of every job — paid same day via Stripe"],
                  ["📍", "Choose your zip codes — only get jobs near you"],
                  ["📱", "One-tap job claiming from your phone"],
                  ["⚡", "Jobs posted 24/7 — work when you want"],
                  ["🌱", "Cedar Rapids is growing — more jobs every week"],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                    <span style={{ color: "#ccc", fontSize: 14, lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "20px 24px", textAlign: "center", color: "#555", fontSize: 13 }}>
        © 2026 HawkeyeLawn · Cedar Rapids, Iowa ·{" "}
        <a href="/privacy" style={{ color: "#555" }}>Privacy</a> ·{" "}
        <a href="/terms" style={{ color: "#555" }}>Terms</a> ·{" "}
        <a href="mailto:info@hawkeyelawn.com" style={{ color: "#555" }}>Contact</a>
      </footer>
    </div>
  );
}
