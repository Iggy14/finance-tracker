import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./components/layout/Auth";
import Navbar from "./components/layout/Navbar";
import BottomNav from "./components/layout/BottomNav.jsx";
import CalendarPage from "./pages/CalendarPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [user,    setUser]    = useState(null);
  const [page,    setPage]    = useState("calendar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div style={s.loading}>Loading...</div>;
  if (!user)   return <Auth />;

  return (
    <div style={s.app}>
      <Navbar user={user} />
      <div style={s.content}>
        {page === "calendar"   && <CalendarPage  user={user} />}
        {page === "analytics"  && <AnalyticsPage user={user} />}
        {page === "settings"   && <SettingsPage  user={user} />}
      </div>
      <BottomNav page={page} setPage={setPage} />
    </div>
  );
}

const s = {
  app:     { fontFamily:"'Segoe UI', sans-serif", background:"#F8FAFC", minHeight:"100vh", width:"100%", maxWidth:"480px", margin:"0 auto", position:"relative", boxShadow:"0 0 40px rgba(0,0,0,0.1)" },
  content: { paddingBottom:"70px", paddingTop:"4px" },
  loading: { display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"#6B7280", fontSize:"1.2rem" },
};