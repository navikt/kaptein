import { PÅ_VENT_COLORS } from '@/lib/echarts/på-vent-colors';
import { SAKSTYPE_COLORS } from '@/lib/echarts/sakstype-colors';
import type { PåVentReason, Sakstype } from '@/lib/types';

export const getSakstypeColor = (typeId: Sakstype) => `var(--ax-${SAKSTYPE_COLORS[typeId]})`;
export const getPåVentReasonColor = (reason: PåVentReason) => `var(--ax-${PÅ_VENT_COLORS[reason]})`;
