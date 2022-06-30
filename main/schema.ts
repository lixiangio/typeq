import * as types from './types/index.js';
import { methodKey } from './common.js';

interface Field {
  /** 字段类型 */
  type: string,
  /** 主键 */
  primaryKey?: boolean
  /** 备注信息 */
  comment?: string
  /** 默认值 */
  default?: any,
  /** JSON 结构体 */
  struct?: object | any[]
  /** 可选字段 */
  optional?: boolean
  [methodKey]: Function
}

/** 实体表字段集合 */
interface Fields { [name: string]: Field }

// interface Keys {
//   [name: string]: string
// }

interface Struct { [index: string]: any }

const { integer, timestamp, array, object } = types;

const { hasOwnProperty } = Object.prototype;

export default class Schema {
  static types = types
  primaryKey: string // 主键名称
  fields: Fields = {}
  constructor(struct: Struct) {

    const { fields } = this;

    for (const name in struct) {

      const node = struct[name];

      if (node instanceof Object) {

        const method = node[methodKey];

        // 将带有 methodKey 属性的类型对象或类型函数定义为与之对应的类型选项
        if (method) {

          const field: Field = {
            type: node.name,
            [methodKey](entity, ctx, name) {
              const { error, value } = method(entity, ctx, name);
              if (error) {
                return { error: `${name} ${error}` };
              } else {
                return { value };
              }
            }
          };

          const { struct, options } = node;

          if (struct) field.struct = struct;

          if (options) {

            if (hasOwnProperty.call(options, 'default')) {
              field.default = options.default;
            }

            const { comment, optional } = options;

            if (comment) {
              field.comment = comment;
            }

            if (optional) {
              field.optional = optional;
            }

            if (options.primaryKey === true) {
              if (this.primaryKey === undefined) {
                this.primaryKey = name;
                field.primaryKey = true;
                field.default = 'DEFAULT';
              } else {
                throw new Error(`主键 ${this.primaryKey} 与主键 ${name} 之间存在唯一性冲突，禁止在同一个模型中定义多个主键`);
              }
            }

          }

          fields[name] = field;

        }

        // 将数组结构定义为数组类型选项
        else if (Array.isArray(node)) {

          const methond = array(node)[methodKey];

          fields[name] = {
            type: 'array',
            struct: node,
            default: "'[]'::jsonb",
            [methodKey](entity, ctx, name) {
              const { error, value } = methond(entity, ctx, name);
              if (error) {
                return { error: `${name}${error}` };
              } else {
                return { value: `'${value}'::jsonb` };
              }
            }
          };

        }

        // 将对象结构定义为对象类型选项
        else if (toString.call(node) === '[object Object]') {

          const methond = object(node)[methodKey];

          fields[name] = {
            type: 'object',
            struct: node,
            default: "'{}'::jsonb",
            [methodKey](entity, ctx, name) {
              const { error, value } = methond(entity, ctx, name);
              if (error) {
                return { error: `${name}${error}` };
              } else {
                return { value: `'${value}'::jsonb` };
              }
            }
          };

        } else {

          throw new Error(`${name} 字段声明无效`);

        }

      } else {

        throw new Error(`${name} 字段声明无效`);

      }

    }

    // 无主键时，将 id 字段设为默认主键
    if (this.primaryKey === undefined) {

      this.primaryKey = 'id';

      fields.id = {
        type: 'integer',
        primaryKey: true,
        default: 'DEFAULT',
        [methodKey]: integer
      };

    }

    if (fields.createdAt === undefined) {

      fields.createdAt = {
        type: 'timestamp',
        default: 'now()',
        [methodKey]: timestamp,
      };

    }

    if (fields.updatedAt === undefined) {

      fields.updatedAt = {
        type: 'timestamp',
        default: 'now()',
        [methodKey]: timestamp,
      };

    }

  }
}
