import { createType, baseMethods } from './createType.js';
import { methodKey } from '../common.js';
import { outputs } from './common.js';

interface Options {
  sequence?: string
  default?: number
  comment?: string,
  optional?: boolean
  primaryKey?: boolean
  uniqueIndex?: boolean
  min?: number
  max?: number
}

const intMethods = {
  /** JSON 中的自增序列 */
  sequence(value: number, name: string, [schema, table]: string[]) {
    if (value === undefined) {
      return { value: `' || nextval('"${schema}"."${table}.${name}"') || '` };
    }
    return { value, next: true };
  },
  ...baseMethods,
  type(value: number) {
    if (Number.isInteger(value)) {
      return { value, next: true };
    } else {
      return { error: `值必须为 integer 类型，实际赋值为 '${value}'` };
    }
  },
  /**限制最小值 */
  min(value: number, min: number) {
    if (value < min) {
      return { error: `值不能小于 "${min}" 个字符` };
    } else {
      return { value, next: true }
    }
  },
  /** 限制最大值 */
  max(value: number, max: number) {
    if (value > max) {
      return { error: `值不能大于 "${max}" 个字符` };
    } else {
      return { value, next: true }
    }
  }
};

/**
 * integer 类型
 * @param options 类型选项
 */
export function integer(options: Options) { return createType('integer', options, intMethods, outputs); }

integer.outputs = outputs;
integer[methodKey] = intMethods.type;


export function bigint(options: Options) { return createType('bigint', options, intMethods, outputs); }

bigint.outputs = outputs;
bigint[methodKey] = intMethods.type;

const floatMethods = {
  ...baseMethods,
  type(value: number) {
    if (isNaN(value) === false && parseFloat(String(value)) !== NaN) {
      return { value, next: true };
    } else {
      return { error: `值必须为 float 类型，实际赋值为 '${value}'` };
    }
  },
  /**限制最小值 */
  min(value: number, min: number) {
    if (value < min) {
      return { error: `值不能小于 "${min}" 个字符` };
    } else {
      return { value, next: true }
    }
  },
  /** 限制最大值 */
  max(value: number, max: number) {
    if (value > max) {
      return { error: `值不能大于 "${max}" 个字符` };
    } else {
      return { value, next: true }
    }
  }
};


export function float4(options: Omit<Options, 'sequence'>) { return createType('float4', options, floatMethods, outputs); }

float4.outputs = outputs;
float4[methodKey] = floatMethods.type;


export function float8(options: Omit<Options, 'sequence'>) { return createType('float8', options, floatMethods, outputs); }

float8.outputs = outputs;
float8[methodKey] = floatMethods.type;


export function money(options: Omit<Options, 'sequence'>) { return createType('money', options, floatMethods, outputs); }

money.outputs = outputs;
money[methodKey] = floatMethods.type;
