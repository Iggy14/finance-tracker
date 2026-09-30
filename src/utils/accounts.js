// Display order: KBank first, SCB second, anything else follows.
export const PRIORITY = [/k[\s-]?bank|kasikorn/i, /scb|siam commercial/i];

const rank = (name) => {
  const i = PRIORITY.findIndex((re) => re.test(name));
  return i === -1 ? PRIORITY.length : i;
};

// Stable order regardless of the row order the database returns (which changes after updates).
export const sortAccounts = (accounts) =>
  [...accounts].sort((a, b) => rank(a.name) - rank(b.name));
