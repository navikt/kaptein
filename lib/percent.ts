export const percent = (part: number, total: number) =>
  `${(total === 0 ? 0 : (part / total) * 100).toLocaleString('nb-NO', { maximumFractionDigits: 1 })} %`;
