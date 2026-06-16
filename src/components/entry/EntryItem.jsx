import { CATEGORIES } from "../../utils/categories";

export default function EntryItem({ entry, accounts, onDelete }) {
  const cat     = CATEGORIES.find(c => c.key === entry.category) || CATEGORIES[CATEGORIES.length - 1];
  const account = accounts.find(a => a.id === entry.account_id);

  return (
    <div style={s.row}>
      <div style={{ ...s.catDot, background: cat.color }}>
        <span style={s.catEmoji}>{cat.emoji}</span>
      </div>
      <div style={s.info}>
        <span style={s.item}>{entry.item}</span>
        <span style={s.meta}>{cat.key} · {account?.name || "unknown"}</span>
      </div>
      <div style={s.right}>
        <span style={{ ...s.amount, color: entry.is_income ? "#10B981" : "#EF4444" }}>
          {entry.is_income ? "+" : "-"}฿{entry.amount.toLocaleString()}
        </span>
        <button onClick={() => onDelete(entry.id)} style={s.del}>✕</button>
      </div>
    </div>
  );
}

const s = {
  row:      { display:"flex", alignItems:"center", gap:"10px", padding:"10px 0", borderBottom:"1px solid #F1F5F9" },
  catDot:   { width:"36px", height:"36px", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  catEmoji: { fontSize:"1rem" },
  info:     { flex:1 },
  item:     { display:"block", fontWeight:"600", color:"#1A2E44", fontSize:"0.9rem" },
  meta:     { fontSize:"0.72rem", color:"#94A3B8" },
  right:    { display:"flex", alignItems:"center", gap:"8px" },
  amount:   { fontWeight:"700", fontSize:"0.95rem" },
  del:      { background:"none", border:"none", color:"#CBD5E1", cursor:"pointer", fontSize:"0.8rem" },
};