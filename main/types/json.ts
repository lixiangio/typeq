import { methodKey } from '../common.js';
import Struct, { type StructFunction, type StructObject } from './createStruct.js';

export const json = Struct('json', {
  type(value: object) {
    if (typeof value === 'object') {
      return { value, next: true };
    } else {
      return { error: ` 值必须为 json 类型，实际赋值为 '${value}'` };
    }
  }
});

export const jsonb = Struct('jsonb', {
  type(value: object) {
    if (typeof value === 'object') {
      return { value, next: true };
    } else {
      return { error: ` 值必须为 jsonb 类型，实际赋值为 '${value}'` };
    }
  }
});

const { toString } = Object.prototype;

/** 值为严格对象类型 */
export const object = Struct("jsonb", {
  type(value: object) {
    if (toString.call(value) === '[object Object]') {
      return { value, next: true };
    } else {
      return { error: ` 值必须为 object 类型，实际赋值为 '${value}'` };
    }
  }
});

/** 值为 array 类型 */
export const array = Struct('jsonb', {
  type(value: unknown[]) {
    if (Array.isArray(value)) {
      return { value, next: true };
    } else {
      return { error: ` 值必须为 array 类型，实际赋值为 '${value}'` };
    }
  }
});

/**
 * 可选类型辅助函数
 * @param type 类型节点
 */
export function optional(type: StructFunction | StructObject | object | any[]) {

  const method: Function = type[methodKey];

  if (Array.isArray(type)) {

    return array(type, { optional: true });

  } else if (toString.call(type) === '[object Object]') {

    return object(type, { optional: true });

  } else if (method) {

    // type 为类型实例对象
    if (typeof type === 'object') {

      const { name, options } = type as StructObject;

      return {
        name,
        options: {
          ...options,
          optional: true
        },
        [methodKey]: method
      };

    }

    // type 为静态类型函数
    else if (typeof type === 'function') {

      const { name } = type as StructFunction;

      return {
        name,
        options: { optional: true },
        [methodKey]: method
      };

    }

  } else {

    throw new Error('optional() 可选类型函数参数无效');

  }

}
