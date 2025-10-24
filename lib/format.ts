const intFormatter = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat('nb-NO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatInt = intFormatter.format;
export const formatDecimal = decimalFormatter.format;
export const formatPercent = (value: number, decimals = 1) =>
  Intl.NumberFormat('nb-NO', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
