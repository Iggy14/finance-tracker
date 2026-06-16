import { useState } from "react";
import { supabase } from "../../supabase";

export default function AccountCard({ account, onDelete, onUpdated }) {
  const [editing, setEditing]   = useState(false);
  const [balance, setBalance]   = useState(account.balance);
  const [budget,  setBudget]    = useState(account.budget_per_day);
  const [saving,  setSaving]    = useState(false);

  const save = async () => {
    setSaving(true);
    await supabase.from("accounts").update({
      balance:        parseFloat(balance) || 0,
      budget_per_day: parseFloat(budget)  || 0,
    }).eq("id", account.id);
    setSaving(false);
    setEditing(false);
    onUpdated();
  };

  return (
    <div style={s.card}>
      <div style={s.top}>
        <div style={s.iconWrap}>
          <span style={s.icon}>🏦</span>
        </div>
        <div style={s.info}>
          <p style={s.name}>{account.name}</p>
          {!editing && (
            <>
              <p style={s.balance}>฿{account.balance.toLocaleString()}</p>
              {account.budget_per_day > 0 && (
                <p style={s.budget}>฿{account.budget_per_day}/day budget</p>
              )}
            </>
          )}
        </div>
        <div style={s.actions}>
          <button onClick={() => setEditing(v => !v)} style={s.editBtn}>
            {editing ? "Cancel" : "Edit"}
          </button>
          <button onClick={() => onDelete(account.id)} style={s.delBtn}>🗑️</button>
        </div>
      </div>

      {editing && (
        <div style={s.editForm}>
          <div style={s.editRow}>
            <div style={s.editField}>
              <label style={s.label}>Balance (฿)</label>
              <input type="number" value={balance} onChange={e => setBalance(e.target.value)} style={s.input} />
            </div>
            <div style={s.editField}>
              <label style={s.label}>Daily Budget (฿)</label>
              <input type="number" value={budget} onChange={e => setBudget(e.target.value)} style={s.input} />
            </div>
          </div>
          <button onClick={save} disabled={saving} style={s.saveBtn}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

const s = {
  card:      { background:"#F8FAFC", borderRadius:"12px", padding:"14px", marginBottom:"10px", border:"1px solid #E2E8F0" },
  top:       { display:"flex", alignItems:"flex-start", gap:"12px" },
  iconWrap:  { width:"40px", height:"40px", background:"#EFF6FF", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  icon:      { fontSize:"1.2rem" },
  info:      { flex:1 },
  name:      { margin:"0 0 2px", fontWeight:"700", color:"#1A2E44", fontSize:"0.95rem" },
  balance:   { margin:"0 0 2px", color:"#2563EB", fontWeight:"700", fontSize:"1.1rem" },
  budget:    { margin:0, color:"#10B981", fontSize:"0.78rem" },
  actions:   { display:"flex", gap:"6px", alignItems:"center" },
  editBtn:   { padding:"5px 10px", background:"#EFF6FF", color:"#2563EB", border:"none", borderRadius:"6px", cursor:"pointer", fontSize:"0.78rem", fontWeight:"600" },
  delBtn:    { background:"none", border:"none", cursor:"pointer", fontSize:"1rem" },
  editForm:  { marginTop:"12px", paddingTop:"12px", borderTop:"1px solid #E2E8F0" },
  editRow:   { display:"flex", gap:"10px", marginBottom:"10px" },
  editField: { flex:1 },
  label:     { display:"block", fontSize:"0.72rem", fontWeight:"600", color:"#64748B", textTransform:"uppercase", marginBottom:"4px" },
  input:     { width:"100%", padding:"8px 10px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"0.9rem", outline:"none", boxSizing:"border-box" },
  saveBtn:   { width:"100%", padding:"9px", background:"#2563EB", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"600" },
};