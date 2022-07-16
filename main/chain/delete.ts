import Schema from '../schema.js';
import { deleteQueue } from '../queue.js';
import type { Options, BaseChain, Result } from '../common.js';
import where from './where.js';

interface Chain extends Partial<BaseChain> { }

export type DeletePromise = Promise<any> & Partial<Chain>

export default function (schema: Schema, options: Options, result: Result): DeletePromise {

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

   const chain: Chain = {
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
   }

   Object.assign(promise, chain);

   return promise;

};