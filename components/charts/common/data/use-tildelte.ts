import { useFiltered } from '@/components/charts/common/data/use-filtered';
import type { TildeltBehandling } from '@/lib/server/types';

export const useTildelte = (behandlinger: TildeltBehandling[]) => useFiltered(behandlinger);
