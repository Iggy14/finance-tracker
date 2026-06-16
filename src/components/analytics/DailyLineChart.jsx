import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

const BUDGET = 170;

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
    marginBottom: '4px',
  },
  sub: {
    fontSize: '11px',
    color: '#6B7280',
    marginBottom: '12px',
  },
  empty: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: '13px',
    padding: '32px 0',
  },
  legend: {
    display: 'flex',
    gap: '16px',
    marginTop: '10px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#6B7280',
  },
  dot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
  }),
};

export default function DailyLineChart({ entries, month, year }) {
  // Only Food & Drink category expenses
  const foodExpenses = entries.filter(e => !e.is_income && e.category === 'Food & Drink');

  const dailyTotals = {};
  foodExpenses.forEach(e => {
    dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
  });

  // Build data for every day in the month
  const daysInMonth = new Date(year, month, 0).getDate();
  const data = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    data.push({
      day: d,
      spent: dailyTotals[dateStr] || 0,
    });
  }

  const hasData = data.some(d => d.spent > 0);

  return (
    <div style={s.wrapper}>
      <div style={s.title}>Daily Food Spend</div>
      <div style={s.sub}>vs ฿170/day budget</div>
      {!hasData ? (
        <div style={s.empty}>No food expenses this month</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Tooltip formatter={(value) => `฿${value.toLocaleString()}`} labelFormatter={(d) => `Day ${d}`} />
              <ReferenceLine y={BUDGET} stroke="#EF4444" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="spent"
                stroke="#2563EB"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div style={s.legend}>
            <div style={s.legendItem}><div style={s.dot('#2563EB')} /> Daily spend</div>
            <div style={s.legendItem}><div style={{ ...s.dot('#EF4444'), borderRadius: '2px' }} /> ฿170 budget</div>
          </div>
        </>
      )}
    </div>
  );
}