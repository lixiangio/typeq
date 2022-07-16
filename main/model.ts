import Schema from './schema.js';
import insertChain, { type InsertPromise } from './chain/insert.js';
import findChain, { type FindPromise } from './chain/find.js';
import updateChain, { type UpdatePromise } from './chain/update.js';
import deleteChain, { type DeletePromise } from './chain/delete.js';
import type { Options, Data } from './common.js';

/** 模型实例 */
export interface Model {
  /**
   * 插入单条数据
   * @param entity 插入单条时输入对象，返回对象，插入多条输入数组
   */
  insert: (...entity: object[]) => InsertPromise
  /**
   * select 查询，等同于 find().select()
   * @param fields 选择字段
   */
  select: (...fields: (string | (() => string))[]) => FindPromise<Data[] | null>
  /**
   * 查询多条
   * @param condition 
   */
  find: (condition?: object) => FindPromise<Data[] | null>
  /**
   * 查询单条
   * @param condition 筛选条件
   */
  findOne: (condition?: object) => FindPromise<Data | null>
  /**
   * 查询主键
   * @param pid 
   */
  findPk: (pid: number) => FindPromise<Data | null>
  /**
   * 更新单条
   * @param condition 更新数据
   */
  update: (condition: object) => UpdatePromise
  /**
   * 更新主键数据
   * @param pid 主键 id 值
   */
  updatePk: (pid: number) => UpdatePromise
  /**
   * 删除数据，未指定返回值时，仅返回受影响的数据条数，否则返回 rows
   * @param condition 筛选条件
   */
  delete: (condition: object) => DeletePromise
  /**
   * 删除指定主键的数据
   * @param pid 主键
   */
  deletePk: (pid: number) => DeletePromise
}

/** 模型实例方法，调用静态方法时使用默认的初始值，传参调用可覆盖初始值 */
export interface ModelFn extends Partial<Model> {
  /**
   * 查询函数链，默认初始化，可静态调用，或实例传参调用
   * @param mixing 配置混合选项
   */
  (mixing?: Options): Model
  schema: Schema
}

/** 模型实例集合，供外部引用 */
export const models: { [name: string]: ModelFn } = {};

interface ModelClass { new(table: string, schema: Schema): ModelFn }

/**
 * 模型构造函数
 * @param table 表名
 * @param schema 模式实例
 */
// @ts-ignore
const Model: ModelClass = function (table: string, schema: Schema): ModelFn {

  const modelFn = (mixing?: Options): Model => {

    const options = { client: 'default', schema: 'public', table };

    if (mixing) Object.assign(options, mixing);

    const { primaryKey, fields: schemaFields } = schema;

    return {
      insert(...entity: object[]) {

        return insertChain(schema, options, entity, ctx => {
          const { rows } = ctx.body;
          return rows;
        });

      },
      select(...fields: (string | (() => string))[]) {

        const chain = findChain<Data[] | null>(schema, options, ctx => ctx.body.rows);

        const { ctx } = chain;
        const { SELECT } = ctx;

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

        return chain;

      },
      find(condition: object) {

        const chain = findChain<Data[] | null>(schema, options, ctx => ctx.body.rows);

        if (condition) chain.where(condition);

        return chain;

      },
      findOne(condition: object) {

        const chain = findChain<Data | null>(schema, options, ctx => ctx.body.rows[0] || null);

        if (condition) chain.where(condition);

        chain.limit(1);

        return chain;

      },
      findPk(pid: number) {

        const chain = findChain<Data | null>(schema, options, ctx => ctx.body.rows[0] || null);

        chain.where({ [primaryKey]: pid });

        chain.limit(1);

        return chain;

      },
      update(condition: object) {

        const chain = updateChain(schema, options, ctx => {
          if (ctx.RETURNING.length) {
            return ctx.body.rows;
          } else {
            const { rowCount } = ctx.body;
            return { rowCount };
          }
        });

        chain.where(condition);

        return chain;

      },
      updatePk(pid: number) {

        const chain = updateChain(schema, options, ctx => ctx.body.rows[0] || null);

        chain.where({ [primaryKey]: pid });

        return chain;

      },
      delete(condition: object) {

        const chain = deleteChain(schema, options, ctx => {
          if (ctx.RETURNING.length) {
            return ctx.body.rows;
          } else {
            const { rowCount } = ctx.body;
            return { rowCount };
          }
        });

        if (condition) chain.where(condition);

        return chain;

      },
      deletePk(pid: number) {

        const chain = deleteChain(schema, options, ctx => ctx.body.rows[0] || null);

        chain.where({ [primaryKey]: pid });

        chain.return(primaryKey);

        return chain;

      }
    };

  };

  Object.defineProperty(modelFn, "name", { value: table });

  Object.assign(modelFn, modelFn());

  modelFn.schema = schema;

  models[table] = modelFn;

  return modelFn;

};

export default Model;
