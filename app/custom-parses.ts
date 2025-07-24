import { createParser } from 'nuqs';

export enum ActiveFilter {
  ALL = 'all',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

const ACTIVE_FILTER_VALUES = Object.values(ActiveFilter);
export const isActiveFilter = (value: string): value is ActiveFilter => ACTIVE_FILTER_VALUES.some((v) => v === value);

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
