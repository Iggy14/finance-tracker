import { useState, useEffect } from "react";
import AccountCard from "../components/settings/AccountCard";
import AddAccountForm from "../components/settings/AddAccountForm";
import RentSetting from "../components/settings/RentSetting";
import { supabase } from "../supabase";

export default function SettingsPage({ user }) {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    const { data } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at");
    setAccounts(data || []);
    setLoading(false);
  };

  const deleteAccount = async (id) => {
    await supabase.from("accounts").delete().eq("id", id);
    fetchAccounts();
  };

  return (
    <div style={s.page}>

      {/* header */}
      <div style={s.hero}>
        <div>
          <h1 style={s.title}>Settings ⚙️</h1>
          <p style={s.sub}>Manage your accounts and preferences</p>
        </div>
      </div>

      <div style={s.body}>

        {/* accounts section */}
        <div style={s.section}>
          <div style={s.sectionHead}>
            <span style={s.sectionTitle}>💳 Your Accounts</span>
            <button onClick={() => setShowForm(v => !v)} style={s.addBtn}>
              {showForm ? "✕ Cancel" : "+ Add Account"}
            </button>
          </div>

          {showForm && (
            <AddAccountForm
              user={user}
              onSaved={() => { fetchAccounts(); setShowForm(false); }}
            />
          )}

          {loading ? (
            <p style={s.hint}>Loading...</p>
          ) : accounts.length === 0 ? (
            <div style={s.empty}>
              <span style={s.emptyEmoji}>🏦</span>
              <p>No accounts yet. Add your first one!</p>
            </div>
          ) : (
            accounts.map(acc => (
              <AccountCard key={acc.id} account={acc} onDelete={deleteAccount} onUpdated={fetchAccounts} />
            ))
          )}
        </div>

        {/* rent section */}
        <RentSetting user={user} accounts={accounts} />

        {/* profile section */}
        <div style={s.section}>
          <span style={s.sectionTitle}>👤 Profile</span>
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
  page:        { minHeight:"100vh", background:"#F8FAFC" },
  hero:        { background:"linear-gradient(135deg,#1A2E44,#2563EB)", padding:"24px 20px 28px" },
  title:       { margin:"0 0 4px", color:"#fff", fontSize:"1.6rem", fontWeight:"800" },
  sub:         { margin:0, color:"#BFDBFE", fontSize:"0.85rem" },
  body:        { padding:"16px" },
  section:     { background:"#fff", borderRadius:"16px", padding:"16px", marginBottom:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" },
  sectionHead: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" },
  sectionTitle:{ fontWeight:"700", color:"#1A2E44", fontSize:"0.95rem" },
  addBtn:      { padding:"7px 14px", background:"#2563EB", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"0.8rem", fontWeight:"600" },
  hint:        { color:"#9CA3AF", fontSize:"0.85rem", textAlign:"center" },
  empty:       { textAlign:"center", padding:"24px", color:"#9CA3AF" },
  emptyEmoji:  { fontSize:"2rem", display:"block", marginBottom:"8px" },
  profileCard: { display:"flex", alignItems:"center", gap:"14px", padding:"12px", background:"#F8FAFC", borderRadius:"12px", marginTop:"12px" },
  avatar:      { width:"48px", height:"48px", borderRadius:"50%" },
  profileName: { margin:"0 0 2px", fontWeight:"700", color:"#1A2E44", fontSize:"0.95rem" },
  profileEmail:{ margin:0, color:"#6B7280", fontSize:"0.8rem" },
};