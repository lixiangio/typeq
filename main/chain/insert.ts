import Schema from '../schema.js';
import { methodKey } from '../common.js';
import { insertQueue } from '../queue.js';
import type { Options, Result } from '../common.js';

const { hasOwnProperty } = Object.prototype;

interface InsertChain extends Promise<any> {
   insert?: (data: object[] | object) => this
   conflict?: (field: string, update: boolean) => this
   return?: (...fields: string[]) => this
   _return?: (...exclude: string[]) => this
}

export default function (schema: Schema, options: Options, result: Result): InsertChain {

   const KEYS = [], VALUES = [];

   const { primaryKey, fields } = schema;

   const ctx = {
      options,
      schema,
      KEYS,
      VALUES,
      ON: '',
      RETURNING: [`"${primaryKey}"`],
      body: undefined,
      error: undefined
   };

   const promise = Promise.resolve().then(() => {
      const { error } = ctx;
      if (error) {
         return { error };
      } else {
         return insertQueue(ctx).then(result);
      }
   });

   Object.assign(promise, {
      ctx,
      /**
       * 插入新数据
       * @param entity 数据实体
       */
      insert(entity: object | object[]) {

         if (typeof entity !== 'object') {
            throw ctx.error = new Error('参数必须为对象类型');
         }

         /** 将单条和多条数据，统一按多条处理 */
         const list = Array.isArray(entity) ? entity : [entity];

         for (const index in list) {
            VALUES[index] = [];
         }

         for (const key in fields) {

            const options = fields[key];
            const method = options[methodKey];

            KEYS.push(`"${key}"`);

            for (const index in list) {

               const item = list[index];
               const VALUE = VALUES[index];

               if (hasOwnProperty.call(item, key)) {

                  const child = item[key];

                  const { error, value } = method(child, ctx.options, key); // 类型验证函数

                  if (error) {

                     throw ctx.error = new TypeError(error);

                  }

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

         return this;

      },
      /**
       * 在插入数据时,如果数据不存在，执行 insert 操作，否则执行 update 操作
       * @param field 冲突字段值约束
       * @param update 发生冲突时执行更新操作
       */
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
      /**
       * 返回指定字段
       */
      return(...names: string[]) {

         const RETURNING = [];

         for (const key of names) {
            if (fields[key]) {
               RETURNING.push(`"${key}"`);
            } else {
               throw ctx.error = new TypeError(`${key}字段无效`);
            }
         }

         ctx.RETURNING = RETURNING;

         return this;

      },
      /**
       * 排除指定字段
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
