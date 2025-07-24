import { SAKSTYPE_COLORS } from '@/lib/echarts/sakstype-colors';
import type { Sakstype } from '@/lib/server/types';

export const getSakstypeColor = (typeId: Sakstype) => `var(--ax-${SAKSTYPE_COLORS[typeId]})`;
