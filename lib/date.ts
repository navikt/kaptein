import { format } from 'date-fns';

export const ISO_DATE_FORMAT = 'yyyy-MM-dd';
export const PRETTY_DATE_FORMAT = 'dd.MM.yyyy';

export const NOW = new Date();
export const TODAY = format(NOW, ISO_DATE_FORMAT);
