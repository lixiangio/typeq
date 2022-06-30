import Type from './Type.js';
import Struct, { type StructFunction, type StructObject } from './Struct.js';
import { safetyValue } from '../safety.js';
import { methodKey } from '../common.js';
import isISO8601 from '../../validator/isISO8601.js';

const baseMethods = {
  /** 默认值 */
  default(entity, defaultValue) {
    if (entity === undefined) {
      return { value: defaultValue };
    } else {
      return { value: entity, next: true };
    }
  },
  /** 可选值 */
  optional(entity, isOptional: boolean) {
    if (entity === undefined) {
      if (isOptional === true) {
        return { value: entity };
      } else {
        return { error: " value is not allowed to be empty" };
      }
    } else {
      return { value: entity, next: true };
    }
  },
}


const integerMethods = {
  /** JSON 序列 */
  sequence(entity: number, isSequence: boolean, info, path: string) {
    if (entity === undefined && isSequence === true) {
      const { schema, table } = info;
      return { value: `' || nextval('${schema}.${table}.${path}') || '` };
    }
    return { value: entity, next: true };
  },
  ...baseMethods,
  type(entity: number) {
    if (Number.isInteger(entity)) {
      return { value: entity, next: true };
    } else {
      return { error: `值必须为 integer 类型，实际赋值为 '${entity}'` };
    }
  },
  // "*"() {
  //   return { value: '' };
  // },
  /**限制最小值 */
  min(entity: number, min: number) {
    if (entity < min) {
      return { error: `值不能小于 "${min}" 个字符` };
    } else {
      return { value: entity, next: true }
    }
  },
  /** 限制最大值 */
  max(entity: number, max: number) {
    if (entity > max) {
      return { error: `值不能大于 "${max}" 个字符` };
    } else {
      return { value: entity, next: true }
    }
  },
}

export const integer = Type('integer', integerMethods);
export const bigint = Type('bigint', integerMethods);

export const float = Type('float', {
  ...baseMethods,
  type(entity: number) {
    if (isNaN(entity) === false && parseFloat(String(entity)) !== NaN) {
      return { value: entity, next: true };
    } else {
      return { error: `值必须为 float 类型，实际赋值为 '${entity}'` };
    }
  }
})

export const number = float;



const stringMethods = {
  ...baseMethods,
  type(entity: string) {
    if (typeof entity === 'string') {
      return { value: safetyValue(entity), next: true };
    } else {
      return { error: `值必须为 string 类型，实际赋值为 '${entity}'` };
    }
  },
  /**限制最小长度 */
  min(entity: string, min: number) {
    if (entity.length < min) {
      return { error: `值长度不能小于 "${min}" 个字符` };
    } else {
      return { value: entity, next: true }
    }
  },
  /** 限制最大长度 */
  max(entity: string, max: number) {
    if (entity.length > max) {
      return { error: `值长度不能大于 "${max}" 个字符` };
    } else {
      return { value: entity, next: true }
    }
  },
  /** 正则 */
  reg(entity: string, reg: RegExp) {
    if (entity.search(reg) === -1) {
      return { error: '正则表达式匹配失败' };
    } else {
      return { value: entity, next: true };
    }
  },
};

export const char = Type('char', stringMethods);
export const varchar = Type('varchar', stringMethods);

export const string = varchar;
export const text = varchar;



export const boolean = Type('boolean', {
  ...baseMethods,
  type(entity: boolean) {
    if (typeof entity === 'boolean') {
      return { value: entity, next: true };
    } else {
      return { error: `值必须为 boolean 类型，实际赋值为 '${entity}'` };
    }
  }
})

export const date = Type('date', {
  ...baseMethods,
  type(entity: Date) {
    const date = Date.parse(String(entity));
    if (isNaN(date) === false) {
      return { value: `'${entity}'`, next: true };
    } else {
      return { error: `值必须为 date 类型，实际赋值为 '${entity}'` };
    }
  }
})

export const timestamp = Type('timestamp', {
  ...baseMethods,
  type(entity: Date) {
    // if (entity instanceof Date) {
    //   return { value: `'${entity.toISOString()}'`, next: true };
    // } 
    if (isISO8601(String(entity))) {
      return { value: `'${entity}'`, next: true };
    } else {
      return { error: `值必须为 timestamp 类型，实际赋值为 '${entity}'` };
    }
  }
})

export const range = Type('range', {
  ...baseMethods,
  type(entity: number[]) {
    if (Array.isArray(entity)) {
      if (entity.length == 2) {
        const [a, b] = entity;
        if (typeof a === 'number' && typeof b === 'number') {
          return { value: `'[${b}, ${b}]'`, next: true };
        } else {
          return { error: `range 内成员必须为 number 类型` };
        }
      } else {
        return { error: `range 长度必须等于 2` };
      }
    } else {
      return { error: `值必须为 range 类型，实际赋值为 '${entity}'` };
    }
  }
})

/**
 * integer 数组
 */
export const integers = Type('integer[]', {
  ...baseMethods,
  type(entity: number[]) {
    if (Array.isArray(entity)) {
      for (const item of entity) {
        if (Number.isInteger(item) === false) {
          return { error: `数组内成员必须为 integer 类型` };
        }
      }
      return { value: `{${entity.join()}}`, next: true };
    } else {
      return { error: `值必须为 integer[] 类型，实际赋值为 '${entity}'` };
    }
  }
})

export const json = Struct('json', {
  type(entity: object) {
    if (typeof entity === 'object') {
      return { value: entity, next: true };
    } else {
      return { error: `值必须为 json 类型，实际赋值为 '${json}'` };
    }
  }
});

export const jsonb = Struct('jsonb', {
  type(entity: object) {
    if (typeof entity === 'object') {
      return { value: entity, next: true };
    } else {
      return { error: `值必须为 jsonb 类型，实际赋值为 '${json}'` };
    }
  }
});

const { toString } = Object.prototype;

/** 值为严格对象类型 */
export const object = Struct("jsonb", {
  type(entity: object) {
    if (toString.call(entity) === '[object Object]') {
      return { value: entity, next: true };
    } else {
      return { error: `值必须为 object 类型，实际赋值为 '${entity}'` };
    }
  }
})

/** 值为 array 类型 */
export const array = Struct('jsonb', {
  type(entity: unknown[]) {
    if (Array.isArray(entity)) {
      return { value: entity, next: true };
    } else {
      return { error: `值必须为 array 类型，实际赋值为 '${entity}'` };
    }
  }
})

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
      }
    }

    // node 为静态类型函数
    else if (typeof node === 'function') {
      const { name } = node as StructFunction;
      return {
        name,
        options: { optional: true },
        [methodKey]: method
      }
    }

  } else {

    throw new Error('optional() 可选类型函数参数无效');

  }

}
