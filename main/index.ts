export { default as Schema } from './schema.js';
export { default as createType } from './types/createType.js';
export { default as Struct } from './types/createStruct.js';
export { default as Model, stopQuery } from './model.js';
export { default as VModel } from './vmodel.js';
export { default as operator } from './operator/index.js';
export * from './safety.js';

import queue from './queue.js';
import pgsql from "./pgsql.js";
import type { CTX, Body } from './common.js';

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

interface Client {
  query(sql: string): Promise<Body>
  [name: string]: any
}

/** 客户端集合 */
export const clients: { [name: string]: Client } = {};

/** 创建客户端集合 */
export class Clients {
  /**
   * 
   * @param client 客户端实例化函数 
   * @param configs 数据库配置选项，兼容 pg 模块
   */
  constructor(client: (config: Configs['name']) => Client, configs: Configs) {

    for (const name in configs) {
      clients[name] = client(configs[name]);
    }

    return clients;

  }
}

/** SQL 查询 */
export async function query(ctx: CTX): Promise<CTX> {

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
export function client(client: string = 'default') {

  return {
    /**
     * SQL 查询方法
     */
    async query(SQL: string) {

      return query({ paths: { client }, SQL }).then(ctx => ctx.body);

    },
    /**
     * 创建事务对象
     */
    async transaction() {

      return {
        rollback() {

        },
        commit() {

        }
      }

    },
  }

}

export { queue };
