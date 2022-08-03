import { methodKey, type CTX } from '../common.js';
import { type Model } from '../model.js';

const { hasOwnProperty } = Object.prototype;

interface Chain {
   ctx: CTX
   /**
    * 在插入数据时，如果数据不存在，执行 insert 操作，否则执行 update 操作
    * @param field 冲突约束字段名
    * @param update 发生冲突时执行更新操作
    */
   conflict: (field: string, update?: boolean) => InsertPromise
   /**
    * 返回指定字段
    */
   return: (...fields: string[]) => InsertPromise
   /**
    * 排除指定字段
    */
   _return: (...fields: string[]) => InsertPromise
}

export type InsertPromise = Promise<{ [namy: string]: any }[]> & Partial<Chain>;

export default function (model: Model, entity: object[]): Chain {

   const { schema, client, options } = model;

   const KEYS = [], VALUES = [];

   const { primaryKey, fields } = schema;

   const ctx = {
      schema,
      client,
      options,
      KEYS,
      VALUES,
      ON: '',
      RETURNING: [`"${primaryKey}"`],
      SQL: undefined,
      body: undefined,
      error: undefined
   };

   const { schema: schemaName, table } = options;

   for (const index in entity) {
      VALUES[index] = [];
   }

   for (const key in fields) {

      const options = fields[key];
      const method = options[methodKey];

      KEYS.push(`"${key}"`);

      for (const index in entity) {

         const item = entity[index];
         const VALUE = VALUES[index];

         if (hasOwnProperty.call(item, key)) {

            const { error, value } = method(item[key], [schemaName, table, key]); // 类型验证函数

            if (error) throw ctx.error = new TypeError(error);

            VALUE.push(value);

         }

         // 字段无匹配数据
         else {

            // 默认值填充
            if (hasOwnProperty.call(options, 'default')) {

               VALUE.push(options.default);

            }

            // 可选值，用 DEFAULT 填充占位
            else if (options.optional === true) {

               VALUE.push('DEFAULT');


            } else {

               throw ctx.error = new TypeError(`${key} 字段值不允许为空`);

            }

         }

      }

   }

   return {
      ctx,
      conflict(field: string = primaryKey, update: boolean = false) {

         if (update) {

            const SET = [];
            const [VALUE] = VALUES; // 仅适用于单行插入

            for (const index in KEYS) {
               const name = KEYS[index];
               const value = VALUE[index];
               SET.push(`${name} = ${value}`);
            }

            ctx.ON = ` ON conflict("${field}") DO UPDATE SET ${SET}`;

         } else {

            ctx.ON = ` ON conflict("${field}") DO NOTHING`;

         }

         return this;

      },
      return(...names: string[]) {

         const RETURNING = [];

         for (const key of names) {
            if (fields[key]) {
               RETURNING.push(`"${key}"`);
            } else {
               throw ctx.error = new TypeError(`${table} 模型中找不到 ${key} 字段`);
            }
         }

         if (RETURNING.length === 0) {
            ctx.RETURNING = ['*'];
         } else {
            ctx.RETURNING = RETURNING;
         }

         return this;

      },
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
   };

};
