import Schema from '../schema.js';
import { query } from '../index.js';
import where from './where.js';
import { methodKey } from '../common.js';
import { updateQueue } from '../queue.js';
import type { Paths, Condition, CTX } from '../common.js';

const { toString } = Object.prototype;

interface Entity { [i: string]: unknown }

interface Chain {
  ctx: CTX
  /**
   * where 逻辑过滤条件，等同于 and
   */
  where: (...fields: Condition[]) => UpdatePromise
  /**
   * and 逻辑过滤条件
   */
  and?: (...fields: Condition[]) => UpdatePromise
  /**
   * or 逻辑过滤条件
   */
  or?: (...fields: Condition[]) => UpdatePromise
  /**
   * 返回指定字段，未指定字段时，返回全部字段
   */
  return: (...fields: string[]) => UpdatePromise
  /**
   * 不返回指定字段
   */
  _return: (...fields: string[]) => UpdatePromise
  /**
   * 为符合匹配条件的数据赋值
   * @param entity 需要更新的数据
   */
  set: (entity: Entity) => UpdatePromise
}

export type UpdatePromise = Promise<any> & Partial<Chain>

export default function (schema: Schema, paths: Paths, result: (ctx: CTX) => any): UpdatePromise {

  const SET = [];

  const ctx = {
    schema,
    paths,
    SET,
    WHERE: [],
    RETURNING: [],
    body: undefined,
    error: undefined
  };

  const { fields } = schema;
  const { schema: schemaName, table } = paths;

  const chain: Chain = {
    ctx,
    where,
    /**
     * 
     * @param entity 需要更新的数据
     */
    set(entity: Entity) {

      if (toString.call(entity) !== '[object Object]') {
        throw ctx.error = new Error(' 值必须为 object 类型');
      }

      delete entity.createdAt;
      delete entity.updatedAt;

      for (const key in entity) {

        const options = fields[key];

        if (options) {

          const child = entity[key];

          if (typeof child === 'function') {

            SET.push(`"${key}" = ${child(key)}`);

          } else {

            const { error, value } = options[methodKey](child, [schemaName, table, key]); // 类型验证函数

            if (error) throw ctx.error = new Error(error);

            SET.push(`"${key}" = ${value}`);

          }

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

      for (const name of names) {
        if (fields[name]) {
          RETURNING.push(`"${name}"`);
        } else {
          throw ctx.error = new Error(`${name} 字段不存在`);
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
  }

  const promise = Promise.resolve().then(() => {
    for (const item of updateQueue) { item(ctx); }
    const { error } = ctx;
    if (error) {
      return { error };
    } else {
      return query(ctx).then(result);
    }
  });

  Object.assign(promise, chain);

  return promise;

};