import { jsonToSql } from '../safety.js';
import { type CTX, methodKey } from '../common.js';

/**
 * 逻辑选项转 sql
 * @param parameter 每个子节点均为 and 集合，多个子节点之间为 or 集合
 * @param ctx 查询上下文
 */
function converter(parameter: object[], ctx: CTX): string {

   if (parameter.length === 0) throw new Error(`参数不允许为空`);

   const { table } = ctx.paths;
   const { fields } = ctx.schema;

   const OR = [];

   for (const item of parameter) {

      const AND = [];

      for (const name in item) {

         const field = fields[name];

         if (field === undefined) {
            throw ctx.error = new Error(` ${table} 表模型中不存在 ${name} 字段`);
         }


         const value = item[name];

         // 函数运算符，获取其返回值
         if (value instanceof Function) {

            AND.push(`"${name}" ${value(name)}`);

         }

         // 对象
         else if (value instanceof Object) {

            AND.push(`"${name}" = '${jsonToSql(value)}'`);

         } else {

            const result = field[methodKey](value);

            if (result.error) {
               throw ctx.error = new Error(result.error);
            } else {
               AND.push(`"${name}" = ${result.value}`);
            }

         }

      }

      OR.push(`(${AND.join(" AND ")})`);

   }

   if (OR.length === 1) {
      return `${OR.join(" OR ")}`;
   } else {
      return `(${OR.join(" OR ")})`;
   }

}

/**
 * logic 函数链
 * @param parameter 
 */
export default function where(...parameter: object[]) {

   const { ctx } = this;

   const WHERE = converter(parameter, ctx);

   if (WHERE) {

      ctx.WHERE.push(WHERE);

   } else {

      ctx.WHERE.push('TRUE');

   }

   this.and = function (...parameter: object[]) {

      const AND = converter(parameter, ctx);

      if (AND) ctx.WHERE.push(` AND ${AND}`);

      return this;

   };

   this.or = function (...parameter: object[]) {

      const OR = converter(parameter, ctx);

      if (OR) ctx.WHERE.push(` OR ${OR}`);

      return this;

   };

   return this;

}
