const intFormatter = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat('nb-NO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatInt = intFormatter.format;
export const formatDecimal = decimalFormatter.format;
export const formatPercent = (value: number, decimals = 1) =>
  Intl.NumberFormat('nb-NO', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

interface FormatFileNameOptions {
  fromDate: string;
  toDate: string;
}

export const formatFileName = (name: string, ext: string, { fromDate, toDate }: FormatFileNameOptions): string => {
  const sanitizedName = name.replaceAll(DISALLOWED_FILENAME_CHARS, '').replaceAll(WHITESPACE_CHARS, '_');

  return `${sanitizedName}_${fromDate}_${toDate}.${ext}`;
};

const DISALLOWED_FILENAME_CHARS = /[^a-zA-Z0-9æøåÆØÅ\s-]/g;
const WHITESPACE_CHARS = /\s+/g;
