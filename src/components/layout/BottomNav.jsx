const TABS = [
  { key: "calendar",  label: "Calendar",  icon: "📅" },
  { key: "analytics", label: "Analytics", icon: "📊" },
  { key: "settings",  label: "Settings",  icon: "⚙️" },
];

export default function BottomNav({ page, setPage }) {
  return (
    <div style={s.bar}>
      {TABS.map(tab => {
        const active = page === tab.key;
        return (
          <button key={tab.key} onClick={() => setPage(tab.key)} style={s.btn}>
            <div style={{ ...s.iconWrap, background: active ? "#EFF6FF" : "transparent" }}>
              <span style={s.icon}>{tab.icon}</span>
            </div>
            <span style={{ ...s.label, color: active ? "#2563EB" : "#9CA3AF", fontWeight: active ? "700" : "400" }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const s = {
  bar:      { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:"480px", background:"#fff", borderTop:"1px solid #E2E8F0", display:"flex", zIndex:100, paddingBottom:"env(safe-area-inset-bottom)" },
  btn:      { flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 0", background:"none", border:"none", cursor:"pointer", gap:"2px" },
  iconWrap: { width:"40px", height:"28px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"20px", transition:"background 0.2s" },
  icon:     { fontSize:"1.1rem" },
  label:    { fontSize:"0.7rem" },
};