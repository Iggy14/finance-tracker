import { useState, useEffect }  from "react";
import { supabase }             from "../supabase";
import BalanceHeader            from "../components/calendar/BalanceHeader";
import CalendarGrid             from "../components/calendar/CalendarGrid";
import BottomSheet              from "../components/calendar/BottomSheet";

export default function CalendarPage({ user }) {
  const today        = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [accounts,  setAccounts]  = useState([]);
  const [entries,   setEntries]   = useState([]);
  const [activeDay, setActiveDay] = useState(null);

  useEffect(() => { fetchAccounts(); }, []);
  useEffect(() => { fetchEntries();  }, [year, month]);

  const fetchAccounts = async () => {
    const { data } = await supabase
      .from("accounts").select("*").eq("user_id", user.id);
    setAccounts(data || []);
  };

  const fetchEntries = async () => {
    const from = `${year}-${String(month).padStart(2,"0")}-01`;
    const to   = `${year}-${String(month).padStart(2,"0")}-31`;
    const { data } = await supabase
      .from("entries").select("*")
      .eq("user_id", user.id)
      .gte("date", from).lte("date", to);
    setEntries(data || []);
  };

  const addEntry = async (form) => {
    const day  = String(activeDay).padStart(2, "0");
    const mon  = String(month).padStart(2, "0");
    const date = `${year}-${mon}-${day}`;
    const { data } = await supabase.from("entries").insert({
      ...form, user_id: user.id, date,
    }).select().single();

    // update account balance
    const acc = accounts.find(a => a.id === form.account_id);
    if (acc) {
      const newBalance = form.is_income
        ? acc.balance + form.amount
        : acc.balance - form.amount;
      await supabase.from("accounts").update({ balance: newBalance }).eq("id", acc.id);
    }

    fetchEntries();
    fetchAccounts();
  };

  const deleteEntry = async (id) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      const acc = accounts.find(a => a.id === entry.account_id);
      if (acc) {
        const newBalance = entry.is_income
          ? acc.balance - entry.amount
          : acc.balance + entry.amount;
        await supabase.from("accounts").update({ balance: newBalance }).eq("id", acc.id);
      }
    }
    await supabase.from("entries").delete().eq("id", id);
    fetchEntries();
    fetchAccounts();
  };

  // group entries by day number
  const entriesByDay = entries.reduce((acc, e) => {
    const day = parseInt(e.date.split("-")[2]);
    acc[day]  = [...(acc[day] || []), e];
    return acc;
  }, {});

  const activeDayEntries = activeDay ? (entriesByDay[activeDay] || []) : [];

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y+1); } else setMonth(m => m+1); };

  return (
    <div style={s.page}>

      <BalanceHeader accounts={accounts} />

      {/* month navigator */}
      <div style={s.nav}>
        <button onClick={prevMonth} style={s.navBtn}>‹</button>
        <span style={s.navTitle}>{MONTHS[month-1]} {year}</span>
        <button onClick={nextMonth} style={s.navBtn}>›</button>
      </div>

      {/* legend */}
      <div style={s.legend}>
        {[["#10B981","Under budget"],["#F59E0B","Near budget"],["#EF4444","Over budget"]].map(([color, label]) => (
          <div key={label} style={s.legendItem}>
            <div style={{ ...s.legendDot, background: color }} />
            <span style={s.legendText}>{label}</span>
          </div>
        ))}
      </div>

      <CalendarGrid
        year={year} month={month}
        entriesByDay={entriesByDay}
        accounts={accounts}
        onDayTap={setActiveDay}
      />

      {activeDay && (
        <BottomSheet
          day={activeDay} month={month} year={year}
          entries={activeDayEntries}
          accounts={accounts}
          onClose={() => setActiveDay(null)}
          onAdd={addEntry}
          onDelete={deleteEntry}
        />
      )}
    </div>
  );
}

const s = {
  page:       { minHeight:"100vh", background:"#F8FAFC" },
  nav:        { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px 4px" },
  navBtn:     { background:"none", border:"none", fontSize:"1.5rem", cursor:"pointer", color:"#2563EB", fontWeight:"700", padding:"0 8px" },
  navTitle:   { fontWeight:"800", color:"#1A2E44", fontSize:"1.1rem" },
  legend:     { display:"flex", gap:"12px", padding:"6px 20px 0", justifyContent:"center" },
  legendItem: { display:"flex", alignItems:"center", gap:"4px" },
  legendDot:  { width:"8px", height:"8px", borderRadius:"50%" },
  legendText: { fontSize:"0.7rem", color:"#94A3B8" },
};