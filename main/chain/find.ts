import where from './where.js';
import { findQueue } from '../queue.js';
import type { BaseChain, Options, Result } from '../common.js';
import Schema from '../schema.js';

const directions = { 'desc': "DESC", 'asc': "ASC" };

interface Directions { [field: string]: 'desc' | 'asc' }

interface Chain extends Partial<BaseChain> {
   group: (...fields: string[]) => FindPromise
   order: (options: Directions) => FindPromise
   offset: (value: number) => FindPromise
   limit: (value: number) => FindPromise
   count: (isNewQueue: boolean) => FindPromise
}

export type FindPromise = Promise<any> & Partial<Chain>

export default function (schema: Schema, options: Options, result: Result): FindPromise {

   const SELECT = [], ORDER = [], GROUP = [];

   const ctx = {
      options,
      schema,
      SELECT,
      WHERE: [],
      GROUP,
      ORDER,
      OFFSET: 0,
      LIMIT: 0,
      body: undefined,
      error: undefined
   };

   const schemaFields = schema.fields;

   const promise = Promise.resolve().then(() => {
      const { error } = ctx;
      if (error) {
         return { error };
      } else {
         return findQueue(ctx).then(result);
      }
   });

   const chain: Chain = {
      ctx,
      where,
      order(options: Directions) {

         const ORDER = [];

         for (const field in options) {

            const direction = directions[options[field]];

            if (direction) {
               if (schemaFields[field]) {
                  ORDER.push(`"${field}" ${direction}`);
               } else {
                  throw ctx.error = new Error(`${field} 字段不存在`);
               }
            }

         }

         ctx.ORDER = ORDER;

         return this;

      },
      group(...fields: string[]) {

         for (const name of fields) {
            if (schemaFields[name]) {
               GROUP.push(`"${name}"`);
            } else {
               throw ctx.error = new Error(`${name} 字段不存在`);
            }
         }

         return this;

      },
      /**
       * 定义行起的始位置
       * @param value 
       */
      offset(value: number) {

         ctx.OFFSET = value;

         return this;

      },
      /**
       * 限制返回结果数量
       * @param value 
       */
      limit(value: number) {

         ctx.LIMIT = value;

         return this;

      },
      /**
       * 返回指定列
       * @param fields 包含字段
       */
      return(...fields) {

         for (const field of fields) {
            if (typeof field === 'string') {
               if (schemaFields[field]) {
                  SELECT.push(`"${field}"`);
               } else {
                  throw ctx.error = new Error(`${field} 字段不存在`);
               }
            } else if (typeof field === 'function') {
               SELECT.push(field());
            }
         }

         return this;

      },
      /**
       * 排除指定列
       * @param fields 排除字段
       */
      _return(...fields: string[]) {

         for (const name in schemaFields) {
            if (fields.includes(name) === false) {
               SELECT.push(`"${name}"`);
            }
         }

         return this;

      },
      /**
       * 获取数据总数，复制当前实例上下文并创建新的查询
       * @param newQueue 是否创建新 Promise 实例
       */
      count(isNewQueue = false) {

         const SELECT = ['count(*)::integer'];

         if (isNewQueue) {

            return Promise.resolve().then(() => {
               return findQueue({
                  ...ctx,
                  SELECT
               }).then(ctx => ctx.body.rows[0])
            });

         } else {

            /** 替换返回值处理函数，改变输出结果 */
            result = ctx => ctx.body.rows[0];

            ctx.SELECT = SELECT;

            return this;

         }

      },
   }

   Object.assign(promise, chain);

   return promise;

};
