import Schema from './schema.js';
import insertChain, { type InsertPromise } from './chain/insert.js';
import findChain, { type FindPromise } from './chain/find.js';
import updateChain, { type UpdatePromise } from './chain/update.js';
import deleteChain, { type DeletePromise } from './chain/delete.js';
import type { Paths, Data, CTX } from './common.js';

/** 模型实例 */
export interface Model {
  schema: Schema
  paths: Paths
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
export interface ModelFn extends Model {
  /**
   * 查询函数链，默认初始化，可静态调用，或实例传参调用
   * @param paths 表路径选项，用于覆盖默认路径 
   *  ```json
   *  { client: 'default', schema: 'public' }
   *  ```
   */
  (paths?: Paths): Model
}

/** 模型实例集合，供外部引用 */
export const models: { [name: string]: ModelFn } = {};

interface ModelClass {
  new(table: string, schema: Schema): ModelFn
}

/**
 * 模型构造函数
 * @param table 表名
 * @param schema 模式实例
 */
// @ts-ignore
const Model: ModelClass = class {
  schema: Schema
  paths: Paths = { client: 'default', schema: 'public', table: undefined }
  /**
   * 
   * @param table 表名
   * @param schema schema 实例，表结构信息
   */
  constructor(table: string, schema: Schema) {

    this.schema = schema;
    this.paths.table = table;

    const { insert, select, find, findOne, findPk, update, updatePk, delete: _delete, deletePk } = this;

    const modelFn = (paths?: Paths): Model => {

      return { schema, paths: { ...this.paths, ...paths }, insert, select, find, findOne, findPk, update, updatePk, delete: _delete, deletePk };

    };

    Object.defineProperty(modelFn, "name", { value: table });

    modelFn.schema = schema;
    modelFn.paths = this.paths;

    modelFn.insert = insert;
    modelFn.select = select;
    modelFn.find = find;
    modelFn.findOne = findOne;
    modelFn.findPk = findPk;
    modelFn.update = update;
    modelFn.updatePk = updatePk;
    modelFn.delete = _delete;
    modelFn.deletePk = deletePk;

    models[table] = modelFn;

    return modelFn;

  }
  insert(...entity: object[]) {

    return insertChain(this.schema, this.paths, entity, ctx => {
      const { rows } = ctx.body;
      return rows;
    });

  }
  select(...fields: (string | (() => string))[]) {

    const { schema } = this;

    const chain = findChain<Data[] | null>(schema, this.paths, ctx => ctx.body.rows);

    const { ctx } = chain;
    const { SELECT } = ctx;

    for (const field of fields) {
      if (typeof field === 'string') {
        if (schema.fields[field]) {
          SELECT.push(`"${field}"`);
        } else {
          throw ctx.error = new Error(`${field} 字段不存在`);
        }
      } else if (typeof field === 'function') {
        SELECT.push(field());
      }
    }

    return chain;

  }
  find(condition: object) {

    const chain = findChain<Data[] | null>(this.schema, this.paths, ctx => ctx.body.rows);

    if (condition) chain.where(condition);

    return chain;

  }
  findOne(condition: object) {

    const chain = findChain<Data | null>(this.schema, this.paths, ctx => ctx.body.rows[0] || null);

    if (condition) chain.where(condition);

    chain.limit(1);

    return chain;

  }
  findPk(pid: number) {

    const { schema } = this;

    const chain = findChain<Data | null>(schema, this.paths, ctx => ctx.body.rows[0] || null);

    chain.where({ [schema.primaryKey]: pid });

    chain.limit(1);

    chain.ctx.SELECT.push('*');

    return chain;

  }
  update(condition: object) {

    const chain = updateChain(this.schema, this.paths, ctx => {
      if (ctx.RETURNING.length) {
        return ctx.body.rows;
      } else {
        const { rowCount } = ctx.body;
        return { rowCount };
      }
    });

    chain.where(condition);

    return chain;

  }
  updatePk(pid: number) {

    const { schema } = this;

    const chain = updateChain(schema, this.paths, ctx => ctx.body.rows[0] || null);

    chain.where({ [schema.primaryKey]: pid });

    chain.ctx.RETURNING.push('*');

    return chain;

  }
  delete(condition: object) {

    const chain = deleteChain(this.schema, this.paths, ctx => {
      if (ctx.RETURNING.length) {
        return ctx.body.rows;
      } else {
        const { rowCount } = ctx.body;
        return { rowCount };
      }
    });

    if (condition) chain.where(condition);

    return chain;

  }
  deletePk(pid: number) {

    const { schema } = this;

    const chain = deleteChain(schema, this.paths, ctx => ctx.body.rows[0] || null);

    chain.where({ [schema.primaryKey]: pid });

    chain.ctx.RETURNING.push('*');

    return chain;

  }
}

/** 阻断 query 执行 */
export function stopQuery(model: InsertPromise | FindPromise | UpdatePromise | DeletePromise): Promise<CTX> {

  const { ctx } = model;

  ctx.error = 'stop';

  return model.then(() => ctx);

}

export default Model;
