'use client';

import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Button, DatePicker, HGrid, HStack, useDatepicker, VStack } from '@navikt/ds-react';
import { endOfMonth, endOfYear, format, parse, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsDateString } from '@/app/custom-query-parsers';
import { ISO_DATE_FORMAT, NOW, START_OF_KABAL_DATE, TODAY } from '@/lib/date';
import { QueryParam } from '@/lib/types/query-param';

const LAST_MONTH = subMonths(NOW, 1);

const START_OF_LAST_MONTH = format(startOfMonth(LAST_MONTH), ISO_DATE_FORMAT);
const END_OF_LAST_MONTH = format(endOfMonth(LAST_MONTH), ISO_DATE_FORMAT);
const START_OF_MONTH = format(startOfMonth(NOW), ISO_DATE_FORMAT);
const START_OF_LAST_TERTIAL = format(startOfMonth(subMonths(NOW, 4)), ISO_DATE_FORMAT);
const END_OF_LAST_TERTIAL = format(endOfMonth(subMonths(NOW, 1)), ISO_DATE_FORMAT);
const START_OF_SISTE_12_MND = format(subMonths(NOW, 12), ISO_DATE_FORMAT);
const START_OF_THIS_YEAR = format(startOfYear(NOW), ISO_DATE_FORMAT);
const START_OF_LAST_YEAR = format(startOfYear(subYears(NOW, 1)), ISO_DATE_FORMAT);
const END_OF_LAST_YEAR = format(endOfYear(subYears(NOW, 1)), ISO_DATE_FORMAT);

export const DateRange = () => {
  const [from, setFrom] = useQueryState(QueryParam.FROM, parseAsDateString);
  const [to, setTo] = useQueryState(QueryParam.TO, parseAsDateString);

  const parsedFrom = from === null ? null : parse(from, ISO_DATE_FORMAT, new Date());
  const parsedTo = to === null ? null : parse(to, ISO_DATE_FORMAT, new Date());

  const {
    datepickerProps: fromDatePickerProps,
    inputProps: fromInputProps,
    setSelected: setFromSelected,
  } = useDatepicker({
    fromDate: START_OF_KABAL_DATE,
    toDate: NOW,
    defaultSelected: parsedFrom ?? NOW,
    allowTwoDigitYear: true,
    required: true,
    onDateChange: (date) => {
      if (date === undefined) {
        return;
      }
      const formatted = format(date, ISO_DATE_FORMAT);
      setFrom(formatted);

      if (to !== null && formatted > to) {
        setTo(formatted);
        setToSelected(date);
      }
    },
  });

  const {
    datepickerProps: toDatePickerProps,
    inputProps: toInputProps,
    setSelected: setToSelected,
  } = useDatepicker({
    fromDate: START_OF_KABAL_DATE,
    toDate: NOW,
    defaultSelected: parsedTo ?? NOW,
    allowTwoDigitYear: true,
    required: true,
    onDateChange: (date) => {
      if (date === undefined) {
        return;
      }
      const formatted = format(date, ISO_DATE_FORMAT);
      setTo(formatted);

      if (from !== null && formatted < from) {
        setFrom(formatted);
        setFromSelected(date);
      }
    },
  });

  const setSelected = (from: string, to: string) => {
    setToSelected(parse(to, ISO_DATE_FORMAT, new Date()));
    setFromSelected(parse(from, ISO_DATE_FORMAT, new Date()));
  };

  const resetFrom = () => setFromSelected(parse(START_OF_MONTH, ISO_DATE_FORMAT, new Date()));

  const resetTo = () => setToSelected(NOW);

  const isDenneMåneden = useMemo(
    () => from !== null && to !== null && from === START_OF_MONTH && to === TODAY,
    [from, to],
  );
  const isSisteTertial = useMemo(
    () => from !== null && to !== null && from === START_OF_LAST_TERTIAL && to === END_OF_LAST_TERTIAL,
    [from, to],
  );
  const isForrigeMåned = useMemo(
    () => from !== null && to !== null && from === START_OF_LAST_MONTH && to === END_OF_LAST_MONTH,
    [from, to],
  );
  const isSiste12Mnd = useMemo(
    () => from !== null && to !== null && from === START_OF_SISTE_12_MND && to === TODAY,
    [from, to],
  );
  const isIAr = useMemo(() => from !== null && to !== null && from === START_OF_THIS_YEAR && to === TODAY, [from, to]);
  const isIFjor = useMemo(
    () => from !== null && to !== null && from === START_OF_LAST_YEAR && to === END_OF_LAST_YEAR,
    [from, to],
  );

  return (
    <VStack gap="4">
      <HGrid columns={2} align="start" gap="2" className="!auto-cols-max">
        <DatePicker {...fromDatePickerProps} dropdownCaption wrapperClassName="w-full">
          <DatePicker.Input
            {...fromInputProps}
            className="w-full"
            label={<LabelWithReset label="Fra og med" resetLabel="Tilbakestill fra og med" onClick={resetFrom} />}
          />
        </DatePicker>

        <DatePicker {...toDatePickerProps} dropdownCaption wrapperClassName="w-full">
          <DatePicker.Input
            {...toInputProps}
            label={<LabelWithReset label="Til og med" resetLabel="Tilbakestill til og med" onClick={resetTo} />}
          />
        </DatePicker>
      </HGrid>

      <HGrid columns={2} gap="2">
        <Button variant={isDenneMåneden ? 'primary' : 'secondary'} onClick={() => setSelected(START_OF_MONTH, TODAY)}>
          Denne måneden
        </Button>

        <Button
          variant={isForrigeMåned ? 'primary' : 'secondary'}
          onClick={() => setSelected(START_OF_LAST_MONTH, END_OF_LAST_MONTH)}
        >
          Forrige måned
        </Button>

        <Button
          variant={isSisteTertial ? 'primary' : 'secondary'}
          onClick={() => setSelected(START_OF_LAST_TERTIAL, END_OF_LAST_TERTIAL)}
        >
          Siste tertial
        </Button>

        <Button
          variant={isSiste12Mnd ? 'primary' : 'secondary'}
          onClick={() => setSelected(START_OF_SISTE_12_MND, TODAY)}
        >
          Siste 12 mnd
        </Button>

        <Button variant={isIAr ? 'primary' : 'secondary'} onClick={() => setSelected(START_OF_THIS_YEAR, TODAY)}>
          I år
        </Button>

        <Button
          variant={isIFjor ? 'primary' : 'secondary'}
          onClick={() => setSelected(START_OF_LAST_YEAR, END_OF_LAST_YEAR)}
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
