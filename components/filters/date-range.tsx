'use client';

import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Button, DatePicker, HGrid, HStack, useRangeDatepicker, VStack } from '@navikt/ds-react';
import { endOfMonth, endOfYear, format, isSameDay, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';
import { useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import { parseAsDate } from '@/app/custom-query-parsers';
import { PRETTY_DATE_FORMAT } from '@/lib/date';
import { QueryParam } from '@/lib/types/query-param';

const TODAY = new Date();
const START_OF_KABAL = new Date('2021-01-01');

const LAST_MONTH = subMonths(TODAY, 1);
const START_OF_LAST_MONTH = startOfMonth(LAST_MONTH);
const END_OF_LAST_MONTH = endOfMonth(LAST_MONTH);
const START_OF_MONTH = startOfMonth(TODAY);
const START_OF_LAST_TERTIAL = startOfMonth(subMonths(TODAY, 4));
const END_OF_LAST_TERTIAL = endOfMonth(subMonths(TODAY, 1));
const START_OF_SISTE_12_MND = subMonths(TODAY, 12);
const START_OF_THIS_YEAR = startOfYear(TODAY);
const START_OF_LAST_YEAR = startOfYear(subYears(TODAY, 1));
const END_OF_LAST_YEAR = endOfYear(subYears(TODAY, 1));

const PRETTY_START_OF_KABAL = format(START_OF_KABAL, PRETTY_DATE_FORMAT);

export const DateRange = () => {
  const [from, setFrom] = useQueryState(QueryParam.FROM, parseAsDate);
  const [to, setTo] = useQueryState(QueryParam.TO, parseAsDate);
  const [fromErrors, setFromErrors] = useState<string[]>([]);
  const [toErrors, setToErrors] = useState<string[]>([]);

  const { fromInputProps, toInputProps, datepickerProps, setSelected } = useRangeDatepicker({
    defaultSelected: { from: from === null ? TODAY : new Date(from), to: to === null ? TODAY : new Date(to) },
    allowTwoDigitYear: true,
    fromDate: START_OF_KABAL,
    toDate: TODAY,
    required: true,
    onRangeChange: (range) => {
      setFrom(range?.from ?? null);
      setTo(range?.to ?? null);
    },
    onValidate: (range) => {
      const newFromErrors: string[] = [];
      const newToErrors: string[] = [];

      if (range.from.isValidDate && range.to.isValidDate) {
        setFromErrors([]);
        setToErrors([]);

        return;
      }

      if (range.from.isEmpty) newFromErrors.push('Fra og med-dato må være valgt');
      if (range.from.isInvalid && !range.from.isEmpty) newFromErrors.push('Fra og med-dato er ugyldig');
      if (range.from.isAfter) newFromErrors.push('Fra og med-dato kan ikke være etter til og med-dato');
      if (range.from.isBefore) newFromErrors.push(`Fra og med-dato kan ikke være før ${PRETTY_START_OF_KABAL}`);

      if (range.to.isEmpty) newToErrors.push('Til og med-dato må være valgt');
      if (range.to.isInvalid && !range.to.isEmpty) newToErrors.push('Til og med-dato er ugyldig');
      if (range.to.isAfter) newToErrors.push('Til og med-dato kan ikke være etter i dag');
      if (range.to.isBefore) newToErrors.push(`Til og med-dato kan ikke være før ${PRETTY_START_OF_KABAL}`);

      if (range.to.isBeforeFrom) newToErrors.push('Til og med-dato kan ikke være før fra og med-dato');

      setFromErrors(newFromErrors);
      setToErrors(newToErrors);
    },
  });

  useEffect(() => {
    const fromDiff = from !== null && fromInputProps.value !== format(new Date(from), PRETTY_DATE_FORMAT);
    const toDiff = to !== null && toInputProps.value !== format(new Date(to), PRETTY_DATE_FORMAT);

    if (fromDiff || toDiff) {
      setSelected({ from: from === null ? START_OF_MONTH : new Date(from), to: to === null ? TODAY : new Date(to) });
    }
  }, [from, to, setSelected, fromInputProps.value, toInputProps.value]);

  const resetFrom = () => setSelected({ from: START_OF_MONTH, to: to ?? TODAY });
  const resetTo = () => setSelected({ from: from ?? START_OF_MONTH, to: TODAY });

  const isDenneMåneden = useMemo(
    () => from !== null && to !== null && isSameDay(from, START_OF_MONTH) && isSameDay(to, TODAY),
    [from, to],
  );
  const isSisteTertial = useMemo(
    () => from !== null && to !== null && isSameDay(from, START_OF_LAST_TERTIAL) && isSameDay(to, END_OF_LAST_TERTIAL),
    [from, to],
  );
  const isForrigeMåned = useMemo(
    () => from !== null && to !== null && isSameDay(from, START_OF_LAST_MONTH) && isSameDay(to, END_OF_LAST_MONTH),
    [from, to],
  );
  const isSiste12Mnd = useMemo(
    () => from !== null && to !== null && isSameDay(from, START_OF_SISTE_12_MND) && isSameDay(to, TODAY),
    [from, to],
  );
  const isIAr = useMemo(
    () => from !== null && to !== null && isSameDay(from, START_OF_THIS_YEAR) && isSameDay(to, TODAY),
    [from, to],
  );
  const isIFjor = useMemo(
    () => from !== null && to !== null && isSameDay(from, START_OF_LAST_YEAR) && isSameDay(to, END_OF_LAST_YEAR),
    [from, to],
  );

  const fromError = (
    <ul>
      {fromErrors.map((e) => (
        <li key={e}>{e}</li>
      ))}
    </ul>
  );

  const toError = (
    <ul>
      {toErrors.map((e) => (
        <li key={e}>{e}</li>
      ))}
    </ul>
  );

  return (
    <VStack gap="4">
      <DatePicker {...datepickerProps} dropdownCaption wrapperClassName="!w-full">
        <HGrid columns={2} align="start" gap="2" className="!auto-cols-max">
          <DatePicker.Input
            {...fromInputProps}
            className="w-full"
            error={fromErrors.length > 0 ? fromError : undefined}
            label={<LabelWithReset label="Fra og med" resetLabel="Tilbakestill fra og med" onClick={resetFrom} />}
          />

          <DatePicker.Input
            {...toInputProps}
            error={toErrors.length > 0 ? toError : undefined}
            label={<LabelWithReset label="Til og med" resetLabel="Tilbakestill til og med" onClick={resetTo} />}
          />
        </HGrid>
      </DatePicker>

      <HGrid columns={2} gap="2">
        <Button
          variant={isDenneMåneden ? 'primary' : 'secondary'}
          onClick={() => setSelected({ from: startOfMonth(TODAY), to: TODAY })}
        >
          Denne måneden
        </Button>

        <Button
          variant={isForrigeMåned ? 'primary' : 'secondary'}
          onClick={() => setSelected({ from: START_OF_LAST_MONTH, to: END_OF_LAST_MONTH })}
        >
          Forrige måned
        </Button>

        <Button
          variant={isSisteTertial ? 'primary' : 'secondary'}
          onClick={() => setSelected({ from: START_OF_LAST_TERTIAL, to: END_OF_LAST_TERTIAL })}
        >
          Siste tertial
        </Button>

        <Button
          variant={isSiste12Mnd ? 'primary' : 'secondary'}
          onClick={() => setSelected({ from: START_OF_SISTE_12_MND, to: TODAY })}
        >
          Siste 12 mnd
        </Button>

        <Button
          variant={isIAr ? 'primary' : 'secondary'}
          onClick={() => setSelected({ from: START_OF_THIS_YEAR, to: TODAY })}
        >
          I år
        </Button>

        <Button
          variant={isIFjor ? 'primary' : 'secondary'}
          onClick={() => setSelected({ from: START_OF_LAST_YEAR, to: END_OF_LAST_YEAR })}
        >
          I fjor
        </Button>
      </HGrid>
    </VStack>
  );
};

const LabelWithReset = ({ onClick, label, resetLabel }: { onClick: () => void; label: string; resetLabel: string }) => (
  <HStack align="center" gap="1">
    <span>{label}</span>
    <Button
      variant="tertiary"
      className="shrink"
      size="small"
      onClick={onClick}
      icon={<ClockDashedIcon aria-hidden />}
      title={resetLabel}
    />
  </HStack>
);
