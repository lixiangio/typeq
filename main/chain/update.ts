import Schema from '../schema.js';
import where from './where.js';
import { methodKey } from '../common.js';
import { updateQueue } from '../queue.js';
import type { Options, BaseChain, Result, CTX } from '../common.js';

const { toString } = Object.prototype;

interface Entity { [index: string]: unknown }

interface Chain extends BaseChain<any> {
  update?: (data: Entity) => this
}

export default function (schema: Schema, options: Options, result: Result): Chain {

  const SET = [];

  const ctx: CTX = {
    schema,
    options,
    SET,
    WHERE: [],
    RETURNING: [],
    body: undefined,
    error: undefined
  };

  const promise = Promise.resolve().then(() => {
    const { error } = ctx;
    if (error) {
      return { error };
    } else {
      return updateQueue(ctx).then(result);
    }
  });

  const { fields } = schema;

  Object.assign(promise, {
    ctx,
    where,
    /**
     * 
     * @param entity 需要更新的数据
     */
    set(entity: Entity) {

      if (toString.call(entity) !== '[object Object]') {
        throw ctx.error = new Error('值必须为 object 类型');
      }

      delete entity.createdAt;
      delete entity.updatedAt;

      for (const key in entity) {

        const options = fields[key];

        if (options) {

          const child = entity[key];

          const { error, value } = options[methodKey](child, ctx.options, key); // 类型验证函数

          if (error) throw ctx.error = new Error(error);

          SET.push(`"${key}" = ${value}`);

        }

      }

      return this;

    },
    /**
     * 返回指定字段
     * @param names 包含字段名
     */
    return(...names: string[]) {

      const RETURNING = [];

      for (const key of names) {
        if (fields[key]) {
          RETURNING.push(`"${key}"`);
        } else {
          throw ctx.error = new Error(`${key} 字段不存在`);
        }
      }

      ctx.RETURNING = RETURNING;

      return this;

    },
    /**
     * 排除指定字段
     * @param names 排除字段名
     */
    _return(...names: string[]) {

      const RETURNING = [];

      for (const name in fields) {
        if (names.includes(name) === false) {
          RETURNING.push(`"${name}"`);
        }
      }

      ctx.RETURNING = RETURNING;

      return this;

    }
  });

  return promise;

};