import createType, { baseMethods } from './createType.js';
import { json, jsonb, object, array } from './json.js';
import { varchar, char, text, uuid } from './string.js';
import { integer, bigint, float4, float8, money } from './number.js';
import { date, timestamp } from './date.js';
import { methodKey } from '../common.js';
import { outputs, type TypeOptions, type Method } from './common.js';
import { type StructObject } from './createStruct.js';

const booleanMethods = {
  ...baseMethods,
  type(value: boolean) {
    if (typeof value === 'boolean') {
      return { value, next: true };
    } else {
      return { error: ` 值必须为 boolean 类型，实际赋值为 '${value}'` };
    }
  }
}

interface booleanOptions {
  default?: boolean
  comment?: string,
  optional?: boolean
}

/** 布尔类型 */
function boolean(options: booleanOptions) { return createType<booleanOptions>('boolean', options, booleanMethods, outputs); }

Object.defineProperty(boolean, 'outputs', { value: outputs });
Object.defineProperty(boolean, methodKey, { value: booleanMethods.type });


const rangeMethods = {
  ...baseMethods,
  type(value: [number, number]) {
    if (Array.isArray(value)) {
      if (value.length == 2) {
        const [a, b] = value;
        if (typeof a === 'number' && typeof b === 'number') {
          return { value: `'[${b}, ${b}]'`, next: true };
        } else {
          return { error: `range 内成员必须为 number 类型` };
        }
      } else {
        return { error: `range 长度必须等于 2` };
      }
    } else {
      return { error: ` 值必须为 range 类型，实际赋值为 '${value}'` };
    }
  }
}

interface rangeOptions {
  default?: [number, number]
  comment?: string,
  optional?: boolean
}

/** 范围匹配 */
function range(options: rangeOptions) { return createType<rangeOptions>('range', options, rangeMethods, outputs); }

Object.defineProperty(range, 'outputs', { value: outputs });
Object.defineProperty(range, methodKey, { value: rangeMethods.type });


/** integer 数组 */

const integersMethods = {
  ...baseMethods,
  type(value: [number, number]) {
    if (Array.isArray(value)) {
      if (value.length == 2) {
        const [a, b] = value;
        if (typeof a === 'number' && typeof b === 'number') {
          return { value: `'[${b}, ${b}]'`, next: true };
        } else {
          return { error: `range 内成员必须为 number 类型` };
        }
      } else {
        return { error: `range 长度必须等于 2` };
      }
    } else {
      return { error: ` 值必须为 range 类型，实际赋值为 '${value}'` };
    }
  }
}

interface integersOptions {
  default?: number[]
  comment?: string,
  optional?: boolean
}

/** integer 数组 */
function integers(options: integersOptions) { return createType<integersOptions>('integer[]', options, integersMethods, outputs); }

Object.defineProperty(integers, 'name', { value: 'integer[]' });
Object.defineProperty(integers, 'outputs', { value: outputs });
Object.defineProperty(integers, methodKey, { value: integersMethods.type });


export interface StructFunction {
  (struct: object | any[], options?: TypeOptions): StructObject
  /** 类型名称 */
  name: string
  /** 类型方法 */
  [methodKey]?: Method
}

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

    // type 为类型对象
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

    // type 为类型函数
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


const types = {
  integer,
  int: integer,
  bigint,
  float4,
  float8,
  number: float8,
  money,
  char,
  varchar,
  text,
  string: text,
  boolean,
  bool: boolean,
  date,
  timestamp,
  range,
  integers,
  json,
  jsonb,
  object,
  array,
  uuid,
  optional
}

export type Types = (typeof types) & { [index: string]: (...param: unknown[]) => unknown }

export default types;
