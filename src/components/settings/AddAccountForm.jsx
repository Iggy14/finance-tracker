import { useState } from "react";
import { supabase } from "../../supabase";

export default function AddAccountForm({ user, onSaved }) {
  const [form, setForm] = useState({ name: "", balance: "", budget_per_day: "" });
  const [saving, setSaving] = useState(false);

  const update = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const save = async () => {
    if (!form.name) return;
    setSaving(true);
    await supabase.from("accounts").insert({
      user_id:        user.id,
      name:           form.name,
      balance:        parseFloat(form.balance)        || 0,
      budget_per_day: parseFloat(form.budget_per_day) || 0,
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div style={s.card}>
      <Field label="Account Name *"      placeholder='e.g. Food Account'  value={form.name}           onChange={update("name")} />
      <Field label="Opening Balance (฿)" placeholder='e.g. 5000'          value={form.balance}        onChange={update("balance")}        type="number" />
      <Field label="Daily Budget (฿)"    placeholder='e.g. 170 (optional)' value={form.budget_per_day} onChange={update("budget_per_day")} type="number" />
      <button onClick={save} disabled={saving} style={s.btn}>
        {saving ? "Saving..." : "Save Account"}
      </button>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={s.input} />
    </div>
  );
}

const s = {
  card:  { background:"#F8FAFC", borderRadius:"12px", padding:"16px", marginBottom:"14px", border:"1.5px dashed #BFDBFE" },
  field: { marginBottom:"10px" },
  label: { display:"block", fontSize:"0.75rem", fontWeight:"600", color:"#64748B", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"4px" },
  input: { width:"100%", padding:"10px 12px", border:"1.5px solid #E2E8F0", borderRadius:"8px", fontSize:"0.9rem", outline:"none", boxSizing:"border-box" },
  btn:   { width:"100%", padding:"10px", background:"#10B981", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"600", fontSize:"0.9rem" },
};