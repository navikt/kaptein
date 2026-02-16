'use client';

import { ChevronRightLastIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tooltip } from '@navikt/ds-react';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { SubFilter } from '@/components/filters/sub-filter';
import { Innsendingshjemler } from '@/components/filters/ytelser-and-hjemler/innsendingshjemler';
import { Registreringshjemler } from '@/components/filters/ytelser-and-hjemler/registreringshjemler';
import { Ytelsesgrupper } from '@/components/filters/ytelsesgrupper';
import {
  useInnsendingshjemlerFilter,
  useRegistreringshjemlerFilter,
  useYtelserFilter,
  useYtelsesgrupperFilter,
} from '@/lib/query-state/query-state';
import type { IKodeverkValue, IYtelse } from '@/lib/types';
import { expandYtelsesgrupperToYtelser, getYtelsesgruppeForYtelse } from '@/lib/types/ytelsesgrupper';

interface Props {
  ytelser: IYtelse[] | undefined;
  lovkildeToRegistreringshjemler: IKodeverkValue[] | undefined;
}

const useYtelserAndHjemler = (ytelser: IYtelse[]) => {
  const [selectedYtelser, setSelectedYtelser] = useYtelserFilter();
  const [selectedYtelsesgrupper] = useYtelsesgrupperFilter();

  const ytelserOptions = useMemo(() => ytelser.map(({ navn, id }) => ({ label: navn, value: id })), [ytelser]);

  const relevantKodeverk = useMemo(() => {
    if (selectedYtelser.length === 0 && selectedYtelsesgrupper.length === 0) {
      return ytelser;
    }

    const ytelserFromGrupper = expandYtelsesgrupperToYtelser(selectedYtelsesgrupper);
    const allSelectedYtelser = [...new Set([...selectedYtelser, ...ytelserFromGrupper])];

    return ytelser.filter((y) => allSelectedYtelser.includes(y.id));
  }, [selectedYtelser, selectedYtelsesgrupper, ytelser]);

  return { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk };
};

export const YtelserAndRegistreringshjemler = ({ ytelser = [], lovkildeToRegistreringshjemler = [] }: Props) => {
  const { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk } = useYtelserAndHjemler(ytelser);
  const [, setSelectedHjemler] = useRegistreringshjemlerFilter();

  const resetHjemler = () => setSelectedHjemler(null);

  return (
    <>
      <Ytelsesgrupper onChange={resetHjemler} />

      <YtelserFilter
        selectedYtelser={selectedYtelser}
        setSelectedYtelser={setSelectedYtelser}
        ytelserOptions={ytelserOptions}
        onYtelserChange={resetHjemler}
      />

      <SubFilter>
        <Registreringshjemler
          relevantYtelser={relevantKodeverk}
          lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
        />
      </SubFilter>
    </>
  );
};

export const YtelserAndInnsendingshjemler = ({ ytelser = [] }: { ytelser: IYtelse[] | undefined }) => {
  const { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk } = useYtelserAndHjemler(ytelser);
  const [, setSelectedHjemler] = useInnsendingshjemlerFilter();

  const resetHjemler = () => setSelectedHjemler(null);

  return (
    <>
      <Ytelsesgrupper onChange={resetHjemler} />

      <YtelserFilter
        selectedYtelser={selectedYtelser}
        setSelectedYtelser={setSelectedYtelser}
        ytelserOptions={ytelserOptions}
        onYtelserChange={resetHjemler}
      />

      <SubFilter>
        <Innsendingshjemler relevantYtelser={relevantKodeverk} />
      </SubFilter>
    </>
  );
};

export const YtelserAndInnsendingsAndRegistreringshjemler = ({
  ytelser = [],
  lovkildeToRegistreringshjemler = [],
}: Props) => {
  const { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk } = useYtelserAndHjemler(ytelser);
  const [, setSelectedInnsendingsHjemler] = useInnsendingshjemlerFilter();
  const [, setSelectedRegistreringsHjemler] = useRegistreringshjemlerFilter();

  const resetHjemler = () => {
    setSelectedInnsendingsHjemler(null);
    setSelectedRegistreringsHjemler(null);
  };

  return (
    <>
      <Ytelsesgrupper onChange={resetHjemler} />

      <YtelserFilter
        selectedYtelser={selectedYtelser}
        setSelectedYtelser={setSelectedYtelser}
        ytelserOptions={ytelserOptions}
        onYtelserChange={resetHjemler}
      />

      <SubFilter>
        <Innsendingshjemler relevantYtelser={relevantKodeverk} />
      </SubFilter>

      <SubFilter>
        <Registreringshjemler
          relevantYtelser={relevantKodeverk}
          lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
        />
      </SubFilter>
    </>
  );
};

interface YtelseOption {
  label: string;
  value: string;
}

interface YtelserFilterProps {
  selectedYtelser: string[];
  setSelectedYtelser: (value: string[] | null) => void;
  ytelserOptions: YtelseOption[];
  onYtelserChange?: (value: string[] | null) => void;
}

const YtelserFilter = ({
  selectedYtelser,
  setSelectedYtelser,
  ytelserOptions,
  onYtelserChange,
}: YtelserFilterProps) => (
  <HStack gap="space-8" wrap={false}>
    <MultiselectFilter
      label="Ytelser"
      selected={selectedYtelser}
      setSelected={(v) => {
        setSelectedYtelser(v);
        onYtelserChange?.(v);
      }}
      options={ytelserOptions}
    />
    {selectedYtelser.length === 0 ? null : <AddYtelsesgrupperButton selectedYtelser={selectedYtelser} />}
  </HStack>
);

interface AddYtelsesgrupperButtonProps {
  selectedYtelser: string[];
}

const AddYtelsesgrupperButton = ({ selectedYtelser }: AddYtelsesgrupperButtonProps) => {
  const [selectedYtelsesgrupper, setSelectedYtelsesgrupper] = useYtelsesgrupperFilter();

  const ytelsesgrupperToAdd = useMemo(() => {
    const groupsFromYtelser = selectedYtelser
      .map(getYtelsesgruppeForYtelse)
      .filter((group): group is NonNullable<typeof group> => group !== null);

    const uniqueGroups = [...new Set(groupsFromYtelser)];
    return uniqueGroups.filter((group) => !selectedYtelsesgrupper.includes(group));
  }, [selectedYtelser, selectedYtelsesgrupper]);

  if (ytelsesgrupperToAdd.length === 0) {
    return null;
  }

  const handleAddAllYtelsesgrupper = () =>
    setSelectedYtelsesgrupper([...selectedYtelsesgrupper, ...ytelsesgrupperToAdd]);

  return (
    <Tooltip content="Legg til ytelsesgrupper for valgte ytelser" describesChild>
      <Button
        variant="tertiary"
        size="small"
        onClick={handleAddAllYtelsesgrupper}
        icon={<ChevronRightLastIcon aria-hidden className="-rotate-90" />}
      />
    </Tooltip>
  );
};
