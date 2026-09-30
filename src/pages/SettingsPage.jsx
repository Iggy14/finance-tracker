import { useState, useEffect, useCallback } from "react";
import { CreditCard, Landmark, User } from "lucide-react";
import AccountCard from "../components/settings/AccountCard";
import AddAccountForm from "../components/settings/AddAccountForm";
import { supabase } from "../supabase";

export default function SettingsPage({ user }) {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(true);

  const fetchAccounts = useCallback(async () => {
    const { data } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at");
    return data || [];
  }, [user.id]);

  const refreshAccounts = async () => setAccounts(await fetchAccounts());

  useEffect(() => {
    fetchAccounts().then(list => { setAccounts(list); setLoading(false); });
  }, [fetchAccounts]);

  const deleteAccount = async (id) => {
    await supabase.from("accounts").delete().eq("id", id);
    refreshAccounts();
  };

  return (
    <div style={s.page}>

      {/* header */}
      <div style={s.hero}>
        <div>
          <h1 style={s.title}>Settings</h1>
          <p style={s.sub}>Manage your accounts and preferences</p>
        </div>
      </div>

      <div style={s.body}>

        {/* accounts section */}
        <div style={s.section}>
          <div style={s.sectionHead}>
            <span style={s.sectionTitle} className="inline-flex items-center gap-2"><CreditCard className="size-4" /> Your Accounts</span>
            <button onClick={() => setShowForm(v => !v)} style={s.addBtn}>
              {showForm ? "✕ Cancel" : "+ Add Account"}
            </button>
          </div>

          {showForm && (
            <AddAccountForm
              user={user}
              onSaved={() => { refreshAccounts(); setShowForm(false); }}
            />
          )}

          {loading ? (
            <p style={s.hint}>Loading...</p>
          ) : accounts.length === 0 ? (
            <div style={s.empty}>
              <Landmark className="mx-auto mb-2 size-9 opacity-60" />
              <p>No accounts yet. Add your first one!</p>
            </div>
          ) : (
            accounts.map(acc => (
              <AccountCard key={acc.id} account={acc} onDelete={deleteAccount} onUpdated={refreshAccounts} />
            ))
          )}
        </div>

        {/* profile section */}
        <div style={s.section}>
          <span style={s.sectionTitle} className="inline-flex items-center gap-2"><User className="size-4" /> Profile</span>
          <div style={s.profileCard}>
            <img src={user.user_metadata?.avatar_url} alt="" style={s.avatar} />
            <div>
              <p style={s.profileName}>{user.user_metadata?.full_name}</p>
              <p style={s.profileEmail}>{user.email}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const s = {
  page:        {},
  hero:        { padding:"24px 20px 28px" },
  title:       { margin:"0 0 4px", color:"#1A2E44", fontSize:"1.6rem", fontWeight:"800", textAlign:"center" },
  sub:         { margin:0, color:"#E0F2FE", fontSize:"0.85rem", textAlign:"center" },
  body:        { padding:"16px" },
  section:     { background:"#fff", borderRadius:"16px", padding:"16px", marginBottom:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" },
  sectionHead: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" },
  sectionTitle:{ fontWeight:"700", color:"#1A2E44", fontSize:"0.95rem" },
  addBtn:      { padding:"7px 14px", background:"#2563EB", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"0.8rem", fontWeight:"600" },
  hint:        { color:"#9CA3AF", fontSize:"0.85rem", textAlign:"center" },
  empty:       { textAlign:"center", padding:"24px", color:"#9CA3AF" },
  profileCard: { display:"flex", alignItems:"center", gap:"14px", padding:"12px", background:"#F8FAFC", borderRadius:"12px", marginTop:"12px" },
  avatar:      { width:"48px", height:"48px", borderRadius:"50%" },
  profileName: { margin:"0 0 2px", fontWeight:"700", color:"#1A2E44", fontSize:"0.95rem" },
  profileEmail:{ margin:0, color:"#6B7280", fontSize:"0.8rem" },
};