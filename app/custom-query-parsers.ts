import { createParser } from 'nuqs';
import { HjemlerModeFilter, TilbakekrevingFilter, TildelingFilter } from '@/app/query-types';

const TILDELT_FILTER_VALUES = Object.values(TildelingFilter);
const TILBAKEKREVING_FILTER_VALUES = Object.values(TilbakekrevingFilter);

export const isLedigeFilter = (value: string): value is TildelingFilter =>
  TILDELT_FILTER_VALUES.some((v) => v === value);

export const isTilbakekrevingFilter = (value: string): value is TilbakekrevingFilter =>
  TILBAKEKREVING_FILTER_VALUES.some((v) => v === value);

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

const HJEMLER_MODES = Object.values(HjemlerModeFilter);
const isHjemlerMode = (value: string): value is HjemlerModeFilter => HJEMLER_MODES.some((v) => v === value);

export const parseAsHjemlerModeFilter = createParser({
  parse: (value): HjemlerModeFilter | null => (isHjemlerMode(value) ? value : HjemlerModeFilter.INCLUDE_FOR_SOME),

  serialize(value) {
    return value;
  },
});

export const parseAsTilbakekrevingFilter = createParser({
  parse: (value): TilbakekrevingFilter => {
    if (value === TilbakekrevingFilter.UTEN) {
      return TilbakekrevingFilter.UTEN;
    }

    if (value === TilbakekrevingFilter.KUN) {
      return TilbakekrevingFilter.KUN;
    }

    return TilbakekrevingFilter.MED;
  },

  serialize(value) {
    return value;
  },
});

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const isDateString = (value: string): value is `${number}-${number}-${number}` => DATE_REGEX.test(value);

export const parseAsDateString = createParser({
  parse: (value): string => {
    if (!isDateString(value)) {
      throw new Error('Invalid date format, expected YYYY-MM-DD');
    }

    return value;
  },

  serialize: (value) => value,
});
