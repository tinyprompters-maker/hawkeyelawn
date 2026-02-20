export default function Privacy() {
  const GOLD = "#FFCD00";
  const style = {
    page: { minHeight:"100vh", background:"#000", color:"#fff", fontFamily:"'Barlow',Georgia,sans-serif", padding:"40px 20px" } as React.CSSProperties,
    inner: { maxWidth:680, margin:"0 auto" } as React.CSSProperties,
    h1: { fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:48, fontWeight:900, textTransform:"uppercase" as const, color:GOLD, marginBottom:8 },
    h2: { fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:22, fontWeight:900, textTransform:"uppercase" as const, color:GOLD, marginTop:32, marginBottom:8 },
    p: { color:"#aaa", lineHeight:1.7, marginBottom:12, fontSize:15 },
    back: { display:"inline-block", marginBottom:32, color:GOLD, textDecoration:"none" as const, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:1 },
  };
  return (
    <div style={style.page}>
      <div style={style.inner}>
        <a href="/" style={style.back}>← BACK TO HAWKEYELAWN</a>
        <h1 style={style.h1}>Privacy Policy</h1>
        <p style={{...style.p, color:"#555"}}>Effective Date: January 1, 2026 · HawkeyeLawn.com · Cedar Rapids, Iowa</p>

        <h2 style={style.h2}>Information We Collect</h2>
        <p style={style.p}>When you request a quote or book a service, we collect your name, email address, phone number, and service address. This information is used solely to process your booking and communicate with you about your job.</p>

        <h2 style={style.h2}>How We Use Your Information</h2>
        <p style={style.p}>Your contact details are used to send booking confirmations, contractor ETAs, and service updates. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>

        <h2 style={style.h2}>Payment Information</h2>
        <p style={style.p}>Card payments are processed securely through Stripe. We never store your card number. Crypto payments are processed on-chain and are non-reversible by nature.</p>

        <h2 style={style.h2}>Cookies</h2>
        <p style={style.p}>We use a single secure, HTTP-only cookie to maintain your contractor session after login. No tracking or advertising cookies are used.</p>

        <h2 style={style.h2}>Data Retention</h2>
        <p style={style.p}>Lead and booking data is retained for up to 12 months for business records. You may request deletion at any time by emailing us.</p>

        <h2 style={style.h2}>Contact</h2>
        <p style={style.p}>Questions about this policy? Email us at <a href="mailto:info@hawkeyelawn.com" style={{color:GOLD}}>info@hawkeyelawn.com</a></p>
      </div>
    </div>
  );
}
