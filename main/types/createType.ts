import { methodKey } from '../common.js';
import type { QueryMethods, Outputs, Method } from './common.js';

const { hasOwnProperty, toString } = Object.prototype;

export interface Return<Options> {
  /** 数据类型 */
  name: string
  outputs: Outputs
  /** 类型选项 */
  options: Options
  /** 输出类型方法 */
  [methodKey]: Method
}

/**
 * 创建类型
 * @param name 类型名称
 * @param options 
 * @param methods 
 * @param outputs 
 * @returns 
 */
export default function createType<Options>(name: string, options: Options, methods: QueryMethods, outputs: Outputs): Return<Options> {

  if (toString.call(options) !== '[object Object]') throw new Error("选项必须要为对象结构");

  const mixing = { ...options, type: true };

  const typeMethods: { method: Function, param: any }[] = [];

  // 执行类型选项中的队列函数，上一个函数的返回值会作为下一个函数的输入参数
  for (const index in methods) {

    if (hasOwnProperty.call(mixing, index)) {

      typeMethods.push({
        method: methods[index], // 每个有效的 options[$index] 对应一个 methods[$index]() 处理函数
        param: mixing[index]
      });

    }

  }

  return {
    name,
    options,
    outputs,
    /** 数据处理函数 */
    [methodKey](entity: unknown, paths: string[]) {

      // 值为赋值函数，SQL 赋值函数会跳过验证器的校验与转换步骤，直接插入 SQL 赋值，因此存在注入风险
      if (typeof entity === 'function') return { value: entity(paths[2]) };

      // 执行类型选项对应的的类型函数队列，上一个函数的返回值会作为下一个函数的参数输入
      for (const { method, param } of typeMethods) {

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

export const baseMethods = {
  /** 
   * 默认值
   * @param value 实体数据
   * @param defaultValue 无参数时，默认的填充数据
   */
  default(value: unknown, defaultValue: unknown) {
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
        return { value: undefined };
      } else {
        return { error: " value is not allowed to be empty" };
      }
    } else {
      return { value, next: true };
    }
  }
};

createType.baseMethods = baseMethods;
