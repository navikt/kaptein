import {
  type IKodeverkValue,
  type PåVentReason,
  PåVentReasonCommon,
  type Sakstype,
  type SakstypeToPåVentReasons,
} from '@/lib/types';

export const useRelevantPåVentReasons = (
  selectedSakstyper: Sakstype[],
  sakstyperToPåVentReasons: SakstypeToPåVentReasons[],
): IKodeverkValue<PåVentReason>[] => {
  const relevant = sakstyperToPåVentReasons.filter(({ id }) => selectedSakstyper.some((s) => s === id));

  const reasons: IKodeverkValue<PåVentReason>[] = [];

  for (const { sattPaaVentReasons } of relevant) {
    for (const reason of sattPaaVentReasons) {
      if (!reasons.some((r) => r.id === reason.id)) {
        reasons.push(reason);
      }
    }
  }

  return reasons.toSorted((a, b) => {
    if (a.id === PåVentReasonCommon.ANNET) {
      return 1;
    }

    if (b.id === PåVentReasonCommon.ANNET) {
      return -1;
    }

    return Number.parseInt(a.id, 10) - Number.parseInt(b.id, 10);
  });
};
