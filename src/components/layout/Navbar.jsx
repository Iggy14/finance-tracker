import { supabase } from "../../supabase";

export default function Navbar({ user }) {
  const logout = () => supabase.auth.signOut();

  return (
    <div style={s.bar}>
      <span style={s.logo}>💰 Finance</span>
      <div style={s.right}>
        <img src={user.user_metadata?.avatar_url} alt="" style={s.avatar} />
        <button onClick={logout} style={s.btn}>Sign out</button>
      </div>
    </div>
  );
}

const s = {
  bar:    { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px", background:"#1A2E44", position:"sticky", top:0, zIndex:100 },
  logo:   { color:"#fff", fontWeight:"800", fontSize:"1.1rem" },
  right:  { display:"flex", alignItems:"center", gap:"10px" },
  avatar: { width:"30px", height:"30px", borderRadius:"50%" },
  btn:    { padding:"6px 12px", background:"transparent", border:"1px solid rgba(255,255,255,0.4)", color:"#fff", borderRadius:"6px", cursor:"pointer", fontSize:"0.8rem" },
};