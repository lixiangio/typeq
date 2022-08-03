import isISO8601 from '../../types/validator/isISO8601.js';
import { createType, baseMethods } from './createType.js';
import { methodKey } from '../common.js';

interface Options {
  /** 默认值 */
  default?: string
  /** 备注 */
  comment?: string,
  /** 可选 */
  optional?: boolean
}

const dateMethods = {
  ...baseMethods,
  type(value: Date) {
    const date = Date.parse(String(value));
    if (isNaN(date) === false) {
      return { value, next: true };
    } else {
      return { error: `值必须为 date 类型，实际赋值为 '${value}'` };
    }
  },
};

const outputs = {
  /** 返回至 SQL */
  sql(value: string) {
    return { value: `'${value}'` };
  },
  /** 返回至 JSON */
  json(value: string) {
    return { value: `"${value}"` };
  }
}

export function date(options: Options) { return createType('date', options, dateMethods, outputs); }

date.outputs = outputs;
date[methodKey] = dateMethods.type;

const timestampMethods = {
  ...baseMethods,
  type(entity: Date) {
    // if (entity instanceof Date) {
    //   return { value: `'${entity.toISOString()}'` };
    // } 
    const value = String(entity);
    if (isISO8601(value)) {
      return { value, next: true };
    } else {
      return { error: `值必须为 timestamp 类型，实际赋值为 '${value}'` };
    }
  }
};

export function timestamp(options: Options) { return createType('timestamp', options, timestampMethods, outputs); }

timestamp.outputs = outputs;
timestamp[methodKey] = timestampMethods.type;

