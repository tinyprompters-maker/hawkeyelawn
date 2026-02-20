export default function Terms() {
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
        <h1 style={style.h1}>Terms of Service</h1>
        <p style={{...style.p, color:"#555"}}>Effective Date: January 1, 2026 · HawkeyeLawn.com · Cedar Rapids, Iowa</p>

        <h2 style={style.h2}>Service Agreement</h2>
        <p style={style.p}>By booking through HawkeyeLawn.com, you agree to these terms. HawkeyeLawn connects homeowners with independent lawn care contractors in the Cedar Rapids, Iowa area. We are a marketplace platform, not a direct lawn care provider.</p>

        <h2 style={style.h2}>Booking & Payment</h2>
        <p style={style.p}>Payment is collected at the time of booking. Prices shown are fixed for the selected yard size and service type. No hidden fees will be added. Stripe processes all card transactions securely. Crypto payments are final and non-refundable once confirmed on-chain.</p>

        <h2 style={style.h2}>Service Guarantee</h2>
        <p style={style.p}>If a contractor does not arrive within the estimated window, or the job is not completed to a reasonable standard, contact us within 24 hours for a full refund or rescheduled service at no charge.</p>

        <h2 style={style.h2}>Cancellations</h2>
        <p style={style.p}>Cancellations made more than 2 hours before the scheduled service window are eligible for a full refund. Cancellations within 2 hours are subject to a 50% cancellation fee to compensate the assigned contractor.</p>

        <h2 style={style.h2}>Contractor Conduct</h2>
        <p style={style.p}>All contractors on our platform are independent operators. HawkeyeLawn is not responsible for property damage caused by contractor negligence, though we will work to mediate disputes and connect you with the appropriate party.</p>

        <h2 style={style.h2}>Limitation of Liability</h2>
        <p style={style.p}>HawkeyeLawn's total liability for any claim shall not exceed the amount paid for the service in question. We are not liable for indirect or consequential damages.</p>

        <h2 style={style.h2}>Contact</h2>
        <p style={style.p}>Questions? Email <a href="mailto:info@hawkeyelawn.com" style={{color:GOLD}}>info@hawkeyelawn.com</a></p>
      </div>
    </div>
  );
}
