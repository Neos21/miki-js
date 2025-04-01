export const dateToJstDate = (date: Date): Date => {
  return new Date(date.getTime() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
};

export const epochTimeMsToJstDate = (epochTimeMs: string): Date => {
  return new Date(Number(epochTimeMs) + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
};

export const epochTimeMsToJstString = (epochTimeMs: string, format: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:SS'): string => {
  const date = epochTimeMsToJstDate(epochTimeMs);
  if(format === 'YYYY-MM-DD') {
    return date.getFullYear()
      + '-' + String(date.getMonth() + 1).padStart(2, '0')
      + '-' + String(date.getDate()).padStart(2, '0');
  }
  if(format === 'YYYY-MM-DD HH:mm') {
    return date.getFullYear()
      + '-' + String(date.getMonth() + 1).padStart(2, '0')
      + '-' + String(date.getDate()).padStart(2, '0')
      + ' ' + String(date.getHours()).padStart(2, '0')
      + ':' + String(date.getMinutes()).padStart(2, '0');
  }
  if(format === 'YYYY-MM-DD HH:mm:SS') {
    return date.getFullYear()
      + '-' + String(date.getMonth() + 1).padStart(2, '0')
      + '-' + String(date.getDate()).padStart(2, '0')
      + ' ' + String(date.getHours()).padStart(2, '0')
      + ':' + String(date.getMinutes()).padStart(2, '0')
      + ':' + String(date.getSeconds()).padStart(2, '0');
  }
  throw new Error('Invalid Format');
};
