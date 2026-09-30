import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./components/layout/Auth";
import Navbar from "./components/layout/Navbar";
import BottomNav from "./components/layout/BottomNav.jsx";
import CalendarPage from "./pages/CalendarPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import AppShell from "./components/layout/AppShell";

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-svh items-center justify-center text-lg text-slate-600">
          Loading...
        </div>
      </AppShell>
    );
  }
  if (!user) return <Auth />;

  return (
    <AppShell>
      <Navbar user={user} />
      <div className="relative pt-1 pb-[110px]">
        {page === "calendar"   && <CalendarPage  user={user} />}
        {page === "analytics"  && <AnalyticsPage user={user} />}
        {page === "settings"   && <SettingsPage  user={user} />}
      </div>
      <BottomNav page={page} setPage={setPage} />
    </AppShell>
  );
}
