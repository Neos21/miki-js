import { isObject } from './is-object';

import type { CamelToSnakeCaseObject, SnakeToCamelCaseObject } from '../types/cases';

/** camelCase → snake_case */
export const camelToSnakeCase = (value: string): string => {
  return value.replace((/[A-Z]/g), character => `_${character.toLowerCase()}`);
};

/** camelCase → snake_case オブジェクト */
export const camelToSnakeCaseObject = <T extends object>(object: T): CamelToSnakeCaseObject<T> => {
  if(object instanceof Date) {
    return object.getTime().toString() as CamelToSnakeCaseObject<T>;
  }
  else if(Array.isArray(object)) {
    return object.map(item => camelToSnakeCaseObject(item)) as CamelToSnakeCaseObject<T>;
  }
  else if(isObject(object)) {
    return Object.entries(object).reduce((accumulator, [camelKey, value]) => {
      if(object instanceof Date) {
        return object.getTime().toString() as CamelToSnakeCaseObject<T>;
      }
      else if(Array.isArray(value)) {
        (accumulator as any)[camelToSnakeCase(camelKey)] = value.map(item => camelToSnakeCaseObject(item));
      }
      else if(isObject(value)) {
        (accumulator as any)[camelToSnakeCase(camelKey)] = camelToSnakeCaseObject(value);
      }
      else {
        (accumulator as any)[camelToSnakeCase(camelKey)] = value;
      }
      return accumulator;
    }, {}) as CamelToSnakeCaseObject<T>;
  }
  return object as CamelToSnakeCaseObject<T>;
};

/** snake_case → camelCase */
export const snakeToCamelCase = (value: string): string => {
  return value.replace((/_([a-z])/g), (_, character) => character.toUpperCase());
};

/** snake_case → camelCase オブジェクト */
export const snakeToCamelCaseObject = <T extends object>(object: T): SnakeToCamelCaseObject<T> => {
  if(object instanceof Date) {
    return object.getTime().toString() as SnakeToCamelCaseObject<T>;
  }
  else if(Array.isArray(object)) {
    return object.map(item => snakeToCamelCaseObject(item)) as SnakeToCamelCaseObject<T>;
  }
  else if(isObject(object)) {
    return Object.entries(object).reduce((accumulator, [snakeKey, value]) => {
      if(object instanceof Date) {
        return object.getTime().toString() as SnakeToCamelCaseObject<T>;
      }
      else if(Array.isArray(value)) {
        (accumulator as any)[snakeToCamelCase(snakeKey)] = value.map(item => snakeToCamelCaseObject(item));
      }
      else if(isObject(value)) {
        (accumulator as any)[snakeToCamelCase(snakeKey)] = snakeToCamelCaseObject(value);
      }
      else {
        (accumulator as any)[snakeToCamelCase(snakeKey)] = value;
      }
      return accumulator;
    }, {}) as SnakeToCamelCaseObject<T>;
  }
  return object as SnakeToCamelCaseObject<T>;
};
