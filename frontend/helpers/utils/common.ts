export const centsToDollars = (cents: number) => {
  return (cents / 100).toFixed(2);
};
export const dollarsToCents = (dollars: number) => {
  return Math.round(dollars * 100);
};

export const centsToLKR = (cents: number) => {
  return (cents / 100).toFixed(2);
};

export const lkrToCents = (lkr: number) => {
  return Math.round(lkr * 100);
};
