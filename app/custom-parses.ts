import { createParser } from 'nuqs';

export enum LedigeFilter {
  ALL = 'all',
  LEDIGE = 'ledige',
  TILDELTE = 'tildelte',
}

const LEDIGE_FILTER_VALUES = Object.values(LedigeFilter);
export const isLedigeFilter = (value: string): value is LedigeFilter => LEDIGE_FILTER_VALUES.some((v) => v === value);

export const parseAsLedigeFilter = createParser({
  parse: (value): LedigeFilter => {
    if (value === LedigeFilter.LEDIGE) {
      return LedigeFilter.LEDIGE;
    }

    if (value === LedigeFilter.TILDELTE) {
      return LedigeFilter.TILDELTE;
    }

    return LedigeFilter.ALL;
  },

  serialize(value) {
    return value;
  },
});
