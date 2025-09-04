import { createParser } from 'nuqs';

export enum TildeltFilter {
  ALL = 'all',
  LEDIGE = 'ledige',
  TILDELTE = 'tildelte',
}

const TILDELT_FILTER_VALUES = Object.values(TildeltFilter);
export const isLedigeFilter = (value: string): value is TildeltFilter => TILDELT_FILTER_VALUES.some((v) => v === value);

export const parseAsLedigeFilter = createParser({
  parse: (value): TildeltFilter => {
    if (value === TildeltFilter.LEDIGE) {
      return TildeltFilter.LEDIGE;
    }

    if (value === TildeltFilter.TILDELTE) {
      return TildeltFilter.TILDELTE;
    }

    return TildeltFilter.ALL;
  },

  serialize(value) {
    return value;
  },
});
