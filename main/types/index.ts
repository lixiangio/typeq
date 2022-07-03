import Type from './Type.js';
import Struct, { type StructFunction, type StructObject } from './Struct.js';
import { sqlString, jsonString } from '../safety.js';
import { methodKey } from '../common.js';
import isISO8601 from '../../validator/isISO8601.js';

const CommonMethods = {
  /** 默认值 */
  default(value, defaultValue) {
    if (value === undefined) {
      return { value: defaultValue };
    } else {
      return { value, next: true };
    }
  },
  /** 可选值 */
  optional(value, isOptional: boolean) {
    if (value === undefined) {
      if (isOptional === true) {
        return { value };
      } else {
        return { error: " value is not allowed to be empty" };
      }
    } else {
      return { value, next: true };
    }
  },
}

const AfterMethods = {
  /** 返回至 SQL */
  sql(value: string) {
    return { value: `'${value}'` };
  },
  /** 返回至 JSON */
  json(value: string) {
    return { value: `"${value}"` };
  }
}

const IntegerMethods = {
  /** JSON 序列 */
  sequence(value: number, isSequence: boolean, info, path: string) {
    if (value === undefined && isSequence === true) {
      const { schema, table } = info;
      return { value: `' || nextval('${schema}.${table}.${path}') || '` };
    }
    return { value, next: true };
  },
  ...CommonMethods,
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
  },
}

export const integer = Type('integer', IntegerMethods);
export const bigint = Type('bigint', IntegerMethods);

export const float = Type('float', {
  ...CommonMethods,
  type(value: number) {
    if (isNaN(value) === false && parseFloat(String(value)) !== NaN) {
      return { value, next: true };
    } else {
      return { error: `值必须为 float 类型，实际赋值为 '${value}'` };
    }
  }
})

export const number = float;


const StringMethods = {
  ...CommonMethods,
  type(value: string) {
    if (typeof value === 'string') {
      return { value: sqlString(value), next: true };
    } else {
      console.log(value)
      return { error: `值必须为 string 类型，实际赋值为 '${value}'` };
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
  }
};

const StringAfterMethods = {
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
      return { value: `"${jsonString(value)}"` };
    }
  }
}

export const char = Type('char', StringMethods, StringAfterMethods);
export const varchar = Type('varchar', StringMethods, StringAfterMethods);

export const string = varchar;
export const text = varchar;

export const boolean = Type('boolean', {
  ...CommonMethods,
  type(value: boolean) {
    if (typeof value === 'boolean') {
      return { value, next: true };
    } else {
      return { error: `值必须为 boolean 类型，实际赋值为 '${value}'` };
    }
  }
})

export const date = Type('date', {
  ...CommonMethods,
  type(value: Date) {
    const date = Date.parse(String(value));
    if (isNaN(date) === false) {
      return { value, next: true };
    } else {
      return { error: `值必须为 date 类型，实际赋值为 '${value}'` };
    }
  }
}, AfterMethods);

export const timestamp = Type('timestamp', {
  ...CommonMethods,
  type(entity: Date) {
    // if (entity instanceof Date) {
    //   return { value: `'${entity.toISOString()}'`, next: true };
    // } 
    const value = String(entity);
    if (isISO8601(value)) {
      return { value, next: true };
    } else {
      return { error: `值必须为 timestamp 类型，实际赋值为 '${value}'` };
    }
  }
}, AfterMethods);

export const range = Type('range', {
  ...CommonMethods,
  type(value: number[]) {
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
      return { error: `值必须为 range 类型，实际赋值为 '${value}'` };
    }
  }
});

/** integer 数组 */
export const integers = Type('integer[]', {
  ...CommonMethods,
  type(value: number[]) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (Number.isInteger(item) === false) {
          return { error: `数组内成员必须为 integer 类型` };
        }
      }
      return { value: `{${value.join()}}`, next: true };
    } else {
      return { error: `值必须为 integer[] 类型，实际赋值为 '${value}'` };
    }
  }
});

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
