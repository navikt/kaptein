import { createParser } from 'nuqs';

export enum TildelingFilter {
  ALL = 'all',
  LEDIGE = 'ledige',
  TILDELTE = 'tildelte',
}

const TILDELT_FILTER_VALUES = Object.values(TildelingFilter);
export const isLedigeFilter = (value: string): value is TildelingFilter =>
  TILDELT_FILTER_VALUES.some((v) => v === value);

export const parseAsLedigeFilter = createParser({
  parse: (value): TildelingFilter => {
    if (value === TildelingFilter.LEDIGE) {
      return TildelingFilter.LEDIGE;
    }

    if (value === TildelingFilter.TILDELTE) {
      return TildelingFilter.TILDELTE;
    }

    return TildelingFilter.ALL;
  },

  serialize(value) {
    return value;
  },
});
