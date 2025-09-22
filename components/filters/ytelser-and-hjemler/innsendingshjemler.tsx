import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import type { IYtelse } from '@/lib/server/types';
import { sortWithOrdinals } from '@/lib/sort-with-ordinals/sort-with-ordinals';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  relevantYtelser: IYtelse[];
}

export const Innsendingshjemler = ({ relevantYtelser }: Props) => {
  const [selected, setSelected] = useQueryState(QueryParam.INNSENDINGSHJEMLER, parseAsArrayOf(parseAsString));

  const options = useMemo(() => {
    const hjemler: Record<string, string> = {};

    for (const ytelse of relevantYtelser) {
      for (const hjemmel of ytelse.innsendingshjemler) {
        hjemler[hjemmel.id] = hjemmel.navn;
      }
    }

    return Object.entries(hjemler)
      .map(([id, navn]) => ({ value: id, label: navn }))
      .toSorted((a, b) => sortWithOrdinals(a.label, b.label));
  }, [relevantYtelser]);

  return (
    <MultiselectFilter label="Innsendingshjemler" selected={selected} setSelected={setSelected} options={options} />
  );
};
