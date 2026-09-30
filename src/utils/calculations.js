import { BUDGET_CATEGORY } from "./categories";

// total spent on a given day
export function dailyTotal(entries) {
  return entries
    .filter(e => !e.is_income)
    .reduce((sum, e) => sum + e.amount, 0);
}

// an entry counts toward the daily budget only if it is Food & Drink AND paid from the budget account (KBank)
export function countsTowardBudget(entry, budgetAccountId) {
  return entry.category === BUDGET_CATEGORY && entry.account_id === budgetAccountId;
}

// dot color for calendar cell — only Food & Drink paid from the budget account counts
export function dotColor(entries, budgetPerDay, budgetAccountId) {
  const foodEntries = entries.filter(e => countsTowardBudget(e, budgetAccountId));
  if (!foodEntries.length) return null;
  const total = dailyTotal(foodEntries);
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
export function dailyFoodSpending(entries, year, month, budgetAccountId) {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const date = `${year}-${String(month).padStart(2, "0")}-${day}`;
    const total = entries
      .filter(e => e.date === date && countsTowardBudget(e, budgetAccountId) && !e.is_income)
      .reduce((sum, e) => sum + e.amount, 0);
    return { day: i + 1, amount: total };
  });
}