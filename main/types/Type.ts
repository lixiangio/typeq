import { methodKey } from '../common.js';
import type { Method, TypeOptions, OptionMethods } from './common.js';

export interface TypeFunction extends Function {
  /** 类型名称 */
  name: string
  /** 类型方法 */
  [methodKey]?: Method
}

interface TypeObject {
  /** 数据类型 */
  name: string
  /** 类型选项 */
  options?: TypeOptions
  /** 类型方法 */
  [methodKey]?: Method
}

const { hasOwnProperty, toString } = Object.prototype;

/**
 * 创建类型函数
 * @param name 类型名称
 * @param methods 验证方法
 */
export default function Type(name: string, methods: OptionMethods): TypeFunction {

  /**
   * 类型声明方法
   * @param options 类型选项
   */
  function type(options?: TypeOptions): TypeObject {

    if (toString.call(options) !== '[object Object]') throw new Error("类型选项必须要为对象结构");

    interface QueueItem {
      method: Function, param: any
    }

    options.type = true;

    const queue: QueueItem[] = [];

    // 执行类型选项中的队列函数，上一个函数的返回值会作为下一个函数的输入参数
    for (const name in methods) {

      if (hasOwnProperty.call(options, name)) {

        const method = methods[name]; // 每个有效的 node[$name] 对应一个 methods[$name]() 处理函数
        const param = options[name];
        queue.push({ method, param });

      }

    }

    const { set } = options;

    return {
      name,
      options,
      /**
       * 数据处理函数
       */
      [methodKey](entity, tableinfo, path) {

        // 值为赋值函数，SQL 赋值函数会跳过验证器的校验与转换步骤，直接插入 SQL 赋值，因此存在注入风险
        if (typeof entity === 'function') return { value: entity(path) };

        if (set) return { value: set(entity) };

        // console.log(queue)

        // 执行类型选项中的队列函数，上一个函数的返回值会作为下一个函数的输入参数
        for (const { method, param } of queue) {

          const { error, next, value } = method(entity, param, tableinfo, path);

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

  /** 无参数状态下，仅做类型检查 */
  Object.defineProperty(type, methodKey, {
    value(entity) {
      const { error, value } = methods.type(entity);
      if (error) {
        return { error }
      } else {
        return { value };
      }
    }
  });

  return type;

}
