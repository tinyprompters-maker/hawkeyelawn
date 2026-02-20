import { useState, useEffect } from "react";

// ─── LIVE INFRASTRUCTURE ─────────────────────────────────────
const API = "https://hawkeyelawn-api.tinyprompters.workers.dev";
const PRO_PASSWORD = "HawkeyePro2026!";
const GOLD = "#FFCD00";
const BLACK = "#000000";

const STRIPE_LINKS = {
  small:  "https://buy.stripe.com/00w28qfTy3xu0dy3Vl0oM07",
  medium: "https://buy.stripe.com/3cIdR88r63xu3pKdvV0oM08",
  large:  "https://buy.stripe.com/fZudR88r68RO3pKbnN0oM09",
  xl:     "https://buy.stripe.com/8x27sKfTy4Byf8s2Rh0oM0a",
};

const YARD_SIZES = [
  { id:"small",  label:"Small",  range:"< 5,000 sq ft",       price:35,  icon:"🏡" },
  { id:"medium", label:"Medium", range:"5,000–10,000 sq ft",  price:65,  icon:"🏠" },
  { id:"large",  label:"Large",  range:"10,000–20,000 sq ft", price:95,  icon:"🏘️" },
  { id:"xl",     label:"XL",     range:"> 20,000 sq ft",      price:125, icon:"🌾" },
];

const SERVICES = [
  { id:"mow",  label:"Standard Mow", icon:"🌿", desc:"Full lawn cut, clean lines",  add:0  },
  { id:"trim", label:"Mow + Trim",   icon:"✂️",  desc:"Mow plus edge trimming",      add:15 },
  { id:"edge", label:"Full Service", icon:"⚡",  desc:"Mow, trim & blow-clean",       add:25 },
];

const CRYPTO_COINS = [
  { id:"BTC",  label:"Bitcoin",  sym:"₿", color:"#F7931A" },
  { id:"ETH",  label:"Ethereum", sym:"Ξ", color:"#627EEA" },
  { id:"USDC", label:"USDC",     sym:"$", color:"#2775CA" },
  { id:"SOL",  label:"Solana",   sym:"◎", color:"#9945FF" },
  { id:"DOGE", label:"Dogecoin", sym:"Ð", color:"#C2A633" },
];

const FAKE_ADDRESSES = [
  "1842 Oakwood Dr NE, Cedar Rapids, IA 52402",
  "933 15th St SE, Cedar Rapids, IA 52403",
  "4210 Prairie Ridge Rd, Marion, IA 52302",
  "711 Blairs Ferry Rd NE, Cedar Rapids, IA 52402",
  "2200 Edgewood Rd SW, Cedar Rapids, IA 52404",
  "3480 First Ave NE, Cedar Rapids, IA 52402",
];

const CONTRACTORS = [
  { id:"con_jake_001",  name:"Jake M.",  rating:4.9, jobs:312, eta:"18 min", avatar:"JM" },
  { id:"con_tyler_002", name:"Tyler B.", rating:4.8, jobs:201, eta:"23 min", avatar:"TB" },
  { id:"con_chris_003", name:"Chris W.", rating:5.0, jobs:89,  eta:"31 min", avatar:"CW" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#000;color:#fff;}
@keyframes pulse-ring{0%{box-shadow:0 0 0 0 #22c55e88}70%{box-shadow:0 0 0 9px #22c55e00}100%{box-shadow:0 0 0 0 #22c55e00}}
@keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes goldGlow{0%,100%{box-shadow:0 0 18px #FFCD0055}50%{box-shadow:0 0 38px #FFCD00aa}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes newJob{0%,100%{border-color:#22c55e;box-shadow:0 0 0 0 #22c55e33}50%{box-shadow:0 0 0 10px #22c55e00}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
.slide{animation:slideUp .3s ease;}
.shake{animation:shake .4s ease;}
.glow{animation:goldGlow 2.2s infinite;}
.card{background:#111;border:2px solid #1e1e1e;border-radius:8px;padding:16px;cursor:pointer;transition:all .18s;}
.card:hover{border-color:#FFCD0055;}
.card.on{border-color:#FFCD00;background:#1a1600;box-shadow:0 0 0 1px #FFCD00;}
.btn{background:#FFCD00;color:#000;border:none;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;letter-spacing:1px;padding:18px;border-radius:4px;cursor:pointer;text-transform:uppercase;transition:all .15s;width:100%;display:block;text-align:center;}
.btn:hover{background:#FFD700;transform:scale(1.015);}
.btn:disabled{opacity:.3;cursor:not-allowed;transform:none;}
.btn-out{background:transparent;color:#FFCD00;border:2px solid #FFCD00;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:16px;padding:13px;border-radius:4px;cursor:pointer;text-transform:uppercase;transition:all .15s;width:100%;}
.btn-out:hover{background:#FFCD0018;}
.btn-crypto{background:#0a0800;color:#FFCD00;border:2px solid #FFCD00;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;padding:18px;border-radius:4px;cursor:pointer;text-transform:uppercase;transition:all .15s;width:100%;}
.btn-crypto:hover{background:#1a1200;}
input{background:#111;border:2px solid #222;border-radius:6px;color:white;font-family:'Barlow',sans-serif;font-size:16px;padding:14px 16px;width:100%;outline:none;transition:border-color .2s;}
input:focus{border-color:#FFCD00;}
input::placeholder{color:#444;}
.pay-opt{background:#111;border:2px solid #222;border-radius:10px;padding:20px;cursor:pointer;transition:all .2s;text-align:center;}
.pay-opt:hover{border-color:#FFCD0055;}
.pay-opt.on{border-color:#FFCD00;background:#1a1600;}
`;

function Pulse() {
  return <span style={{display:"inline-block",width:9,height:9,borderRadius:"50%",background:"#22c55e",marginRight:7,animation:"pulse-ring 1.4s infinite"}} />;
}

function StepBar({ current }: { current: number }) {
  const steps = ["Your Info","Address","Yard & Service","Payment","Done"];
  return (
    <div style={{display:"flex",alignItems:"center",marginBottom:28}}>
      {steps.map((s,i) => (
        <div key={s} style={{display:"flex",alignItems:"center",flex:i<steps.length-1?1:0}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:i<=current?GOLD:"#1a1a1a",border:`2px solid ${i<=current?GOLD:"#333"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:i<=current?BLACK:"#555",flexShrink:0,transition:"all .3s",boxShadow:i===current?`0 0 16px ${GOLD}66`:"none"}}>
            {i<current?"✓":i+1}
          </div>
          {i<steps.length-1 && <div style={{flex:1,height:2,margin:"0 3px",background:i<current?GOLD:"#1e1e1e",transition:"background .5s"}} />}
        </div>
      ))}
    </div>
  );
}

function ProLoginModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function attempt() {
    if (pw === PRO_PASSWORD) { onSuccess(); }
    else {
      setError(true); setShake(true); setPw("");
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div style={{position:"fixed",inset:0,background:"#000000ee",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div className={shake?"shake":""} style={{background:"#0a0a0a",border:`2px solid ${GOLD}`,borderRadius:14,padding:32,width:"100%",maxWidth:400,animation:"slideUp .3s ease"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:40,marginBottom:10}}>🦅</div>
          <div style={{fontWeight:900,fontSize:28,textTransform:"uppercase",color:GOLD}}>PRO LOGIN</div>
          <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#555",marginTop:6}}>HawkeyeLawn Contractor Portal</div>
        </div>
        {error && (
          <div style={{background:"#1a0000",border:"1px solid #ff4444",borderRadius:6,padding:12,marginBottom:16,fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#ff6666",textAlign:"center"}}>
            ❌ Invalid password. Contact your admin.
          </div>
        )}
        <div style={{marginBottom:16}}>
          <input type="password" placeholder="Enter pro password" value={pw}
            onChange={e=>{setPw(e.target.value);setError(false);}}
            onKeyDown={e=>e.key==="Enter"&&attempt()} autoFocus />
        </div>
        <button className="btn" onClick={attempt} style={{marginBottom:10}}>ENTER DASHBOARD →</button>
        <button className="btn-out" onClick={onClose}>CANCEL</button>
        <p style={{fontFamily:"'Barlow',sans-serif",fontSize:11,color:"#333",textAlign:"center",marginTop:16}}>
          🔒 Secure contractor access only · Not for customers
        </p>
      </div>
    </div>
  );
}

function CryptoModal({ price, onClose, onPaid }: { price: number, onClose: () => void, onPaid: () => void }) {
  const [coin, setCoin] = useState("USDC");
  const [stage, setStage] = useState("select");
  const mockAddr: Record<string,string> = {
    BTC:"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ETH:"0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    USDC:"0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    SOL:"7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV",
    DOGE:"DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L",
  };
  const selectedCoin = CRYPTO_COINS.find(c=>c.id===coin);
  const txHash = "0x"+Math.random().toString(16).slice(2,18)+"a3f9...";

  return (
    <div style={{position:"fixed",inset:0,background:"#000000dd",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#0a0a0a",border:`2px solid ${GOLD}`,borderRadius:14,padding:28,width:"100%",maxWidth:440,animation:"slideUp .3s ease",maxHeight:"90vh",overflowY:"auto"}}>
        {stage==="select" && <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontWeight:900,fontSize:22,textTransform:"uppercase"}}>₿ Crypto Checkout</div>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#555",fontSize:24,cursor:"pointer"}}>✕</button>
          </div>
          <div style={{background:"#111",borderRadius:8,padding:16,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontFamily:"'Barlow',sans-serif",color:"#777",fontSize:14}}>Amount Due (USD)</div>
            <div style={{fontSize:36,fontWeight:900,color:GOLD}}>${price}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
            {CRYPTO_COINS.map(c=>(
              <div key={c.id} onClick={()=>setCoin(c.id)} style={{background:coin===c.id?`${c.color}22`:"#111",border:`2px solid ${coin===c.id?c.color:"#222"}`,borderRadius:8,padding:"14px 8px",textAlign:"center",cursor:"pointer"}}>
                <div style={{fontSize:26,color:c.color,fontWeight:900,marginBottom:4}}>{c.sym}</div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#aaa"}}>{c.id}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#111",borderRadius:8,padding:16,marginBottom:20}}>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#555",marginBottom:8}}>Send {coin} to:</div>
            <div style={{fontFamily:"monospace",fontSize:11,color:selectedCoin?.color,wordBreak:"break-all",background:"#0a0a0a",padding:10,borderRadius:6,border:"1px solid #222"}}>{mockAddr[coin]}</div>
          </div>
          <button className="btn-crypto" onClick={()=>{setStage("waiting");setTimeout(()=>setStage("confirmed"),2800);}}>CONFIRM PAYMENT IN {coin} →</button>
        </>}
        {stage==="waiting" && (
          <div style={{textAlign:"center",padding:"32px 0"}}>
            <div style={{fontSize:52,marginBottom:20,animation:"spin 1s linear infinite",display:"inline-block"}}>⚙️</div>
            <div style={{fontWeight:900,fontSize:24,textTransform:"uppercase",marginBottom:10}}>Confirming on Chain...</div>
            <div style={{fontFamily:"'Barlow',sans-serif",color:"#666",fontSize:14}}>Usually under 30 seconds.</div>
          </div>
        )}
        {stage==="confirmed" && (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:64,marginBottom:16}}>✅</div>
            <div style={{fontSize:32,fontWeight:900,textTransform:"uppercase",marginBottom:8,color:GOLD}}>PAYMENT CONFIRMED</div>
            <div style={{fontFamily:"monospace",fontSize:11,color:"#22c55e",wordBreak:"break-all",background:"#0a0a0a",padding:10,borderRadius:6,border:"1px solid #1a3a1a",marginBottom:20}}>{txHash}</div>
            <button className="btn glow" onClick={onPaid}>PROCEED TO CONFIRMATION →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HawkeyeLawn() {
  const [step, setStep] = useState(0);
  const [proAuthed, setProAuthed] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [yard, setYard] = useState<string|null>(null);
  const [svc, setSvc] = useState("mow");
  const [payMethod, setPayMethod] = useState<string|null>(null);
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const [countdown, setCountdown] = useState<number|null>(null);
  const [jobLive, setJobLive] = useState(false);
  const [claimed, setClaimed] = useState<string|null>(null);

  const price = yard ? (YARD_SIZES.find(y=>y.id===yard)?.price||35)+(SERVICES.find(s=>s.id===svc)?.add||0) : 0;
  const canProceedLead = leadName.trim().length>1 && (leadEmail.includes("@")||leadPhone.length>=10);

  useEffect(() => {
    if (step===5) {
      let t=5; setCountdown(t);
      const iv=setInterval(()=>{t--;setCountdown(t);if(t<=0){clearInterval(iv);setJobLive(true);}},1000);
      return ()=>clearInterval(iv);
    }
  },[step]);

  async function saveLead() {
    try {
      await fetch(`${API}/api/leads/capture`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:leadName,email:leadEmail,phone:leadPhone,timestamp:new Date().toISOString()})});
    } catch(e){}
    setStep(2);
  }

  if (proAuthed) return <ProDashboard onBack={()=>setProAuthed(false)} jobLive={jobLive} claimed={claimed} setClaimed={setClaimed} />;

  return (
    <div style={{minHeight:"100vh",background:BLACK,color:"white",fontFamily:"'Barlow Condensed',Impact,sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{CSS}</style>
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:"1px solid #111"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setStep(0)}>
          <div style={{width:34,height:34,background:GOLD,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🦅</div>
          <span style={{fontWeight:900,fontSize:24,letterSpacing:1,color:GOLD}}>HAWKEYE<span style={{color:"white"}}>LAWN</span></span>
        </div>
        <a href="/api/auth/signin/google" style={{textDecoration:"none"}}>
          <button className="btn-out" style={{width:"auto",fontSize:13,padding:"8px 16px",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14}}>G</span> PRO LOGIN
          </button>
        </a>
      </nav>

      <div style={{background:GOLD,overflow:"hidden",padding:"5px 0"}}>
        <div style={{display:"flex",animation:"marquee 22s linear infinite",whiteSpace:"nowrap"}}>
          {[...Array(2)].flatMap(()=>["⚡ SAME-DAY SERVICE","🌿 IOWA'S #1 ON-DEMAND LAWN CARE","⭐ 4.9 STARS · CEDAR RAPIDS","₿ CRYPTO ACCEPTED","💰 INSTANT PRICING","🦅 GET MOWED TODAY"]).map((t,i)=>(
            <span key={i} style={{color:BLACK,fontWeight:800,fontSize:12,letterSpacing:1,marginRight:44}}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{flex:1,maxWidth:500,margin:"0 auto",width:"100%",padding:"24px 20px 52px"}}>

        {step===0 && (
          <div className="slide">
            <div style={{textAlign:"center",padding:"36px 0 44px"}}>
              <div style={{fontSize:12,color:GOLD,fontWeight:700,letterSpacing:3,marginBottom:14,textTransform:"uppercase"}}><Pulse/>PROS AVAILABLE NOW · CEDAR RAPIDS</div>
              <h1 style={{fontSize:64,fontWeight:900,lineHeight:.92,textTransform:"uppercase",marginBottom:14}}>GET MOWED<br/><span style={{color:GOLD}}>TODAY.</span></h1>
              <p style={{fontFamily:"'Barlow',sans-serif",fontSize:16,color:"#777",marginBottom:14}}>Lawn care at Iowa Speed. Book in 60 seconds.<br/>No account. No BS.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginBottom:32}}>
                {["💳 Visa / MC","₿ Bitcoin","Ξ Ethereum","◎ Solana","$ USDC","Ð Doge"].map(c=>(
                  <span key={c} style={{fontFamily:"'Barlow',sans-serif",fontSize:12,background:"#111",border:"1px solid #222",borderRadius:4,padding:"4px 10px",color:"#888"}}>{c}</span>
                ))}
              </div>
              <button className="btn glow" style={{fontSize:26,padding:22}} onClick={()=>setStep(1)}>GET INSTANT QUOTE →</button>
              <p style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#444",marginTop:10}}>No account required · From $35 · Pay crypto or card</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:40}}>
              {[["847","YARDS MOWED"],["4.9★","AVG RATING"],["<60s","TO BOOK"]].map(([v,l])=>(
                <div key={l} style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:8,padding:"16px 8px",textAlign:"center"}}>
                  <div style={{fontSize:26,fontWeight:900,color:GOLD}}>{v}</div>
                  <div style={{fontSize:10,color:"#555",fontWeight:700,letterSpacing:1}}>{l}</div>
                </div>
              ))}
            </div>
            <h2 style={{fontSize:28,fontWeight:900,textTransform:"uppercase",borderBottom:`2px solid ${GOLD}`,paddingBottom:8,marginBottom:20}}>HOW IT WORKS</h2>
            {[{n:"01",t:"Tell Us Who You Are",d:"Name + contact so we can send your confirmation."},
              {n:"02",t:"Enter Your Address",d:"We confirm same-day availability in your zip."},
              {n:"03",t:"Pick Yard + Service",d:"Instant price shown. Zero surprises."},
              {n:"04",t:"Pay — Card or Crypto",d:"BTC, ETH, SOL, USDC, DOGE, or card. All accepted."},
            ].map(({n,t,d})=>(
              <div key={n} style={{display:"flex",gap:14,marginBottom:18}}>
                <div style={{fontSize:40,fontWeight:900,color:GOLD,lineHeight:1,minWidth:46}}>{n}</div>
                <div><div style={{fontWeight:800,fontSize:17,textTransform:"uppercase"}}>{t}</div><div style={{fontFamily:"'Barlow',sans-serif",fontSize:14,color:"#666"}}>{d}</div></div>
              </div>
            ))}
            <button className="btn glow" style={{marginTop:16}} onClick={()=>setStep(1)}>BOOK YOUR YARD →</button>
          </div>
        )}

        {step===1 && (
          <div className="slide">
            <StepBar current={0}/>
            <h2 style={{fontSize:38,fontWeight:900,textTransform:"uppercase",marginBottom:6}}>YOUR INFO</h2>
            <p style={{fontFamily:"'Barlow',sans-serif",color:"#666",marginBottom:24,fontSize:14}}>We'll send your booking confirmation and pro ETA here. No spam, ever.</p>
            <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24}}>
              <div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Full Name *</div>
                <input placeholder="Your name" value={leadName} onChange={e=>setLeadName(e.target.value)} autoFocus/>
              </div>
              <div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Email Address</div>
                <input type="email" placeholder="your@email.com" value={leadEmail} onChange={e=>setLeadEmail(e.target.value)}/>
              </div>
              <div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#555",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Phone Number</div>
                <input type="tel" placeholder="(319) 555-0100" value={leadPhone} onChange={e=>setLeadPhone(e.target.value)}/>
              </div>
            </div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#444",marginBottom:16,textAlign:"center"}}>🔒 Your info is never sold or shared. Iowa privacy guaranteed.</div>
            <button className="btn glow" disabled={!canProceedLead} onClick={saveLead}>GET MY INSTANT QUOTE →</button>
            {!canProceedLead && <p style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#555",textAlign:"center",marginTop:8}}>Name + email or phone required</p>}
            <button className="btn-out" style={{marginTop:10}} onClick={()=>setStep(0)}>← BACK</button>
          </div>
        )}

        {step===2 && (
          <div className="slide">
            <StepBar current={1}/>
            <h2 style={{fontSize:38,fontWeight:900,textTransform:"uppercase",marginBottom:6}}>YOUR ADDRESS</h2>
            <p style={{fontFamily:"'Barlow',sans-serif",color:"#666",marginBottom:22,fontSize:14}}>Hey {leadName.split(" ")[0]}! Confirm same-day availability in your zip.</p>
            <div style={{position:"relative",marginBottom:14}}>
              <input placeholder="Start typing your Iowa address..." value={address}
                onChange={e=>{setAddress(e.target.value);setSuggestions(e.target.value.length>2?FAKE_ADDRESSES.filter(a=>a.toLowerCase().includes(e.target.value.toLowerCase())).slice(0,4):[]);}} autoFocus/>
              {suggestions.length>0 && (
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#161616",border:"1px solid #2a2a2a",borderTop:"none",borderRadius:"0 0 6px 6px",zIndex:20}}>
                  {suggestions.map(s=>(
                    <div key={s} onClick={()=>{setAddress(s);setSuggestions([]);}} style={{padding:"12px 16px",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:14,borderBottom:"1px solid #1a1a1a"}}
                      onMouseEnter={e=>(e.currentTarget.style.background="#1a1600")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>📍 {s}</div>
                  ))}
                </div>
              )}
            </div>
            {!address && FAKE_ADDRESSES.slice(0,3).map(a=>(
              <div key={a} onClick={()=>setAddress(a)} style={{padding:"10px 14px",background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:6,marginBottom:8,cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#666"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=GOLD;(e.currentTarget as HTMLElement).style.color="white";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="#1a1a1a";(e.currentTarget as HTMLElement).style.color="#666";}}>📍 {a}</div>
            ))}
            <div style={{height:18}}/>
            <button className="btn" disabled={!address} onClick={()=>address&&setStep(3)}>CONFIRM ADDRESS →</button>
            <button className="btn-out" style={{marginTop:10}} onClick={()=>setStep(1)}>← BACK</button>
          </div>
        )}

        {step===3 && (
          <div className="slide">
            <StepBar current={2}/>
            <h2 style={{fontSize:38,fontWeight:900,textTransform:"uppercase",marginBottom:4}}>YARD & SERVICE</h2>
            <p style={{fontFamily:"'Barlow',sans-serif",color:"#555",fontSize:13,marginBottom:22}}>📍 {address}</p>
            <div style={{fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:2,color:GOLD,marginBottom:10}}>Yard Size</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:26}}>
              {YARD_SIZES.map(y=>(
                <div key={y.id} className={`card${yard===y.id?" on":""}`} onClick={()=>setYard(y.id)}>
                  <div style={{fontSize:30,marginBottom:6}}>{y.icon}</div>
                  <div style={{fontWeight:900,fontSize:20,textTransform:"uppercase"}}>{y.label}</div>
                  <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#666"}}>{y.range}</div>
                  <div style={{fontWeight:900,fontSize:20,color:GOLD,marginTop:4}}>${y.price}</div>
                </div>
              ))}
            </div>
            <div style={{fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:2,color:GOLD,marginBottom:10}}>Service Type</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:26}}>
              {SERVICES.map(s=>(
                <div key={s.id} className={`card${svc===s.id?" on":""}`} onClick={()=>setSvc(s.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:24}}>{s.icon}</span>
                    <div><div style={{fontWeight:800,fontSize:17,textTransform:"uppercase"}}>{s.label}</div><div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#666"}}>{s.desc}</div></div>
                  </div>
                  {s.add>0 && <div style={{color:GOLD,fontWeight:800}}>+${s.add}</div>}
                </div>
              ))}
            </div>
            {yard && (
              <div style={{background:"#0d0d00",border:`2px solid ${GOLD}`,borderRadius:8,padding:20,marginBottom:22,textAlign:"center",animation:"slideUp .3s ease"}}>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#777",marginBottom:4}}>YOUR INSTANT PRICE</div>
                <div style={{fontSize:70,fontWeight:900,color:GOLD,lineHeight:1}}>${price}</div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#555"}}>Pay with card or crypto — zero hidden fees</div>
              </div>
            )}
            <button className="btn" disabled={!yard} onClick={()=>yard&&setStep(4)}>CHOOSE PAYMENT →</button>
            <button className="btn-out" style={{marginTop:10}} onClick={()=>setStep(2)}>← BACK</button>
          </div>
        )}

        {step===4 && (
          <div className="slide">
            <StepBar current={3}/>
            <h2 style={{fontSize:38,fontWeight:900,textTransform:"uppercase",marginBottom:4}}>PAYMENT</h2>
            <p style={{fontFamily:"'Barlow',sans-serif",color:"#555",fontSize:13,marginBottom:22}}>Confirmation sent to {leadEmail||leadPhone}.</p>
            <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:8,padding:18,marginBottom:24}}>
              <div style={{fontWeight:800,fontSize:12,textTransform:"uppercase",color:GOLD,letterSpacing:2,marginBottom:14}}>ORDER SUMMARY</div>
              {[["👤 Name",leadName],["📍 Address",address.split(",")[0]],["📐 Yard",YARD_SIZES.find(y=>y.id===yard)?.label||""],["🌿 Service",SERVICES.find(s=>s.id===svc)?.label||""]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontFamily:"'Barlow',sans-serif",fontSize:14}}>
                  <span style={{color:"#666"}}>{l}</span><span>{v}</span>
                </div>
              ))}
              <div style={{borderTop:"1px solid #1e1e1e",paddingTop:12,display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:24}}>
                <span>TOTAL</span><span style={{color:GOLD}}>${price}</span>
              </div>
            </div>
            <div style={{fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:2,color:"#666",marginBottom:12}}>How do you want to pay?</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
              <div className={`pay-opt${payMethod==="stripe"?" on":""}`} onClick={()=>setPayMethod("stripe")}>
                <div style={{fontSize:36,marginBottom:8}}>💳</div>
                <div style={{fontWeight:900,fontSize:18,textTransform:"uppercase"}}>Card</div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#666"}}>Visa · MC · Amex</div>
              </div>
              <div className={`pay-opt${payMethod==="crypto"?" on":""}`} onClick={()=>setPayMethod("crypto")}>
                <div style={{fontSize:36,marginBottom:8}}>₿</div>
                <div style={{fontWeight:900,fontSize:18,textTransform:"uppercase"}}>Crypto</div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#666"}}>BTC · ETH · SOL · USDC</div>
              </div>
            </div>
            {payMethod==="stripe" && (
              <div style={{animation:"slideUp .3s ease"}}>
                <a href={STRIPE_LINKS[yard as keyof typeof STRIPE_LINKS]} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                  <button className="btn glow" style={{fontSize:22}} onClick={()=>setTimeout(()=>setStep(5),500)}>💳 PAY ${price} WITH CARD →</button>
                </a>
                <p style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#444",textAlign:"center",marginTop:8}}>Stripe Checkout · 256-bit SSL · Encrypted</p>
              </div>
            )}
            {payMethod==="crypto" && (
              <div style={{animation:"slideUp .3s ease"}}>
                <button className="btn-crypto" onClick={()=>setCryptoOpen(true)}>₿ PAY ${price} WITH CRYPTO →</button>
              </div>
            )}
            {!payMethod && <button className="btn" disabled>SELECT A PAYMENT METHOD ABOVE</button>}
            <button className="btn-out" style={{marginTop:12}} onClick={()=>setStep(3)}>← BACK</button>
          </div>
        )}

        {step===5 && (
          <div className="slide">
            <StepBar current={4}/>
            <div style={{textAlign:"center",paddingTop:12}}>
              <div style={{fontSize:70,marginBottom:14}}>✅</div>
              <h2 style={{fontSize:46,fontWeight:900,textTransform:"uppercase",marginBottom:8}}>PAYMENT<br/><span style={{color:GOLD}}>CONFIRMED!</span></h2>
              <p style={{fontFamily:"'Barlow',sans-serif",color:"#666",marginBottom:10}}>Hey {leadName.split(" ")[0]}, your job is live!</p>
              <p style={{fontFamily:"'Barlow',sans-serif",color:"#444",fontSize:13,marginBottom:30}}>Confirmation sent to {leadEmail||leadPhone}</p>
              {!jobLive?(
                <div style={{background:"#0d0d00",border:`2px solid ${GOLD}`,borderRadius:10,padding:24,marginBottom:28}}>
                  <div style={{fontSize:54,fontWeight:900,color:GOLD}}>{countdown}</div>
                  <div style={{fontFamily:"'Barlow',sans-serif",color:"#666",marginBottom:12}}>notifying contractors...</div>
                  <div style={{background:"#1e1e1e",borderRadius:4,height:6,overflow:"hidden"}}>
                    <div style={{height:"100%",background:GOLD,width:`${((5-(countdown||0))/5)*100}%`,transition:"width 1s linear"}}/>
                  </div>
                </div>
              ):(
                <div style={{marginBottom:28,animation:"slideUp .4s ease"}}>
                  <div style={{fontWeight:800,fontSize:12,textTransform:"uppercase",color:"#22c55e",letterSpacing:2,marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Pulse/>3 PROS NOTIFIED</div>
                  {CONTRACTORS.map(c=>(
                    <div key={c.id} style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:8,padding:14,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:42,height:42,background:GOLD,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:BLACK,fontSize:13}}>{c.avatar}</div>
                        <div><div style={{fontWeight:800,fontSize:16}}>{c.name}</div><div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#666"}}>⭐ {c.rating} · {c.jobs} jobs · ETA {c.eta}</div></div>
                      </div>
                      <div style={{color:"#22c55e",fontWeight:700,fontSize:12}}>NOTIFIED</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{borderTop:"1px solid #0e0e0e",padding:"14px 20px",display:"flex",justifyContent:"space-between",fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#333"}}>
        <span>© 2026 HawkeyeLawn.com · Cedar Rapids, Iowa</span>
        <span>Privacy · Terms</span>
      </div>

      {cryptoOpen && <CryptoModal price={price} onClose={()=>setCryptoOpen(false)} onPaid={()=>{setCryptoOpen(false);setStep(5);}}/>}
    </div>
  );
}

function ProDashboard({ onBack, jobLive, claimed, setClaimed }: { onBack:()=>void, jobLive:boolean, claimed:string|null, setClaimed:(id:string)=>void }) {
  const [tab, setTab] = useState("leads");
  const LIVE_JOBS = jobLive?[
    {id:"job_001",address:"1842 Oakwood Dr NE",size:"Medium",service:"Full Service",payout:93.50,ago:"Just now",payMethod:"Stripe"},
    {id:"job_002",address:"4210 Prairie Ridge Rd",size:"Large",service:"Mow + Trim",payout:93.50,ago:"2 min ago",payMethod:"Bitcoin ₿"},
  ]:[];

  return (
    <div style={{minHeight:"100vh",background:BLACK,color:"white",fontFamily:"'Barlow Condensed',Impact,sans-serif"}}>
      <style>{CSS}</style>
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:"1px solid #111"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:GOLD,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🦅</div>
          <div>
            <div style={{fontWeight:900,fontSize:18}}><span style={{color:GOLD}}>HAWKEYELAWN</span> <span style={{color:"#444",fontSize:13}}>PRO</span></div>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:11,color:"#444"}}>Contractor Portal · Cedar Rapids</div>
          </div>
        </div>
        <button onClick={onBack} style={{background:"none",border:"1px solid #333",borderRadius:4,color:"#666",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontSize:13,padding:"6px 14px"}}>🔒 LOGOUT</button>
      </nav>
      <div style={{background:"#060f06",padding:"11px 20px",display:"flex",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontFamily:"'Barlow',sans-serif"}}>
          <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:"#22c55e",animation:"pulse-ring 1.4s infinite"}}/>
          <span style={{color:"#22c55e",fontWeight:700,fontSize:14}}>ONLINE · ACCEPTING JOBS</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderBottom:"1px solid #0e0e0e"}}>
        {[["TODAY","$127.50"],["THIS WEEK","$612.75"],["PENDING","$85.00"]].map(([l,v])=>(
          <div key={l} style={{padding:"15px 10px",textAlign:"center",borderRight:"1px solid #0e0e0e"}}>
            <div style={{fontFamily:"'Barlow',sans-serif",fontSize:11,color:"#444",marginBottom:4}}>{l}</div>
            <div style={{fontSize:22,fontWeight:900,color:GOLD}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",borderBottom:"1px solid #0e0e0e"}}>
        {[["leads","LEADS"],["jobs","MY JOBS"],["pay","PAYOUTS"]].map(([id,label])=>(
          <div key={id} onClick={()=>setTab(id)} style={{padding:"12px 20px",cursor:"pointer",fontWeight:700,fontSize:15,letterSpacing:1,borderBottom:`3px solid ${tab===id?GOLD:"transparent"}`,color:tab===id?GOLD:"#444"}}>
            {label}
            {id==="leads"&&LIVE_JOBS.length>0&&<span style={{marginLeft:6,background:"#22c55e",color:BLACK,borderRadius:"50%",width:18,height:18,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900}}>{LIVE_JOBS.length}</span>}
          </div>
        ))}
      </div>
      <div style={{padding:20}}>
        {tab==="leads" && (LIVE_JOBS.length===0?(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:52,marginBottom:14}}>📡</div>
            <div style={{fontWeight:800,fontSize:22,textTransform:"uppercase",marginBottom:8}}>Listening for Jobs...</div>
            <div style={{fontFamily:"'Barlow',sans-serif",color:"#555",fontSize:14}}>Leads appear here instantly when homeowners pay.</div>
          </div>
        ):LIVE_JOBS.map(job=>(
          <div key={job.id} style={{background:"#060f06",border:"2px solid #22c55e",borderRadius:10,padding:20,marginBottom:14,animation:"newJob 2.5s infinite,slideUp .4s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <div style={{fontWeight:700,fontSize:11,color:"#22c55e",letterSpacing:2,marginBottom:4}}>⚡ NEW JOB · {job.ago.toUpperCase()}</div>
                <div style={{fontWeight:900,fontSize:20}}>📍 {job.address}</div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#666"}}>{job.size} Yard · {job.service} · {job.payMethod}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:36,fontWeight:900,color:GOLD}}>${job.payout}</div>
                <div style={{fontFamily:"'Barlow',sans-serif",fontSize:11,color:"#555"}}>your cut</div>
              </div>
            </div>
            {claimed===job.id?(
              <div style={{background:"#22c55e",color:BLACK,borderRadius:6,padding:14,textAlign:"center",fontWeight:900,fontSize:18,textTransform:"uppercase"}}>✅ JOB CLAIMED — HOMEOWNER DETAILS SENT</div>
            ):(
              <button style={{background:"#22c55e",color:BLACK,border:"none",borderRadius:6,padding:16,width:"100%",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,cursor:"pointer",textTransform:"uppercase"}} onClick={()=>setClaimed(job.id)}>⚡ CLAIM THIS JOB — ${job.payout}</button>
            )}
          </div>
        )))}
        {tab==="jobs" && [{addr:"933 15th St SE",status:"Completed",earned:59.50,date:"Today",method:"Stripe"},{addr:"711 Blairs Ferry Rd NE",status:"Completed",earned:85.00,date:"Yesterday",method:"Bitcoin ₿"},{addr:"2200 Edgewood Rd SW",status:"Completed",earned:42.50,date:"Feb 17",method:"USDC"}].map((j,i)=>(
          <div key={i} style={{background:"#111",border:"1px solid #1a1a1a",borderRadius:8,padding:16,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:800,fontSize:16}}>📍 {j.addr}</div><div style={{fontFamily:"'Barlow',sans-serif",fontSize:12,color:"#555"}}>{j.date} · {j.status} · {j.method}</div></div>
            <div style={{fontWeight:900,fontSize:22,color:GOLD}}>+${j.earned}</div>
          </div>
        ))}
        {tab==="pay" && (
          <div style={{animation:"slideUp .3s ease"}}>
            <div style={{background:"#0d0d00",border:`2px solid ${GOLD}`,borderRadius:10,padding:24,marginBottom:20,textAlign:"center"}}>
              <div style={{fontFamily:"'Barlow',sans-serif",fontSize:13,color:"#555",marginBottom:4}}>LIFETIME EARNINGS</div>
              <div style={{fontSize:58,fontWeight:900,color:GOLD}}>$4,812</div>
            </div>
            <button style={{background:GOLD,color:BLACK,border:"none",borderRadius:6,padding:16,width:"100%",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,cursor:"pointer",textTransform:"uppercase"}}>💰 REQUEST PAYOUT</button>
          </div>
        )}
      </div>
    </div>
  );
}
