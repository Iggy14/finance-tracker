import { useState } from "react";
import { CATEGORIES, DEFAULT_CATEGORY } from "../../utils/categories";

export default function AddEntryForm({ accounts, onSave }) {
  const [form, setForm] = useState({
    item:       "",
    amount:     "",
    category:   DEFAULT_CATEGORY,
    account_id: accounts[0]?.id || "",
    is_income:  false,
    note:       "",
  });

  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSave = () => {
    if (!form.item || !form.amount || !form.account_id) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
    setForm({ item:"", amount:"", category:DEFAULT_CATEGORY, account_id:accounts[0]?.id || "", is_income:false, note:"" });
  };

  return (
    <div style={s.wrap}>

      {/* income toggle */}
      <div style={s.toggleRow}>
        <button
          onClick={() => setForm(p => ({ ...p, is_income: false }))}
          style={{ ...s.toggleBtn, background: !form.is_income ? "#EF4444" : "#F1F5F9", color: !form.is_income ? "#fff" : "#6B7280" }}>
          💸 Expense
        </button>
        <button
          onClick={() => setForm(p => ({ ...p, is_income: true }))}
          style={{ ...s.toggleBtn, background: form.is_income ? "#10B981" : "#F1F5F9", color: form.is_income ? "#fff" : "#6B7280" }}>
          💰 Income
        </button>
      </div>

      {/* item + amount */}
      <div style={s.row}>
        <div style={{ ...s.field, flex:2 }}>
          <label style={s.label}>Item *</label>
          <input placeholder="e.g. Noodles" value={form.item} onChange={update("item")} style={s.input} />
        </div>
        <div style={{ ...s.field, flex:1 }}>
          <label style={s.label}>Amount (฿) *</label>
          <input type="number" placeholder="0" value={form.amount} onChange={update("amount")} style={s.input} />
        </div>
      </div>

      {/* category */}
      <div style={s.field}>
        <label style={s.label}>Category</label>
        <div style={s.catGrid}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => setForm(p => ({ ...p, category: cat.key }))}
              style={{ ...s.catBtn, background: form.category === cat.key ? cat.color : "#F1F5F9", color: form.category === cat.key ? "#fff" : "#6B7280" }}>
              {cat.emoji} {cat.key}
            </button>
          ))}
        </div>
      </div>

      {/* account */}
      <div style={s.field}>
        <label style={s.label}>Account *</label>
        <div style={s.accRow}>
          {accounts.map(acc => (
            <button key={acc.id} onClick={() => setForm(p => ({ ...p, account_id: acc.id }))}
              style={{ ...s.accBtn, background: form.account_id === acc.id ? "#2563EB" : "#F1F5F9", color: form.account_id === acc.id ? "#fff" : "#6B7280" }}>
              🏦 {acc.name}
            </button>
          ))}
        </div>
      </div>

      {/* note */}
      <div style={s.field}>
        <label style={s.label}>Note (optional)</label>
        <input placeholder="Any extra detail..." value={form.note} onChange={update("note")} style={s.input} />
      </div>

      <button onClick={handleSave} style={s.saveBtn}>Save Entry</button>
    </div>
  );
}

const s = {
  wrap:      { padding:"4px 0 16px" },
  toggleRow: { display:"flex", gap:"8px", marginBottom:"14px" },
  toggleBtn: { flex:1, padding:"10px", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"700", fontSize:"0.9rem", transition:"all 0.2s" },
  row:       { display:"flex", gap:"10px" },
  field:     { marginBottom:"12px" },
  label:     { display:"block", fontSize:"0.72rem", fontWeight:"600", color:"#64748B", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"4px" },
  input:     { width:"100%", padding:"10px 12px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"0.9rem", outline:"none", boxSizing:"border-box" },
  catGrid:   { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"6px" },
  catBtn:    { padding:"8px 6px", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"0.78rem", fontWeight:"600", textAlign:"left", transition:"all 0.15s" },
  accRow:    { display:"flex", gap:"8px", flexWrap:"wrap" },
  accBtn:    { padding:"8px 14px", border:"none", borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontWeight:"600", transition:"all 0.15s" },
  saveBtn:   { width:"100%", padding:"12px", background:"#2563EB", color:"#fff", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"700", fontSize:"0.95rem" },
};