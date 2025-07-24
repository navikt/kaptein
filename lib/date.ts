import { format as dateFnsformat, intlFormat } from 'date-fns';

export const PRETTY_DATETIME_FORMAT = 'dd. MMM yyyy HH:mm:ss';
export const PRETTY_DATE_FORMAT = 'dd. MMM yyyy';
export const ISO_DATETIME_FORMAT = 'yyyy-MM-ddTHH:mm:ss';
export const ISO_DATE_FORMAT = 'yyyy-MM-dd';

export const format = (date: Date, format: string) => dateFnsformat(date, format);

export const longFormat = (date: Date) =>
  intlFormat(date, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const textFormat = (date: Date) => intlFormat(date, { day: 'numeric', month: 'long', year: 'numeric' });
