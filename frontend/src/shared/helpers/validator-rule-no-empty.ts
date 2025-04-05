export const validatorRuleNoEmpty = (value: string): boolean | string => {
  if(value.trim() === '') return '空値にはできません';
  return true;
};
