export const passwordRules = [
  (value: string): boolean | string => {
    if(value.trim() === '') return '空値にはできません';
    if(!/^[\w!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/.test(value)) return '半角英数字と記号のみ使用できます';
    const minLength =  8;  // NOTE : テキトーに設定しておく
    const maxLength = 64;
    if(value.length < minLength || value.length > maxLength) return `${minLength} 文字以上 ${maxLength} 文字以内で入力してください`;
    return true;
  }
];
