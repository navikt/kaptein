import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

export const getRelevantYtelser = (behandlinger: Behandling[], ytelser: IYtelse[]): IKodeverkSimpleValue[] => {
  const ids = Array.from(new Set(behandlinger.map((b) => b.ytelseId)));

  return ids
    .map((id) => {
      const kodeverk = ytelser.find((k) => k.id === id);

      return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
    })
    .toSorted((a, b) => a.navn.localeCompare(b.navn));
};
