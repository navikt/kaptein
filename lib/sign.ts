export const sign = (n: number): string => {
  if (n > 0) {
    return '+';
  }

  if (n < 0) {
    return '-';
  }

  return '';
};
