import { format, isValid, parse } from 'date-fns';
import { nb } from 'date-fns/locale';

export const formatMonthShortLabel = (dateString: string): string => {
  const date = parse(dateString, 'yyyy-MM', new Date());

  if (!isValid(date)) {
    console.error(`Invalid date string provided: ${dateString}`);
    return 'Invalid date';
  }

  const formatted = format(date, 'MMM yy', { locale: nb });
  return capitalizeFirstLetter(formatted);
};

export const formatMonthFullLabel = (dateString: string): string => {
  const date = parse(dateString, 'yyyy-MM', new Date());

  if (!isValid(date)) {
    console.error(`Invalid date string provided: ${dateString}`);
    return 'Invalid date';
  }

  const formatted = format(date, 'MMMM yyyy', { locale: nb });
  return capitalizeFirstLetter(formatted);
};

const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
