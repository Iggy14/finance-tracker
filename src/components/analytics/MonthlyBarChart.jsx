import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '../../supabase';
import { useEffect, useState } from 'react';

const s = {
  wrapper: {
    background: '#fff',
    borderRadius: '16px',
    margin: '0 16px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1A2E44',
    marginBottom: '12px',
  },
  empty: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: '13px',
    padding: '32px 0',
  },
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function MonthlyBarChart({ user }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchLast6Months = async () => {
      const months = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: MONTH_NAMES[d.getMonth()] });
      }

      const results = await Promise.all(
        months.map(async ({ year, month, label }) => {
          const start = `${year}-${String(month).padStart(2, '0')}-01`;
          const end = new Date(year, month, 0);
          const endStr = `${year}-${String(month).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

          const { data: entries } = await supabase
            .from('entries')
            .select('amount, is_income')
            .eq('user_id', user.id)
            .eq('is_income', false)
            .gte('date', start)
            .lte('date', endStr);

          const total = (entries || []).reduce((sum, e) => sum + e.amount, 0);
          return { label, total };
        })
      );
      setData(results);
    };
    fetchLast6Months();
  }, [user]);

  return (
    <div style={s.wrapper}>
      <div style={s.title}>Monthly Spending (Last 6 Months)</div>
      {data.length === 0 ? (
        <div style={s.empty}>Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
            <Tooltip formatter={(value) => `฿${value.toLocaleString()}`} />
            <Bar dataKey="total" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}