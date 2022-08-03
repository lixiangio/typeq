import { methodKey } from './common.js';
import types, { type Types } from './types/index.js';

interface Field {
  /** 字段类型 */
  type: string,
  /** 主键 */
  primaryKey?: boolean
  /** 备注信息 */
  comment?: string
  /** 默认值 */
  default?: any,
  /** json 结构体 */
  struct?: object | any[]
  /** 可选字段 */
  optional?: boolean
  /** 唯一索引 */
  uniqueIndex?: boolean
  [methodKey]?: Function
}

/** 实体表字段集合 */
interface Fields { [name: string]: Field }

interface Struct { [name: string]: any }

const { integer, timestamp, array, object } = types;

const { hasOwnProperty, toString } = Object.prototype;

export class Schema {
  static types: Types = types
  struct: Struct
  fields: Fields = {}
  primaryKey: string // 主键名称
  constructor(struct: Struct) {

    this.struct = struct;

    const { fields } = this;

    for (const name in struct) {

      const node = struct[name];

      if (node instanceof Object) {

        const method = node[methodKey];

        if (method) {

          const field: Field = { type: node.name };

          const { struct } = node;

          if (struct) {

            field.struct = struct;
            field[methodKey] = (entity: object | any[], paths: string[]) => {
              const { error, value } = method(entity, paths);
              if (error) {
                return { error: `${name} ${error}` };
              } else {
                return { value: `json('${value}')` };
              }
            }

          } else {

            const { outputs } = node;

            field[methodKey] = (entity: string | number | Function, paths: string[]) => {
              const { error, value } = method(entity, paths);
              if (error) {
                return { error: `${name} ${error}` };
              } else {
                return outputs.sql(value);
              }
            }

          }

          const { options } = node;

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
            type: 'jsonb',
            struct: node,
            default: "'[]'::jsonb",
            [methodKey](entity: unknown[], paths: string[]) {
              const { error, value } = methond(entity, paths);
              if (error) {
                return { error: `${name}${error}` };
              } else {
                return { value: `json('${value}')` };
              }
            }
          };

        }

        // 将对象结构定义为对象类型选项
        else if (toString.call(node) === '[object Object]') {

          const methond = object(node)[methodKey];

          fields[name] = {
            type: 'jsonb',
            struct: node,
            default: "'{}'::jsonb",
            [methodKey](entity: object, paths: string[]) {
              const { error, value } = methond(entity, paths);
              if (error) {
                return { error: `${name}${error}` };
              } else {
                return { value: `json('${value}')` };
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

    // 无主键，默认将 id 字段设为主键
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
        [methodKey]: timestamp
      };

    }

    if (fields.updatedAt === undefined) {

      fields.updatedAt = {
        type: 'timestamp',
        default: 'now()',
        [methodKey]: timestamp
      };

    }

  }
}
