'use client';

import { isAfter, isBefore } from 'date-fns';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { parseAsDate } from '@/app/custom-query-parsers';
import { useFiltered } from '@/components/charts/common/data/use-filtered';
import type { FerdigstiltBehandling } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

export const useFerdigstilte = (behandlinger: FerdigstiltBehandling[]) => {
  const [fromFilter] = useQueryState(QueryParam.FROM, parseAsDate);
  const [toFilter] = useQueryState(QueryParam.TO, parseAsDate);
  const [registreringshjemlerFilter] = useQueryState(QueryParam.REGISTRERINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [utfallFilter] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));
  const registreringshjemler = registreringshjemlerFilter ?? [];
  const utfall = utfallFilter ?? [];

  const baseFiltered = useFiltered(behandlinger);

  const filteredForUtfall =
    utfall.length === 0 ? baseFiltered : baseFiltered.filter((b) => utfall.includes(b.resultat.utfallId));

  const filteredForFrom =
    fromFilter === null
      ? filteredForUtfall
      : filteredForUtfall.filter((b) =>
          b.avsluttetAvSaksbehandlerDate === null
            ? !isBefore(new Date(b.created), fromFilter)
            : !isBefore(new Date(b.avsluttetAvSaksbehandlerDate), fromFilter),
        );

  const filteredForTo =
    toFilter === null
      ? filteredForFrom
      : filteredForFrom.filter((b) =>
          b.avsluttetAvSaksbehandlerDate === null
            ? !isAfter(new Date(b.created), toFilter)
            : !isAfter(new Date(b.avsluttetAvSaksbehandlerDate), toFilter),
        );

  const filteredForRegistreringshjemler =
    registreringshjemler.length === 0
      ? filteredForTo
      : filteredForTo.filter((b) => registreringshjemler.some((h) => b.resultat.hjemmelIdSet.includes(h)));

  return filteredForRegistreringshjemler;
};
