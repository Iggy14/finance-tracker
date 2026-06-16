import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function RentSetting({ user, accounts }) {
  const now    = new Date();
  const [rent,      setRent]      = useState("");
  const [accountId, setAccountId] = useState("");
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => { fetchRent(); }, []);

  const fetchRent = async () => {
    const { data } = await supabase
      .from("monthly_settings")
      .select("rent, account_id")
      .eq("user_id", user.id)
      .eq("month",   now.getMonth() + 1)
      .eq("year",    now.getFullYear())
      .single();
    if (data) {
      setRent(data.rent);
      setAccountId(data.account_id || "");
    }
  };

  const save = async () => {
    setSaving(true);
    await supabase.from("monthly_settings").upsert({
      user_id:    user.id,
      month:      now.getMonth() + 1,
      year:       now.getFullYear(),
      rent:       parseFloat(rent) || 0,
      account_id: accountId || null,
    }, { onConflict: "user_id,month,year" });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={s.section}>
      <span style={s.sectionTitle}>🏠 Monthly Rent</span>
      <p style={s.hint}>
        Set your rent for {now.toLocaleString("default", { month:"long", year:"numeric" })}
      </p>

      {/* show saved state */}
      {rent && accountId && !editing ? (
        <div style={s.savedRow}>
          <div style={s.savedInfo}>
            <span style={s.savedAmount}>฿{parseFloat(rent).toLocaleString()}</span>
            <span style={s.savedAccount}>
              from {accounts.find(a => a.id === accountId)?.name || "unknown account"}
            </span>
          </div>
          <button onClick={() => setEditing(true)} style={s.editBtn}>Edit</button>
        </div>
      ) : (
        <>
          <div style={s.field}>
            <label style={s.label}>Rent Amount (฿)</label>
            <input
              type="number"
              placeholder="e.g. 4500"
              value={rent}
              onChange={e => setRent(e.target.value)}
              style={s.input}
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Deduct from Account</label>
            {accounts.length === 0 ? (
              <p style={s.warn}>⚠️ Add an account first before setting rent.</p>
            ) : (
              <select
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
                style={s.select}
              >
                <option value="">— Select account —</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            )}
          </div>

          <div style={s.btnRow}>
            {editing && (
              <button onClick={() => setEditing(false)} style={s.cancelBtn}>Cancel</button>
            )}
            <button
              onClick={save}
              disabled={saving || accounts.length === 0}
              style={{ ...s.btn, background: saved ? "#10B981" : "#2563EB", opacity: accounts.length === 0 ? 0.5 : 1 }}
            >
              {saved ? "✓ Saved!" : saving ? "Saving..." : "Save Rent"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  section:      { background:"#fff", borderRadius:"16px", padding:"16px", marginBottom:"16px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" },
  sectionTitle: { fontWeight:"700", color:"#1A2E44", fontSize:"0.95rem", display:"block", marginBottom:"4px" },
  hint:         { color:"#9CA3AF", fontSize:"0.8rem", margin:"0 0 14px" },
  field:        { marginBottom:"12px" },
  label:        { display:"block", fontSize:"0.75rem", fontWeight:"600", color:"#64748B", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"4px" },
  input:        { width:"100%", padding:"10px 12px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"0.9rem", outline:"none", boxSizing:"border-box" },
  select:       { width:"100%", padding:"10px 12px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"0.9rem", outline:"none", boxSizing:"border-box", background:"#fff", cursor:"pointer" },
  warn:         { color:"#F59E0B", fontSize:"0.82rem", margin:"4px 0 0", fontWeight:"600" },
  btn:          { width:"100%", padding:"10px", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"600", fontSize:"0.9rem", transition:"background 0.2s" },
  savedRow:    { display:"flex", justifyContent:"space-between", alignItems:"center", background:"#F0FDF4", borderRadius:"10px", padding:"12px 14px" },
savedInfo:   { display:"flex", flexDirection:"column", gap:"2px" },
savedAmount: { fontWeight:"800", color:"#10B981", fontSize:"1.2rem" },
savedAccount:{ fontSize:"0.78rem", color:"#6B7280" },
editBtn:     { padding:"6px 14px", background:"#EFF6FF", color:"#2563EB", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"600", fontSize:"0.82rem" },
btnRow:      { display:"flex", gap:"10px" },
cancelBtn:   { flex:1, padding:"10px", background:"#F1F5F9", color:"#64748B", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"600" },
};