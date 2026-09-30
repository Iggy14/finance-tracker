import { countsTowardBudget } from '../../utils/calculations';
import { DEFAULT_CATEGORY } from '../../utils/categories';

const s = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '0 16px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  label: {
    fontSize: '11px',
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  value: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1A2E44',
  },
  sub: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '2px',
  },
};

export default function SummaryCards({ entries, accounts }) {
  const expenses = entries.filter(e => !e.is_income);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const daysWithSpend = [...new Set(expenses.map(e => e.date))].length;
  const avgPerDay = daysWithSpend > 0 ? totalSpent / daysWithSpend : 0;

  // days where Food & Drink paid from the budget account (KBank) exceeded the daily budget
  const budgetAccount = accounts.find(a => a.budget_per_day > 0);
  const budget = budgetAccount?.budget_per_day || 170;
  const foodByDay = {};
  expenses.filter(e => countsTowardBudget(e, budgetAccount?.id)).forEach(e => {
    foodByDay[e.date] = (foodByDay[e.date] || 0) + e.amount;
  });
  const daysOver = Object.values(foodByDay).filter(total => total > budget).length;

  const categoryTotals = {};
  // "Others" has no specific name, so it can't be the top category
  expenses.filter(e => e.category !== DEFAULT_CATEGORY).forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const biggestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    { label: 'Total Spent', value: `฿${totalSpent.toLocaleString()}`, sub: 'this month', accent: '#EF4444' },
    { label: 'Avg / Day', value: `฿${Math.round(avgPerDay).toLocaleString()}`, sub: 'on spending days', accent: '#2563EB' },
    { label: 'Days Over Budget', value: String(daysOver), sub: `over ฿${budget.toLocaleString()}/day budget`, accent: '#10B981' },
    { label: 'Top Category', value: biggestCategory ? biggestCategory[0] : '—', sub: biggestCategory ? `฿${biggestCategory[1].toLocaleString()}` : 'no data', accent: '#F59E0B' },
  ];

  return (
    <div style={s.grid}>
      {cards.map((card) => (
        <div key={card.label} style={s.card}>
          <div style={{ ...s.label, color: card.accent }}>{card.label}</div>
          <div style={s.value}>{card.value}</div>
          <div style={s.sub}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}