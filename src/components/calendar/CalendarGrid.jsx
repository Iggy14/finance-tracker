import DayCell from "./DayCell";
import { dotColor } from "../../utils/calculations";

export default function CalendarGrid({ year, month, entriesByDay, accounts, onDayTap }) {
  const firstDay    = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const foodAccount = accounts.find(a => a.budget_per_day > 0);
  const budget      = foodAccount?.budget_per_day || 170;

  const days = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today    = new Date();

  return (
    <div style={s.wrap}>
      {/* weekday headers */}
      <div style={s.grid}>
        {WEEKDAYS.map(d => (
          <div key={d} style={s.weekday}>{d}</div>
        ))}
      </div>

      {/* day cells */}
      <div style={s.grid}>
        {days.map((day, i) => {
          const entries  = day ? (entriesByDay[day] || []) : [];
          const isToday  = day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();
          const color    = day ? dotColor(entries, budget) : null;
          return (
            <DayCell
              key={i}
              day={day}
              isToday={isToday}
              dotColor={color}
              isEmpty={!day}
              onTap={onDayTap}
            />
          );
        })}
      </div>
    </div>
  );
}

const s = {
  wrap:    { padding:"12px 16px" },
  grid:    { display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:"6px", marginBottom:"4px" },
  weekday: { textAlign:"center", fontSize:"0.7rem", fontWeight:"700", color:"#94A3B8", padding:"4px 0" },
};