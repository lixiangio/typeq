import { outputs as _outputs } from './common.js';
import { methodKey, type CTX, type Return } from '../common.js';
import type { Method, TypeOptions, Outputs } from './common.js';

const { toString } = Object.prototype;

/**
 *  校验 JSON 对象，输出安全的 JSON 字符串
 * @param type 结构类型
 * @param entity 实体数据
 * @param paths 字段路径
 */
function jsonConverter(type: any, entity: object | any[], paths: string[]): Return {

  const method = type[methodKey];

  if (method) {

    const { error, value } = method(entity, paths);

    if (error) return { error };

    return type.outputs.json(value);

  }

  // struct 选项值为对象
  else if (typeof type === "object") {

    // 数组结构
    if (Array.isArray(type)) {
      if (Array.isArray(entity)) {
        return jsonArray(type as any[], entity as any[], paths);
      } else {
        return { error: " 值必须为 array 类型" };
      }
    }

    // 对象结构
    else {

      if (toString.call(entity) === '[object Object]') {

        return jsonObject(type as object, entity as object, paths);

      } else {

        return { error: " 值必须为 object 类型" };

      }

    }

  } else {

    return { error: " 值必须为 json 类型" };

  }

}

/**
 * 对象结构
  * @param struct 结构类型
  * @param entity 输入数据
 */
function jsonObject(struct: object, entity: object, paths: string[]): Return {

  const items = [];

  for (const name in struct) {

    const { error, value } = jsonConverter(struct[name], entity[name], paths);

    if (error) {
      return { error: `.${name}${error}` };
    } else {
      items.push(`"${name}": ${value}`)
    }

  }

  return { value: `{${items.join()}}` };

}

/**
  * 数组结构
  * @param struct 结构类型
  * @param entity 输入数据
 */
function jsonArray(struct: any[], entity: any[], paths: string[]): Return {

  const items = [];
  let itemKey = 0;

  // struct 为单数时为弹性匹配，可匹配零个、一个或多个
  if (struct.length === 1) {

    const [option] = struct;

    for (const itemEntity of entity) {

      // 子集递归验证
      const { error, value } = jsonConverter(option, itemEntity, paths);

      if (error) {
        return { error: `[${itemKey}]${error}` };
      } else if (value !== undefined) {
        items.push(value);
      }

      itemKey++;

    }

  }

  // struct 为复数时表示国定位置匹配，类似元组
  // 如果要固定匹配一个，可以在第二个匹配位传入 undefined
  else {

    for (const item of struct) {

      // 子集递归验证
      const { error, value } = jsonConverter(item, entity[itemKey], paths);

      if (error) {
        return { error: `[${itemKey}]${error}` };
      } else if (value !== undefined) {
        items.push(value);
      }

      itemKey++;

    }

  }

  return { value: `[${items.join()}]` };

}

/** 类型选项映射方法的有序集合 */
export interface StructMethods {
  /**
   * 类型验证
   * @param entity 数据实体
   */
  type(entity: unknown): Return
  [index: string]: (entity: unknown, option: unknown, ctx: CTX, path: string) => Return
}

export interface StructObject {
  /** 类型名称 */
  name: string
  /** 结构体 */
  struct: object | any[]
  /** 类型选项 */
  options?: TypeOptions
  outputs?: Outputs
  /** 类型方法 */
  [methodKey]: Method
}

/**
 * 创建 JSON 数组、对象结构
 * @param name 类型名称 
 * @param methods 类型验证方法集合
 * @param outputs 后置输出函数集合
 */
export default function createStruct(name: string, struct: object | any[], options: TypeOptions, methods: StructMethods, outputs: Outputs = _outputs): StructObject {

  if (struct === undefined) throw new Error(`struct 参数不能为空`);

  return {
    name,
    struct,
    outputs,
    options,
    /**
     * 数据处理函数
     * @param entity 实体数据
     * @param paths 字段路径
     */
    [methodKey](entity, paths: string[]) {

      const { error } = methods.type(entity);

      if (error) {
        return { error };
      } else {
        return jsonConverter(struct, entity, paths);
      }

    }
  };

}
