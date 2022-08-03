import where from './where.js';
import type { Model } from '../model.js';
import type { CTX, Condition } from '../common.js';

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

export default function (model: Model, result: (ctx: CTX) => any): DeletePromise {

   const { schema, client, options } = model;
   const { fields: schemaFields } = schema;

   const ctx = {
      schema,
      client,
      options,
      WHERE: [],
      RETURNING: [],
      SQL: undefined,
      body: undefined,
      error: undefined
   };

   const { deleteQueue } = client;

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

   const promise = Promise.resolve().then(() => {
      for (const item of deleteQueue) {
         item(ctx);
      }
      const { error } = ctx;
      if (error) {
         throw new Error(error);
      } else {
         return result(ctx);
      }
   });

   Object.assign(promise, chain);

   return promise;

};