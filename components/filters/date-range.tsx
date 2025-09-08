'use client';

import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Button, DatePicker, HGrid, HStack, useRangeDatepicker, VStack } from '@navikt/ds-react';
import { endOfMonth, endOfYear, isSameDay, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsDate } from '@/app/custom-parsers';

const TODAY = new Date();
const START_OF_KABAL = new Date('2022-05-01');

const START_OF_MONTH = startOfMonth(TODAY);
const START_OF_LAST_TERTIAL = startOfMonth(subMonths(TODAY, 4));
const END_OF_LAST_TERTIAL = endOfMonth(subMonths(TODAY, 1));
const START_OF_NEST_SISTE_TERTIAL = startOfMonth(subMonths(TODAY, 8));
const END_OF_NEST_SISTE_TERTIAL = endOfMonth(subMonths(TODAY, 5));
const START_OF_SISTE_12_MND = subMonths(TODAY, 12);
const START_OF_THIS_YEAR = startOfYear(TODAY);
const START_OF_LAST_YEAR = startOfYear(subYears(TODAY, 1));
const END_OF_LAST_YEAR = endOfYear(subYears(TODAY, 1));

export const DateRange = () => {
  const [from, setFrom] = useQueryState('from', parseAsDate);
  const [to, setTo] = useQueryState('to', parseAsDate);

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
  });

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
  const isNestSisteTertial = useMemo(
    () =>
      from !== null &&
      to !== null &&
      isSameDay(from, START_OF_NEST_SISTE_TERTIAL) &&
      isSameDay(to, END_OF_NEST_SISTE_TERTIAL),
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

  return (
    <VStack gap="3">
      <DatePicker {...datepickerProps} dropdownCaption>
        <VStack>
          <DatePicker.Input
            {...fromInputProps}
            label={
              <HStack align="center" gap="1">
                <span>Fra og med</span>
                <Button
                  variant="tertiary"
                  className="shrink"
                  size="small"
                  onClick={resetFrom}
                  icon={<ClockDashedIcon aria-hidden />}
                />
              </HStack>
            }
          />

          <HStack>
            <DatePicker.Input
              {...toInputProps}
              label={
                <HStack align="center" gap="1">
                  <span>Til og med</span>
                  <Button
                    variant="tertiary"
                    className="shrink"
                    size="small"
                    onClick={resetTo}
                    icon={<ClockDashedIcon aria-hidden />}
                  />
                </HStack>
              }
            />
          </HStack>
        </VStack>
      </DatePicker>

      <HGrid columns={2} gap="2">
        <Button
          variant={isDenneMåneden ? 'primary' : 'secondary'}
          onClick={() => setSelected({ from: startOfMonth(TODAY), to: TODAY })}
        >
          Denne måneden
        </Button>

        <Button
          variant={isSisteTertial ? 'primary' : 'secondary'}
          onClick={() => setSelected({ from: START_OF_LAST_TERTIAL, to: END_OF_LAST_TERTIAL })}
        >
          Siste tertial
        </Button>

        <Button
          variant={isNestSisteTertial ? 'primary' : 'secondary'}
          onClick={() => setSelected({ from: START_OF_NEST_SISTE_TERTIAL, to: END_OF_NEST_SISTE_TERTIAL })}
        >
          Nest siste tertial
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
