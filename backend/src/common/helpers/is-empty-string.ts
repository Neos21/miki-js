export const isEmptyString = (value: string | null | undefined): boolean => {
  if(value == null) return true;
  if(value === '') return true;
  if(String(value).trim() === '') return true;
  return false;
};
