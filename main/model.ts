import Schema from './schema.js';
import insertChain from './chain/insert.js';
import findChain from './chain/find.js';
import updateChain from './chain/update.js';
import deleteChain from './chain/delete.js';
import type { Options, BaseChain } from './common.js';

interface Model extends Function {
  insert?: (data: object) => BaseChain<object | object[]>
  select?: (...fields: string[]) => BaseChain<object[]>
  find?: (condition: object) => BaseChain<object[]>
  findOne?: (condition: object) => BaseChain<object>
  findPk?: (pid: number) => BaseChain<object>
}

/** 模型实例集合，供外部引用 */
interface Models {
  [name: string]: Model
}

export const models: Models = {};

/**
 * 模型构造函数
 * @param table 表名
 * @param schema 模式实例
 */
export default function Model(table: string, schema: Schema): Model {

  /**
   * 查询函数链，默认初始化，可静态调用，或实例传参调用
   * @param mixing 配置混合选项
   */
  function model(mixing?: Options) {

    const options = {
      client: 'default',
      schema: 'public',
      table,
    };

    if (mixing) Object.assign(options, mixing);

    const { primaryKey } = schema;

    return {
      /**
       * 插入单条数据
       * @param data 插入单条时输入对象，返回对象，插入多条输入数组
       */
      insert(data: object | object[]): Promise<object | object[]> {

        const chain = insertChain(schema, options, ctx => {
          const { length } = ctx.VALUES;
          const { rows } = ctx.body;
          if (length === 1) {
            return rows[0] || null;
          } else if (length > 1) {
            return rows;
          }
        });

        chain.insert(data);

        return chain;

      },
      /**
       * select 查询，等同于 find().select()
       * @param fields 选择字段
       */
      select(...fields: string[]) {

        const chain = findChain(schema, options, ctx => ctx.body.rows);

        chain.return(...fields);

        return chain;

      },
      /**
       * 查询多条
       * @param condition 
       */
      find(condition: object): Promise<object[]> {

        const chain = findChain(schema, options, ctx => ctx.body.rows);

        if (condition) chain.where(condition);

        return chain;

      },
      /**
       * 查询单条
       * @param condition 筛选条件
       */
      findOne(condition: object): Promise<object | null> {

        const chain = findChain(schema, options, ctx => ctx.body.rows[0] || null);

        if (condition) chain.where(condition);

        chain.limit(1);

        return chain;

      },
      /**
       * 查询主键
       * @param pid 
       */
      findPk(pid: number): Promise<object | null> {

        const chain = findChain(schema, options, ctx => ctx.body.rows[0] || null);

        chain.where({ [primaryKey]: pid });

        chain.limit(1);

        return chain;

      },
      /**
       * 更新单条
       * @param condition 更新数据
       */
      update(condition: object): Promise<object[] | { rowCount:number }> {

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
      /**
       * 更新主键数据
       * @param pid 主键 id 值
       * @param data 更新数据
       */
      updatePk(pid: number, data: object): Promise<object | null> {

        const chain = updateChain(schema, options, ctx => ctx.body.rows[0] || null);

        chain.update(data);

        chain.where({ [primaryKey]: pid });

        return chain;

      },
      /**
       * 删除数据，未指定返回值时，仅返回受影响的数据条数，否则返回 rows
       * @param condition 筛选条件
       */
      delete(condition: object): Promise<object[] | { rowCount:number }> {

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
      /**
       * 删除指定主键的数据
       * @param pid 主键
       */
      deletePk(pid: number): Promise<object | null> {

        const chain = deleteChain(schema, options, ctx => ctx.body.rows[0] || null);

        chain.where({ [primaryKey]: pid });

        chain.return(primaryKey);

        return chain;

      },
    };

  }

  Object.defineProperty(model, "name", { value: table });

  Object.assign(model, model());

  models[table] = model;

  model.schema = schema;

  return model;

};
