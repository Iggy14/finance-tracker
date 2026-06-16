export default function DayCell({ day, isToday, dotColor, isEmpty, onTap }) {
  return (
    <div onClick={() => !isEmpty && onTap(day)} style={{
      ...s.cell,
      background:  isToday ? "#2563EB" : "#fff",
      cursor:      isEmpty ? "default" : "pointer",
      opacity:     isEmpty ? 0 : 1,
    }}>
      <span style={{ ...s.num, color: isToday ? "#fff" : "#1A2E44" }}>{isEmpty ? "" : day}</span>
      {dotColor && <div style={{ ...s.dot, background: dotColor }} />}
    </div>
  );
}

const s = {
  cell: { borderRadius:"10px", padding:"8px 4px", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", minHeight:"48px", justifyContent:"center", boxShadow:"0 1px 3px rgba(0,0,0,0.06)", transition:"transform 0.1s" },
  num:  { fontSize:"0.9rem", fontWeight:"600" },
  dot:  { width:"6px", height:"6px", borderRadius:"50%" },
};