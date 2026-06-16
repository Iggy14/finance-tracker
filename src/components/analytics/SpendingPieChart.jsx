import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORIES } from '../../utils/categories';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#6B7280'];

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

export default function SpendingPieChart({ entries }) {
  const expenses = entries.filter(e => !e.is_income);

  const categoryTotals = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div style={s.wrapper}>
      <div style={s.title}>Spending by Category</div>
      {data.length === 0 ? (
        <div style={s.empty}>No expenses this month</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `฿${value.toLocaleString()}`} />
            <Legend
              formatter={(value) => <span style={{ fontSize: '12px', color: '#1A2E44' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}