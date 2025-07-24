import type { TickProp } from 'recharts/types/util/types';

export const XTick: TickProp = ({ x, y, payload }) => (
  <text fontSize={14} textAnchor="middle" x={x} y={y + 12}>
    {payload.value}
  </text>
);

export const YTick: TickProp = ({ x, y, payload }) => (
  <text fontSize={14} textAnchor="end" x={x} y={y + 3}>
    {payload.value}
  </text>
);
