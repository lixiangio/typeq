import { methodKey } from '../common.js';
import type { Method, TypeOptions, QueryMethods } from './common.js';

/** 默认的 SQL、JSON 字符串输出前的差异化处理函数 */
const _outputs = {
  /** 输出为 SQL */
  sql(value: unknown) { return { value }; },
  /** 输出为 JSON */
  json(value: string) { return { value }; }
}

export type Outputs = typeof _outputs;

export interface TypeObject {
  /** 数据类型 */
  name: string
  outputs: Outputs
  /** 输出类型方法 */
  [methodKey]: Method
  /** 类型选项 */
  options: TypeOptions
}

export interface TypeFunction extends Function {
  /** 类型名称 */
  name: string
  outputs?: Outputs
  /** 类型方法 */
  [methodKey]?: Method
}

const { hasOwnProperty, toString } = Object.prototype;

/**
 * 创建类型函数
 * @param name 类型名称
 * @param methods 验证方法有序集合
 * @param outputs 输出类型方法集合，sql 或 json 字符串输出函数
 */
export default function Type(name: string, methods: QueryMethods, outputs: Outputs = _outputs): TypeFunction {

  /**
   * 类型声明方法
   * @param options 类型选项
   */
  function type(options?: TypeOptions): TypeObject {

    if (toString.call(options) !== '[object Object]') throw new Error("类型选项必须要为对象结构");

    options = { ...options, type: true };

    const typeQueue: { method: Function, param: any }[] = [];

    // 执行类型选项中的队列函数，上一个函数的返回值会作为下一个函数的输入参数
    for (const name in methods) {

      if (hasOwnProperty.call(options, name)) {

        const method = methods[name]; // 每个有效的 node[$name] 对应一个 methods[$name]() 处理函数
        const param = options[name];
        typeQueue.push({ method, param });

      }

    }

    const { set } = options;

    return {
      name,
      options,
      outputs,
      /**
       * 数据处理函数
       */
      [methodKey](entity: unknown, paths: string[]) {

        // 值为赋值函数，SQL 赋值函数会跳过验证器的校验与转换步骤，直接插入 SQL 赋值，因此存在注入风险
        if (typeof entity === 'function') return { value: entity(paths[2]) };

        if (set) return { value: set(entity) };

        // 执行类型选项对应的的类型函数队列，上一个函数的返回值会作为下一个函数的参数输入
        for (const { method, param } of typeQueue) {

          const { error, next, value } = method(entity, param, paths);

          if (error) {
            return { error };
          } else if (next === true) {
            entity = value;
          } else {
            return { value };
          }

        }

        return { value: entity };

      }
    };

  }

  Object.defineProperty(type, 'name', { value: name });
  Object.defineProperty(type, 'outputs', { value: outputs });

  /** 无参数状态下，仅做类型检查 */
  Object.defineProperty(type, methodKey, { value: methods.type });

  return type;

}

Type.baseMethods = {
  /** 
   * 默认值
   * @param value 实体数据
   * @param defaultValue 无参数时，默认的填充数据
   */
  default(value: unknown, defaultValue: string) {
    if (value === undefined) {
      return { value: `'|| ${defaultValue} ||'` };
    } else {
      return { value, next: true };
    }
  },
  /** 
   * 可选值
   * @param value 实体数据
   * @param isOptional 是否可选
   */
  optional(value: unknown, isOptional: boolean) {
    if (value === undefined) {
      if (isOptional === true) {
        return { value };
      } else {
        return { error: " value is not allowed to be empty" };
      }
    } else {
      return { value, next: true };
    }
  }
};
