import { useState } from "react";
import EntryItem   from "../entry/EntryItem";
import AddEntryForm from "../entry/AddEntryForm";

export default function BottomSheet({ day, month, year, entries, accounts, onClose, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const date = new Date(year, month - 1, day);
  const dateStr = date.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" });
  const total = entries.filter(e => !e.is_income).reduce((s, e) => s + e.amount, 0);
  const income = entries.filter(e => e.is_income).reduce((s, e) => s + e.amount, 0);

  const handleAdd = (form) => {
    onAdd(form);
    setShowForm(false);
  };

  return (
    <>
      {/* overlay */}
      <div onClick={onClose} style={s.overlay} />

      {/* sheet */}
      <div style={s.sheet}>

        {/* handle */}
        <div style={s.handle} />

        {/* header */}
        <div style={s.head}>
          <div>
            <p style={s.dateStr}>{dateStr}</p>
            <div style={s.summaryRow}>
              {total > 0  && <span style={s.expense}>-฿{total.toLocaleString()}</span>}
              {income > 0 && <span style={s.incomeTag}>+฿{income.toLocaleString()}</span>}
            </div>
          </div>
          <button onClick={() => setShowForm(v => !v)} style={s.addBtn}>
            {showForm ? "✕" : "+ Add"}
          </button>
        </div>

        {/* form */}
        {showForm && <AddEntryForm accounts={accounts} onSave={handleAdd} />}

        {/* entries */}
        <div style={s.entries}>
          {entries.length === 0 && !showForm && (
            <div style={s.empty}>
              <span style={s.emptyEmoji}>📝</span>
              <p>No entries yet. Tap "+ Add" to log something!</p>
            </div>
          )}
          {entries.map(e => (
            <EntryItem key={e.id} entry={e} accounts={accounts} onDelete={onDelete} />
          ))}
        </div>

      </div>
    </>
  );
}

const s = {
  overlay:    { position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200 },
  sheet:      { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:"480px", background:"#fff", borderRadius:"20px 20px 0 0", padding:"12px 20px 32px", zIndex:201, maxHeight:"80vh", overflowY:"auto" },
  handle:     { width:"40px", height:"4px", background:"#E2E8F0", borderRadius:"2px", margin:"0 auto 16px" },
  head:       { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" },
  dateStr:    { margin:"0 0 4px", fontWeight:"700", color:"#1A2E44", fontSize:"1rem" },
  summaryRow: { display:"flex", gap:"8px" },
  expense:    { fontSize:"0.85rem", fontWeight:"700", color:"#EF4444" },
  incomeTag:  { fontSize:"0.85rem", fontWeight:"700", color:"#10B981" },
  addBtn:     { padding:"8px 16px", background:"#2563EB", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"600", fontSize:"0.85rem" },
  entries:    { marginTop:"8px" },
  empty:      { textAlign:"center", padding:"24px", color:"#9CA3AF" },
  emptyEmoji: { fontSize:"2rem", display:"block", marginBottom:"8px" },
};