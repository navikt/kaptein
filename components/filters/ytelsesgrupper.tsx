'use client';

import { ChevronRightLastIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tooltip } from '@navikt/ds-react';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { useYtelserFilter, useYtelsesgrupperFilter } from '@/lib/query-state/query-state';
import { getYtelserForGroup, isYtelsesgruppe, YTELSESGRUPPE_OPTIONS } from '@/lib/types/ytelsesgrupper';

interface Props {
  onChange: () => void;
}

export const Ytelsesgrupper = ({ onChange }: Props) => {
  const [selectedYtelsesgrupper, setSelectedYtelsesgrupper] = useYtelsesgrupperFilter();

  const options = useMemo(
    () => YTELSESGRUPPE_OPTIONS.map(({ id, label }) => ({ label: removeLastWord(label), value: id })),
    [],
  );

  return (
    <HStack gap="space-8" wrap={false}>
      <MultiselectFilter
        label="Ytelsesgrupper"
        selected={selectedYtelsesgrupper}
        setSelected={(selected) => {
          setSelectedYtelsesgrupper(selected);
          onChange();
        }}
        options={options}
      />
      {selectedYtelsesgrupper.length === 0 ? null : (
        <AddYtelserButton selectedYtelsesgrupper={selectedYtelsesgrupper} />
      )}
    </HStack>
  );
};

const removeLastWord = (text: string) => text.split(' ').slice(0, -1).join(' ');

interface AddYtelserButtonProps {
  selectedYtelsesgrupper: string[];
}

const AddYtelserButton = ({ selectedYtelsesgrupper }: AddYtelserButtonProps) => {
  const [selectedYtelser, setSelectedYtelser] = useYtelserFilter();

  const ytelserToAdd = useMemo(() => {
    const allYtelserFromGroups = selectedYtelsesgrupper.filter(isYtelsesgruppe).flatMap(getYtelserForGroup);

    return allYtelserFromGroups.filter((ytelse) => !selectedYtelser.includes(ytelse));
  }, [selectedYtelsesgrupper, selectedYtelser]);

  if (ytelserToAdd.length === 0) {
    return null;
  }

  const handleAddAllYtelser = () => setSelectedYtelser([...selectedYtelser, ...ytelserToAdd]);

  return (
    <Tooltip content="Legg til alle ytelser i valgte grupper" describesChild>
      <Button
        variant="tertiary"
        size="small"
        onClick={handleAddAllYtelser}
        icon={<ChevronRightLastIcon aria-hidden className="rotate-90" />}
      />
    </Tooltip>
  );
};
