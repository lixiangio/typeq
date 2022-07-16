import Schema from '../schema.js';
import { deleteQueue } from '../queue.js';
import type { Options, CTX, Condition } from '../common.js';
import where from './where.js';

interface DeleteChain {
   ctx: CTX
   /**
    * where 逻辑过滤条件，等同于 and
    */
   where: (...fields: Condition[]) => DeletePromise
   /**
    * and 逻辑过滤条件
    */
   and?: (...fields: Condition[]) => DeletePromise
   /**
    * or 逻辑过滤条件
    */
   or?: (...fields: Condition[]) => DeletePromise
   /**
    * 返回指定字段，未指定字段时，返回全部字段
    */
   return: (...fields: string[]) => DeletePromise
   /**
    * 不返回指定字段
    */
   _return: (...fields: string[]) => DeletePromise
}

export interface DeletePromise extends Promise<any> { }
export interface DeletePromise extends Partial<DeleteChain> { }

export default function (schema: Schema, options: Options, result: (ctx: CTX) => any): DeletePromise {

   const { fields: schemaFields } = schema;

   const ctx = {
      schema,
      options,
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
         return deleteQueue(ctx).then(result);
      }
   });

   const chain: DeleteChain = {
      ctx,
      where,
      /**
       * 返回指定字段
       */
      return(...fields) {

         const RETURNING = [];

         for (const key of fields) {
            if (schemaFields[key]) {
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
       */
      _return(...fields: string[]) {

         const RETURNING = [];

         for (const key in schemaFields) {
            if (fields.includes(key) === false) {
               RETURNING.push(`"${key}"`);
            }
         }

         ctx.RETURNING = RETURNING;

         return this;

      }
   };

   Object.assign(promise, chain);

   return promise;

};