import { sqlString } from '../safety.js';
import type { CTX } from '../common.js';

/**
 * 逻辑选项转 sql
 * @param parameter 每个子节点均为 and 集合，多个子节点之间为 or 集合
 * @param ctx 查询上下文
 */
function converter(parameter: object[], ctx: CTX): string {

   if (parameter.length === 0) throw new Error(`参数不允许为空`);

   const { table } = ctx.options;
   const { fields } = ctx.schema;

   const OR = [];

   for (const item of parameter) {

      const AND = [];

      for (const name in item) {

         if (fields[name] === undefined) {
            throw ctx.error = new Error(` ${table} 表模型中不存在 ${name} 字段`);
         }

         const field = `"${name}"`;
         const value = item[name];

         // 函数运算符
         if (value instanceof Function) {

            AND.push(`${field} ${value(field)}`);

         }

         // 对象
         else if (value instanceof Object) {

            AND.push(`${field} = '${sqlString(JSON.stringify(value))}'`);

         } else {

            AND.push(`${field} = '${sqlString(value)}'`);

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
