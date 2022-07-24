import Schema from './schema.js';
import createType from './types/createType.js';
import Struct from './types/createStruct.js';
import Model, { models, stopQuery } from './model.js';
import VModel from './vmodel.js';
import operator from './operator/index.js';
import queue from './queue.js';
import pgsql from "./pgsql.js";
import type { CTX } from './common.js';

export * from './safety.js';

queue.use(pgsql);

/**
 * 数据库配置选项，兼容 pg 模块
 */
interface Configs {
  [name: string]: Partial<{
    host: string,
    database: string,
    user: string
    password: string,
    port: number | 5432,
    connectionString: string,
  }>
}

interface Body {
  command: string
  rowCount: number
  rows: object[]
  fields: object[]
}

interface Client {
  query(sql: string): Promise<Body>
  [name: string]: any
}

/** 客户端集合 */
export const clients: { [name: string]: Client } = {};

/** 创建客户端集合 */
export class Clients {

  constructor(pool: (config: Configs['name']) => Client, configs: Configs) {

    for (const name in configs) {
      clients[name] = pool(configs[name]);
    }

    return clients;

  }

}

/** SQL 查询 */
async function query(ctx: CTX): Promise<CTX> {

  const { client: name } = ctx.paths;
  const client = clients[name];

  if (client) {
    ctx.body = await client.query(ctx.SQL);
  } else {
    throw new Error(`client ${name} not found `);
  }

  return ctx;

}

/**
 * 获取指定客户端
 * @param client 客户端名称
 */
function client(client: string = 'default') {

  return {
    /**
     * SQL 查询方法
     */
    query(SQL: string): Promise<any> {

      return query({ paths: { client }, SQL }).then(ctx => ctx.body);

    },
    /**
   * 创建事务对象
   */
    async transaction() {

      return

    },
  }

}

export { Schema, createType, Struct, Model, VModel, models, queue, client, query, operator, stopQuery };
