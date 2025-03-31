export const isEmptyObject = (value: {[key: string]: any} | null | undefined): boolean => {
  if(value == null) return true;
  if(Object.keys(value).length === 0) return true;
  return false;
};
