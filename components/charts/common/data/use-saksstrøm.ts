import { isAfter, isBefore } from 'date-fns';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { parseAsDate } from '@/app/custom-query-parsers';
import { useFiltered } from '@/components/charts/common/data/use-filtered';
import { type Behandling, isFerdigstilt } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

export const useSaksstrøm = (behandlinger: Behandling[]) => {
  const [fromFilter] = useQueryState(QueryParam.FROM, parseAsDate);
  const [toFilter] = useQueryState(QueryParam.TO, parseAsDate);
  const [registreringshjemlerFilter] = useQueryState(QueryParam.REGISTRERINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [utfallFilter] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));
  const registreringshjemler = registreringshjemlerFilter ?? [];
  const utfall = utfallFilter ?? [];

  const baseFiltered = useFiltered(behandlinger);

  const filteredForUtfall =
    utfall.length === 0
      ? baseFiltered
      : baseFiltered.filter((b) => isFerdigstilt(b) && utfall.includes(b.resultat.utfallId));

  const filteredForFrom =
    fromFilter === null
      ? filteredForUtfall
      : filteredForUtfall.filter((b) =>
          isFerdigstilt(b)
            ? !isBefore(new Date(b.avsluttetAvSaksbehandlerDate), fromFilter) &&
              !isBefore(new Date(b.created), fromFilter)
            : !isBefore(new Date(b.created), fromFilter),
        );

  const filteredForTo =
    toFilter === null
      ? filteredForFrom
      : filteredForFrom.filter((b) =>
          isFerdigstilt(b)
            ? !isAfter(new Date(b.avsluttetAvSaksbehandlerDate), toFilter) && !isAfter(new Date(b.created), toFilter)
            : !isAfter(new Date(b.created), toFilter),
        );

  const filteredForRegistreringshjemler =
    registreringshjemler.length === 0
      ? filteredForTo
      : filteredForTo.filter((b) =>
          registreringshjemler.some((h) => isFerdigstilt(b) && b.resultat.hjemmelIdSet.includes(h)),
        );

  return filteredForRegistreringshjemler;
};
