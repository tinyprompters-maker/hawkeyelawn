export default function AuthError() {
  return (
    <div style={{minHeight:"100vh",background:"#000",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',Impact,sans-serif",padding:20}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{fontSize:64,marginBottom:16}}>🚫</div>
        <h1 style={{fontSize:40,fontWeight:900,textTransform:"uppercase",color:"#FFCD00",marginBottom:12}}>ACCESS DENIED</h1>
        <p style={{fontFamily:"'Barlow',sans-serif",color:"#666",fontSize:16,marginBottom:32}}>
          That Google account is not authorized for the HawkeyeLawn contractor portal.
        </p>
        <a href="/" style={{textDecoration:"none"}}>
          <button style={{background:"#FFCD00",color:"#000",border:"none",borderRadius:6,padding:"16px 32px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,cursor:"pointer",textTransform:"uppercase"}}>
            ← BACK TO SITE
          </button>
        </a>
      </div>
    </div>
  );
}
