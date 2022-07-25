import createType, { baseMethods, } from './createType.js';
import { methodKey, } from '../common.js';

interface Options {
  default?: string
  comment?: string,
  optional?: boolean
  uniqueIndex?: boolean
  min?: number
  max?: number
  reg?: RegExp
  length?: number
  set?: (value: string) => string
}

const methods = {
  ...baseMethods,
  type(value: string) {
    if (typeof value === 'string') {
      // SQL 单引号转义
      return { value: value.replace(/'/g, "''"), next: true };
    } else {
      return { error: ` 值必须为 string 类型，实际赋值为 '${value}'` };
    }
  },
  /**限制最小长度 */
  min(value: string, min: number) {
    if (value.length < min) {
      return { error: `值长度不能小于 "${min}" 个字符` };
    } else {
      return { value, next: true }
    }
  },
  /** 限制最大长度 */
  max(value: string, max: number) {
    if (value.length > max) {
      return { error: `值长度不能大于 "${max}" 个字符` };
    } else {
      return { value, next: true }
    }
  },
  /** 正则 */
  reg(value: string, reg: RegExp) {
    if (value.search(reg) === -1) {
      return { error: '正则表达式匹配失败' };
    } else {
      return { value, next: true };
    }
  },
  /**
   * 赋值函数
   */
  set(value: unknown, func: (value: unknown) => unknown) {

    return { value: func(value), next: true };

  }
};

const outputs = {
  /** 返回至 SQL */
  sql(value: string) {
    if (value === undefined) {
      return { value: "DEFAULT" };
    } else {
      return { value: `'${value}'` };
    }
  },
  /** 返回至 JSON */
  json(value: string) {
    if (value === undefined) {
      return { value: null };
    } else {
      // 在将 JSON 字符串插入至 SQL 之前，需要对 JSON 中的双引号、换行、回车等特殊字符进行转义，为合法的 JSON 字符串值
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String#parameters_3
      return { value: JSON.stringify(value) };
    }
  }
}

/** 
 * 固定长度字符串
 */
export function char(options: Options) {

  const name = (options && options.length) ? `char(${options.length})` : 'char';

  return createType(name, options, methods, outputs);

}

Object.defineProperty(char, 'outputs', { value: outputs });
Object.defineProperty(char, methodKey, { value: methods.type });


/** 可变长度字符串 */
export function varchar(options: Options) {

  const name = (options && options.length) ? `varchar(${options.length})` : 'varchar';

  return createType(name, options, methods, outputs);

}

Object.defineProperty(varchar, 'outputs', { value: outputs });
Object.defineProperty(varchar, methodKey, { value: methods.type });


/** 可变长度字符串，无预设长度约束 */
export function text(options: Options) {

  return createType('text', options, methods, outputs);

}

Object.defineProperty(text, 'outputs', { value: outputs });
Object.defineProperty(text, methodKey, { value: methods.type });


interface uuidOptions {
  default?: number
  optional?: boolean,
  comment?: string,
}

const uuidMethods = {
  ...baseMethods,
  type(value: string) {
    if (typeof value === 'string') {
      return { value: value.replace(/'/g, "''"), next: true };
    } else {
      return { error: ` 值必须为 uuid 类型，实际赋值为 '${value}'` };
    }
  }
}

/** 通用唯一标识符 */
export function uuid(options: uuidOptions) { return createType<uuidOptions>('uuid', options, uuidMethods, outputs); }

Object.defineProperty(uuid, 'outputs', { value: outputs });
Object.defineProperty(uuid, methodKey, { value: uuidMethods.type });
