'use client';

import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { useYtelsesgrupperFilter } from '@/lib/query-state/query-state';
import { YTELSESGRUPPE_OPTIONS } from '@/lib/types/ytelsesgrupper';

export const Ytelsesgrupper = () => {
  const [selectedYtelsesgrupper, setSelectedYtelsesgrupper] = useYtelsesgrupperFilter();

  const options = useMemo(() => YTELSESGRUPPE_OPTIONS.map(({ id, label }) => ({ label, value: id })), []);

  return (
    <MultiselectFilter
      label="Ytelsesgrupper"
      selected={selectedYtelsesgrupper}
      setSelected={setSelectedYtelsesgrupper}
      options={options}
    />
  );
};
