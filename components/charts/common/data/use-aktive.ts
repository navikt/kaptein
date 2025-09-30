import { useFiltered } from '@/components/charts/common/data/use-filtered';
import type { LedigBehandling, TildeltBehandling } from '@/lib/server/types';

export const useAktive = (behandlinger: (LedigBehandling | TildeltBehandling)[]) => useFiltered(behandlinger);
