import { Schema } from './schema.js';
import insertChain, { type InsertPromise } from './chain/insert.js';
import findChain, { type FindPromise } from './chain/find.js';
import updateChain, { type UpdatePromise } from './chain/update.js';
import deleteChain, { type DeletePromise } from './chain/delete.js';
import type { Options, Data, $Client } from './common.js';
import { clients } from './client.js';

/** 模型实例 */
export interface Model {
  schema: Schema
  options: Options
  client: $Client
  /**
   * 插入单条数据
   * @param entity 插入单条或多条数据
   */
  insert: (...entity: object[]) => InsertPromise
  /**
   * select 查询，等同于 find().select()
   * @param fields 选择字段
   */
  select: (...fields: (string | (() => string))[]) => FindPromise<Data[] | null>
  /**
   * 查询多条数据
   * @param condition 
   */
  find: (condition?: object) => FindPromise<Data[] | null>
  /**
   * 查询单条数据
   * @param condition 筛选条件
   */
  findOne: (condition?: object) => FindPromise<Data | null>
  /**
   * 查询主键
   * @param pid 主键 id
   */
  findPk: (pid: number) => FindPromise<Data | null>
  /**
   * 更新数据
   * @param condition 更新数据
   */
  update: (condition: object) => UpdatePromise
  /**
   * 更新指定主键的数据
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
   * @param options 表路径选项，用于覆盖默认路径 
   *  ```json
   *  { client: 'default', schema: 'public' }
   *  ```
   */
  (options?: Options): Model
}

interface ModelClass {
  new(table: string, schema: Schema): ModelFn
}

const models: { [name: string]: ModelFn } = {};

/**
 * 模型构造函数
 * @param table 表名
 * @param schema 模式实例
 */
// @ts-ignore
export const Model: ModelClass = class {
  schema: Schema
  options: Options
  client: $Client
  /**
   * @param table 表名
   * @param schema schema 实例，表结构信息
   */
  constructor(table: string, schema: Schema) {

    this.schema = schema;

    const { insert, select, find, findOne, findPk, update, updatePk, delete: _delete, deletePk } = this;

    const model: ModelFn = (options?: Options): Model => {

      options = { client: 'default', schema: 'public', table, ...options };

      const client = options.instance || clients[options.client];

      if (client === undefined) throw new Error('client not found');

      return {
        schema,
        client,
        options,
        insert, select, find, findOne, findPk, update, updatePk, delete: _delete, deletePk
      };

    };

    Object.defineProperty(model, "name", { value: table });

    model.schema = schema;
    model.options = { schema: 'public', table };
    model.client = undefined;

    model.insert = insert;
    model.select = select;
    model.find = find;
    model.findOne = findOne;
    model.findPk = findPk;
    model.update = update;
    model.updatePk = updatePk;
    model.delete = _delete;
    model.deletePk = deletePk;

    models[table] = model;

    return model;

  }
  insert(...entity: object[]) {

    const chain = insertChain(this, entity);

    const promise = Promise.resolve().then(async () => {
      const { ctx } = chain;
      for (const item of this.client.insertQueue) { item(ctx); }
      const { error } = ctx;
      if (error) {
        throw new Error(error);
      } else {
        return this.client.query(ctx.SQL).then(body => body.rows);
      }
    });

    Object.assign(promise, chain);

    return promise;

  }
  select(...fields: (string | (() => string))[]) {

    const { schema } = this;

    const chain = findChain<Data[] | null>(this, async ctx => {
      return this.client.query(ctx.SQL).then(body => body.rows);
    });

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

    const chain = findChain<Data[] | null>(this, async ctx => {
      return this.client.query(ctx.SQL).then(body => body.rows);
    });

    if (condition) chain.where(condition);

    return chain;

  }
  findOne(condition: object) {

    const chain = findChain<Data | null>(this, async ctx => {
      return this.client.query(ctx.SQL).then(body => body.rows[0] || null);
    });

    if (condition) chain.where(condition);

    chain.limit(1);

    return chain;

  }
  findPk(pid: number) {

    const { schema } = this;

    const chain = findChain<Data | null>(this, async ctx => {
      return this.client.query(ctx.SQL).then(body => body.rows[0] || null);
    });

    chain.where({ [schema.primaryKey]: pid });

    chain.limit(1);

    chain.ctx.SELECT.push('*');

    return chain;

  }
  update(condition: object) {

    const chain = updateChain(this, async ctx => {
      return this.client.query(ctx.SQL).then(body => {
        if (ctx.RETURNING.length) {
          return body.rows;
        } else {
          const { rowCount } = body;
          return { rowCount };
        }
      })

    });

    chain.where(condition);

    return chain;

  }
  updatePk(pid: number) {

    const { schema } = this;

    const chain = updateChain(this, async ctx => {
      return this.client.query(ctx.SQL).then(body => body.rows[0] || null)
    });

    chain.where({ [schema.primaryKey]: pid });

    chain.ctx.RETURNING.push('*');

    return chain;

  }
  delete(condition: object) {

    const chain = deleteChain(this, async ctx => {
      return this.client.query(ctx.SQL).then(body => {
        if (ctx.RETURNING.length) {
          return body.rows;
        } else {
          const { rowCount } = body;
          return { rowCount };
        }
      });
    });

    if (condition) chain.where(condition);

    return chain;

  }
  deletePk(pid: number) {

    const { schema } = this;

    const chain = deleteChain(this, async ctx => {
      return this.client.query(ctx.SQL).then(body => body.rows[0] || null);
    });

    chain.where({ [schema.primaryKey]: pid });

    chain.ctx.RETURNING.push('*');

    return chain;

  }
}

// 默认 default client 初始化处理
Promise.resolve().then(() => {

  const defaultClient = clients.default;

  if (defaultClient === undefined) {

    throw new Error(`找不到 default client 实例`);

  }

  for (const name in models) {

    models[name].client = defaultClient;

  }

})

