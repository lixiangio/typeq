import { methodKey } from '../common.js';
import Struct, { type StructFunction, type StructObject } from './createStruct.js';

export const json = Struct('json', {
  type(value: object) {
    if (typeof value === 'object') {
      return { value, next: true };
    } else {
      return { error: `值必须为 json 类型，实际赋值为 '${value}'` };
    }
  }
});

export const jsonb = Struct('jsonb', {
  type(value: object) {
    if (typeof value === 'object') {
      return { value, next: true };
    } else {
      return { error: `值必须为 jsonb 类型，实际赋值为 '${value}'` };
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
      return { error: `值必须为 object 类型，实际赋值为 '${value}'` };
    }
  }
});

/** 值为 array 类型 */
export const array = Struct('jsonb', {
  type(value: unknown[]) {
    if (Array.isArray(value)) {
      return { value, next: true };
    } else {
      return { error: `值必须为 array 类型，实际赋值为 '${value}'` };
    }
  }
});

/**
 * 可选类型辅助函数
 * @param node 类型节点
 */
export function optional(node: StructFunction | StructObject | object | any[]) {

  const method: Function = node[methodKey];

  if (Array.isArray(node)) {

    return array(node, { optional: true });

  } else if (toString.call(node) === '[object Object]') {

    return object(node, { optional: true });

  } else if (method) {

    // node 为类型实例对象
    if (typeof node === 'object') {

      const { name, options } = node as StructObject;

      return {
        name,
        options: {
          ...options,
          optional: true
        },
        [methodKey]: method
      };

    }

    // node 为静态类型函数
    else if (typeof node === 'function') {

      const { name } = node as StructFunction;

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
