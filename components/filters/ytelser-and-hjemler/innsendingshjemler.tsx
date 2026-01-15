import { VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { InnsendingshjemlerMode } from '@/components/filters/ytelser-and-hjemler/hjemler-mode';
import { useInnsendingshjemlerFilter } from '@/lib/query-state/query-state';
import { sortWithOrdinals } from '@/lib/sort-with-ordinals/sort-with-ordinals';
import type { IYtelse } from '@/lib/types';

interface Props {
  relevantYtelser: IYtelse[];
}

export const Innsendingshjemler = ({ relevantYtelser }: Props) => {
  const [selected, setSelected] = useInnsendingshjemlerFilter();

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
    <VStack gap="space-4" className="grow">
      <InnsendingshjemlerMode />
      <MultiselectFilter label="Innsendingshjemler" selected={selected} setSelected={setSelected} options={options} />
    </VStack>
  );
};
