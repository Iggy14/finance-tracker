import { useState, useEffect, useCallback } from "react";
import { supabase }             from "../supabase";
import BalanceCard              from "../components/calendar/BalanceCard";
import CalendarGrid             from "../components/calendar/CalendarGrid";
import BottomSheet              from "../components/calendar/BottomSheet";
import MiniSheet                from "../components/calendar/MiniSheet";
import { sortAccounts }         from "../utils/accounts";

const dateOf = (y, m, d) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export default function CalendarPage({ user }) {
  const today        = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [accounts,  setAccounts]  = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [entries,   setEntries]   = useState([]);
  const [activeDay, setActiveDay] = useState(null);

  const fetchAccounts = useCallback(async () => {
    const { data } = await supabase
      .from("accounts").select("*").eq("user_id", user.id);
    return sortAccounts(data || []);
  }, [user.id]);

  const fetchEntries = useCallback(async () => {
    const from = `${year}-${String(month).padStart(2,"0")}-01`;
    const to   = dateOf(year, month, new Date(year, month, 0).getDate());
    const { data } = await supabase
      .from("entries").select("*")
      .eq("user_id", user.id)
      .gte("date", from).lte("date", to);
    return data || [];
  }, [user.id, year, month]);

  const refreshAccounts = async () => setAccounts(await fetchAccounts());
  const refreshEntries  = async () => setEntries(await fetchEntries());

  useEffect(() => { fetchAccounts().then(list => { setAccounts(list); setAccountsLoading(false); }); }, [fetchAccounts]);
  useEffect(() => { fetchEntries().then(setEntries);   }, [fetchEntries]);

  const addEntry = async (form, date = dateOf(year, month, activeDay)) => {
    await supabase.from("entries").insert({
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

    refreshEntries();
    refreshAccounts();
  };

  const addMoney = (form) =>
    addEntry(form, dateOf(today.getFullYear(), today.getMonth() + 1, today.getDate()));

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
    refreshEntries();
    refreshAccounts();
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

      <BalanceCard accounts={accounts} loading={accountsLoading} onAddMoney={addMoney} />

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

      <MiniSheet user={user} />

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
  page:       { position:"relative" },
  nav:        { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px 4px" },
  navBtn:     { background:"none", border:"none", fontSize:"1.5rem", cursor:"pointer", color:"#2563EB", fontWeight:"700", padding:"0 8px" },
  navTitle:   { fontWeight:"800", color:"#1A2E44", fontSize:"1.1rem" },
  legend:     { display:"flex", gap:"12px", padding:"6px 20px 0", justifyContent:"center" },
  legendItem: { display:"flex", alignItems:"center", gap:"4px" },
  legendDot:  { width:"8px", height:"8px", borderRadius:"50%" },
  legendText: { fontSize:"0.7rem", color:"#94A3B8" },
};