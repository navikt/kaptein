import { createParser } from 'nuqs';

export enum ActiveFilter {
  ALL = 'all',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

export enum LedigeFilter {
  ALL = 'all',
  LEDIGE = 'ledige',
  TILDELTE = 'tildelte',
}

const ACTIVE_FILTER_VALUES = Object.values(ActiveFilter);
const LEDIGE_FILTER_VALUES = Object.values(LedigeFilter);
export const isActiveFilter = (value: string): value is ActiveFilter => ACTIVE_FILTER_VALUES.some((v) => v === value);
export const isLedigeFilter = (value: string): value is LedigeFilter => LEDIGE_FILTER_VALUES.some((v) => v === value);

export const parseAsActiveFilter = createParser({
  parse: (value): ActiveFilter => {
    if (value === ActiveFilter.ACTIVE) {
      return ActiveFilter.ACTIVE;
    }

    if (value === ActiveFilter.FINISHED) {
      return ActiveFilter.FINISHED;
    }

    return ActiveFilter.ALL;
  },

  serialize(value) {
    return value;
  },
});

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
