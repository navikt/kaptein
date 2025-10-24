import { formatPercent } from '@/lib/format';

export const percent = (part: number, total: number, decimals?: number) =>
  formatPercent(total === 0 ? 0 : part / total, decimals);
