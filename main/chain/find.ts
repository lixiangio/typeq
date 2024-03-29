import where from './where.js';
import { type Model } from '../model.js';
import type { Condition, CTX, Data } from '../common.js';

const directions = { 'desc': "DESC", 'asc': "ASC" };

interface Directions { [field: string]: 'desc' | 'asc' }

export type FindPromise<T = Data[]> = Promise<T> & Partial<{
   ctx: CTX
   /** where 逻辑过滤条件，等同于 and */
   where: (...fields: Condition[]) => FindPromise<T>
   /** and 逻辑过滤条件 */
   and?: (...fields: Condition[]) => FindPromise<T>
   /** or 逻辑过滤条件 */
   or?: (...fields: Condition[]) => FindPromise<T>
   /** 字段聚合 */
   group: (...fields: string[]) => FindPromise<T>
   /** 字段排序 */
   order: (options: Directions) => FindPromise<T>
   /** 返回数据的起始位置 */
   offset: (value: number) => FindPromise<T>
   /** 限制返回数量 */
   limit: (value: number) => FindPromise<T>
   /** 返回指定字段，未指定字段时，返回全部字段  */
   return: (...fields: string[]) => FindPromise<T>
   /** 不返回指定字段 */
   _return: (...fields: string[]) => FindPromise<T>
   /** 统计数据总量 */
   count: (isNewQueue?: boolean) => FindPromise<T>
}>;

export default function <T>(model: Model, result: (ctx: CTX) => Promise<any>): FindPromise<T> {

   const { schema, client, options } = model;

   const ORDER = [], GROUP = [];

   const ctx = {
      schema,
      client,
      options,
      SELECT: [],
      WHERE: [],
      GROUP,
      ORDER,
      OFFSET: 0,
      LIMIT: 0,
      SQL: undefined,
      body: undefined,
      error: undefined
   };

   const { fields: schemaFields } = schema;
   const { findQueue } = client;

   const chain = {
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
      /**
       * 聚合查询
       * @param fields 一个或多个字段名
       */
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
       * 定义分页起始始位置
       * @param value 分页起始值
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
      return(...fields: string[]) {

         const SELECT = [];

         for (const field of fields) {
            if (schemaFields[field]) {
               SELECT.push(`"${field}"`);
            } else {
               throw ctx.error = new Error(`${field} 字段不存在`);
            }
         }

         ctx.SELECT = SELECT;

         return this;

      },
      /**
       * 排除指定列
       * @param fields 排除字段
       */
      _return(...fields: string[]) {

         const SELECT = [];

         for (const name in schemaFields) {
            if (fields.includes(name) === false) {
               SELECT.push(`"${name}"`);
            }
         }

         ctx.SELECT = SELECT;

         return this;

      },
      /**
       * 获取数据总量，复制当前实例上下文并创建新的查询
       * @param isNewQueue 是否创建的新实例，不改变当前实例状态
       */
      count(isNewQueue = false) {

         const SELECT = ['count(*)::integer'];

         if (isNewQueue) {

            const ctx_ = { ...ctx, SELECT };

            for (const item of findQueue) { item(ctx_); }

            const { error } = ctx_;

            if (error) {
               throw new Error(error);
            } else {
               return client.query(ctx_.SQL).then(body => body.rows[0]);
            }

         } else {

            /** 替换返回值处理函数，改变输出结果 */
            result = ctx => client.query(ctx.SQL).then(body => body.rows[0]);

            ctx.SELECT = SELECT;

            return this;

         }

      },
   };

   const promise = Promise.resolve().then(() => {
      for (const item of findQueue) {
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
