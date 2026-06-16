import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import SummaryCards from '../components/analytics/SummaryCards';
import SpendingPieChart from '../components/analytics/SpendingPieChart';
import MonthlyBarChart from '../components/analytics/MonthlyBarChart';
import DailyLineChart from '../components/analytics/DailyLineChart';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const s = {
  page: {
    maxWidth: '480px',
    margin: '0 auto',
    paddingBottom: '80px',
    background: '#F9FAFB',
    minHeight: '100vh',
  },
  hero: {
    background: 'linear-gradient(135deg, #1A2E44 0%, #2563EB 100%)',
    padding: '24px 16px 28px',
    color: '#fff',
  },
  heroTitle: {
    fontSize: '22px',
    fontWeight: '800',
    marginBottom: '12px',
  },
  monthNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '12px',
    padding: '8px 12px',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 8px',
  },
  monthLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px 0',
  },
  loading: {
    textAlign: 'center',
    padding: '60px 0',
    color: '#6B7280',
    fontSize: '14px',
  },
};

export default function AnalyticsPage({ user }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [year, setYear] = useState(now.getFullYear());
  const [entries, setEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);

      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const daysInMonth = new Date(year, month, 0).getDate();
      const end = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

      const [{ data: entriesData }, { data: accountsData }] = await Promise.all([
        supabase
          .from('entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', start)
          .lte('date', end)
          .order('date', { ascending: true }),
        supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id),
      ]);

      setEntries(entriesData || []);
      setAccounts(accountsData || []);
      setLoading(false);
    };

    fetchData();
  }, [user, month, year]);

  const goToPrevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const goToNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.heroTitle}>Analytics</div>
        <div style={s.monthNav}>
          <button style={s.navBtn} onClick={goToPrevMonth}>‹</button>
          <span style={s.monthLabel}>{MONTH_NAMES[month - 1]} {year}</span>
          <button style={s.navBtn} onClick={goToNextMonth}>›</button>
        </div>
      </div>

      {loading ? (
        <div style={s.loading}>Loading...</div>
      ) : (
        <div style={s.section}>
          <SummaryCards entries={entries} accounts={accounts} />
          <SpendingPieChart entries={entries} />
          <DailyLineChart entries={entries} month={month} year={year} />
          <MonthlyBarChart user={user} />
        </div>
      )}
    </div>
  );
}