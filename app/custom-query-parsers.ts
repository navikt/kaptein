import { format, isValid } from 'date-fns';
import { createParser } from 'nuqs';
import { ISO_DATE_FORMAT } from '@/lib/date';

export enum TildelingFilter {
  ALL = 'all',
  LEDIGE = 'ledige',
  TILDELTE = 'tildelte',
}

export enum TilbakekrevingFilter {
  MED = 'med',
  UTEN = 'uten',
  KUN = 'kun',
}

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

export const parseAsDate = createParser({
  parse: (value): Date => {
    const date = new Date(value);

    if (isValid(date)) {
      return date;
    }

    return new Date();
  },

  serialize(value) {
    return format(value, ISO_DATE_FORMAT);
  },
});
