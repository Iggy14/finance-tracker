import { supabase } from "../../supabase";

export default function Auth() {
  const login = () => supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin }
  });

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.emoji}>💰</div>
        <h1 style={s.title}>Finance Tracker</h1>
        <p style={s.sub}>Track your spending, grow your savings.</p>
        <button onClick={login} style={s.btn}>Sign in with Google</button>
      </div>
    </div>
  );
}

const s = {
  page:  { display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"linear-gradient(135deg,#1A2E44,#2563EB)" },
  card:  { background:"#fff", borderRadius:"20px", padding:"40px 32px", textAlign:"center", width:"300px", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" },
  emoji: { fontSize:"3rem", marginBottom:"12px" },
  title: { margin:"0 0 8px", color:"#1A2E44", fontSize:"1.6rem", fontWeight:"800" },
  sub:   { margin:"0 0 28px", color:"#6B7280", fontSize:"0.9rem" },
  btn:   { width:"100%", padding:"12px", background:"#2563EB", color:"#fff", border:"none", borderRadius:"10px", fontSize:"1rem", cursor:"pointer", fontWeight:"600" },
};