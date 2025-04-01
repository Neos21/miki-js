export const titleRules = [
  (value: string): boolean | string => {
    if(value.trim() === '') return '空値にはできません';
    if(/^\s+|\s+$/g.test(value)) return '先頭や末尾には空白文字を入力できません';
    const maxLength = 50;  // NOTE : テキトーに設定しておく
    if(value.length > maxLength) return `${maxLength} 文字以内で入力してください`;
    return true;
  }
];
