// total spent on a given day
export function dailyTotal(entries) {
  return entries
    .filter(e => !e.is_income)
    .reduce((sum, e) => sum + e.amount, 0);
}

// dot color for calendar cell
export function dotColor(entries, budgetPerDay) {
  if (!entries.length) return null;
  const total = dailyTotal(entries);
  if (total <= budgetPerDay)  return "#10B981"; // green
  if (total <= budgetPerDay * 1.2) return "#F59E0B"; // yellow
  return "#EF4444"; // red
}

// spending by category for a list of entries
export function spendingByCategory(entries) {
  return entries
    .filter(e => !e.is_income)
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
}

// monthly totals for last 6 months
export function monthlyTotals(entries) {
  return entries
    .filter(e => !e.is_income)
    .reduce((acc, e) => {
      const key = e.date.slice(0, 7); // "2026-05"
      acc[key] = (acc[key] || 0) + e.amount;
      return acc;
    }, {});
}

// daily food spending for line chart
export function dailyFoodSpending(entries, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const date = `${year}-${String(month).padStart(2, "0")}-${day}`;
    const total = entries
      .filter(e => e.date === date && e.category === "Food & Drink" && !e.is_income)
      .reduce((sum, e) => sum + e.amount, 0);
    return { day: i + 1, amount: total };
  });
}