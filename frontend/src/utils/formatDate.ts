import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  
  if (isYesterday(date)) {
    return 'Ayer';
  }
  
  return format(date, 'dd/MM/yyyy');
};

export const formatRelativeTime = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: es,
  });
};

export const formatFullDate = (timestamp: number): string => {
  return format(new Date(timestamp), "dd 'de' MMMM 'de' yyyy, HH:mm", {
    locale: es,
  });
};