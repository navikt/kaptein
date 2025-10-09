export const getMedian = (values: number[]): number | null => {
  const sorted = values.toSorted((a, b) => a - b);

  if (sorted.length === 0) return null;
  if (sorted.length === 1) return sorted.at(0) ?? null;
  if (sorted.length % 2 === 1) return sorted.at(Math.floor(sorted.length / 2)) ?? null;

  const middle = sorted.length / 2;

  const startValue = sorted.at(Math.floor(middle));
  const endValue = sorted.at(Math.ceil(middle));

  if (startValue === undefined || endValue === undefined) {
    return null;
  }

  return (startValue + endValue) / 2;
};

export const getAvg = (values: number[]): number | null => {
  if (values.length === 0) return null;

  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

export const NUBMER_FORMAT = new Intl.NumberFormat('no-NO', { maximumFractionDigits: 2 });
