'use client';
import { HjemlerModeFilter } from '@/app/query-types';
import type { BaseBehandling } from '@/lib/types';

export const filterHjemler = <T extends BaseBehandling>(
  behandlinger: T[],
  hjemlerFilter: string[] | null,
  mode: HjemlerModeFilter | null,
  getHjemler: (b: T) => string[],
): T[] => {
  if (hjemlerFilter === null || hjemlerFilter.length === 0) {
    return behandlinger;
  }

  switch (mode) {
    case null:
    case HjemlerModeFilter.INCLUDE_FOR_SOME:
      return behandlinger.filter((b) => hjemlerFilter.some((h) => getHjemler(b).includes(h)));
    case HjemlerModeFilter.INCLUDE_ALL_SELECTED:
      return behandlinger.filter((b) => hjemlerFilter.every((h) => getHjemler(b).includes(h)));
    case HjemlerModeFilter.INCLUDE_ALL_IN_BEHANDLING:
      return behandlinger.filter((b) => {
        const hjemler = getHjemler(b);

        return hjemler.length === hjemlerFilter.length && hjemlerFilter.every((h) => hjemler.includes(h));
      });
  }
};
