export default function BalanceHeader({ accounts }) {
  return (
    <div style={s.wrap}>
      {accounts.map(acc => (
        <div key={acc.id} style={s.card}>
          <span style={s.name}>{acc.name}</span>
          <span style={{ ...s.amount, color: acc.balance >= 0 ? "#10B981" : "#EF4444" }}>
            ฿{acc.balance.toLocaleString()}
          </span>
          {acc.budget_per_day > 0 && (
            <span style={s.budget}>฿{acc.budget_per_day}/day</span>
          )}
        </div>
      ))}
    </div>
  );
}

const s = {
  wrap:   { display:"flex", gap:"10px", padding:"12px 16px", background:"#1A2E44", overflowX:"auto" },
  card:   { flex:1, minWidth:"120px", background:"rgba(255,255,255,0.1)", borderRadius:"12px", padding:"10px 14px", display:"flex", flexDirection:"column", gap:"2px" },
  name:   { fontSize:"0.72rem", color:"#BFDBFE", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.05em" },
  amount: { fontSize:"1.2rem", fontWeight:"800", color:"#fff" },
  budget: { fontSize:"0.7rem", color:"#94A3B8" },
};