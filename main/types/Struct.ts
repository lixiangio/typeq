import { safetyJson } from '../safety.js';
import { methodKey, type CTX, type Return } from '../common.js';
import type { Method, TypeOptions, OptionMethods } from './common.js';

export interface StructFunction extends Function {
  /** 类型名称 */
  name: string
  /** 类型方法 */
  [methodKey]?: Method
}

export interface StructObject {
  /** 类型名称 */
  name: string
  /** 结构体 */
  struct?: object | any[]
  /** 类型选项 */
  options?: TypeOptions
  /** 类型方法 */
  [methodKey]?: Method
}

const { toString } = Object.prototype;

/**
 * 类型校验、合并输出安全的 JSON 字符串
 * @param struct 结构类型
 * @param entity 实体数据
 * @param ctx 查询上下文
 * @param path 数据路径
 */
function jsonConverter(struct: object | any[], entity: object | any[], ctx: CTX, path: string): Return {

  const method = struct[methodKey];

  if (method) {

    // if (struct.name === 'string') {}

    return method(entity, ctx, path);
    
  }

  // struct 选项值为对象
  else if (typeof struct === "object") {

    // 数组结构
    if (Array.isArray(struct)) {
      if (Array.isArray(entity)) {
        return jsonArray(struct as any[], entity as any[], ctx, path);
      } else {
        return { error: "值必须为 array 类型" };
      }
    }

    // 对象结构
    else {

      if (toString.call(entity) === '[object Object]') {

        return jsonObject(struct as object, entity as object, ctx, path);

      } else {

        return { error: "值必须为 object 类型" };

      }

    }

  } else {

    return { error: "值必须为 json 类型" };

  }

}

/**
 * 对象结构
  * @param struct 结构类型
  * @param entity 输入数据
 */
function jsonObject(struct: object, entity: object, ctx: CTX, path: string): Return {

  const items = [];

  for (const name in struct) {

    const { error, value } = jsonConverter(struct[name], entity[name], ctx, path);

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
function jsonArray(struct: any[], entity: any[], ctx: CTX, path: string): Return {

  let itemKey = 0;
  const items = [];

  // struct 为单数时为弹性匹配，可匹配零个、一个或多个
  if (struct.length === 1) {

    const [option] = struct;

    for (const itemEntity of entity) {

      // 子集递归验证
      const { error, value } = jsonConverter(option, itemEntity, ctx, path);

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

    for (const option of struct) {

      // 子集递归验证
      const { error, value } = jsonConverter(option, entity[itemKey], ctx, path);

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

/**
 * 创建 JSON 数组、对象结构类型函数
 */
export default function Struct(name: string, methods: OptionMethods): StructFunction {

  const { type: typeMethod } = methods;

  function type(struct: object | any[], options?: TypeOptions): StructObject {

    if (struct === undefined) throw new Error(`struct 参数不能为空`);

    return {
      name,
      struct,
      options,
      /**
       * 数据处理函数
       * @param entity 实体数据
       */
      [methodKey](entity, ctx, path) {

        // const { set, default: _default } = options;

        // if (set) { value = set(value); }

        // // 空值处理选项
        // else if (value === undefined) {

        //   // 填充默认值
        //   if (hasOwnProperty.call(options, 'default')) {
        //     value = _default;
        //   } else {
        //     return { error: " value is not allowed to be empty" };
        //   }

        // }

        const result = typeMethod(entity); // 基础类型校验

        if (result.error) {
          return result;
        } else {
          return jsonConverter(struct, entity, ctx, path);
        }

      }
    };
  }

  Object.defineProperty(type, 'name', { value: name });

  Object.defineProperty(type, methodKey, {
    value(entity: any) {
      const { error } = typeMethod(entity);
      if (error) {
        return { error };
      } else {
        return { value: safetyJson(entity) };
      }
    }
  });

  return type;

}