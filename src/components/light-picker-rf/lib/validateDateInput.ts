import moment from 'moment';

export const validateDateInput = (value: string): boolean => {
  if (typeof value !== 'string') return false;

  const acceptedFormats = ['DD/MM/YYYY', 'YYYY-MM-DD'];
  const date = moment(value, acceptedFormats, true);

  if (!date.isValid()) return false;
  if (date.isBefore(moment(), 'day')) return false;

  return true;
};
