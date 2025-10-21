import { ToggleGroup } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { HjemlerModeFilter } from '@/app/query-types';
import type { QueryParam } from '@/lib/types/query-param';

interface Props {
  queryParam: QueryParam;
}

export const HjemlerMode = ({ queryParam }: Props) => {
  const [mode, setMode] = useQueryState(queryParam);

  return (
    <ToggleGroup value={mode ?? HjemlerModeFilter.INCLUDE_FOR_SOME} onChange={(v) => setMode(v)} size="small">
      <ToggleGroup.Item value={HjemlerModeFilter.INCLUDE_FOR_SOME}>Match minst én</ToggleGroup.Item>
      <ToggleGroup.Item value={HjemlerModeFilter.INCLUDE_FOR_ALL}>Match alle</ToggleGroup.Item>
    </ToggleGroup>
  );
};
