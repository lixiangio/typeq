import Schema from './schema.js';
import Type from './types/createType.js';
import Struct from './types/createStruct.js';
import Model, { models, stop } from './model.js';
import VModel from './vmodel.js';
import operator from './operator/index.js';
import queue from './queue.js';
import pgsql from "./pgsql.js";
import client from './client.js'
import type { CTX } from './common.js';

export * from './safety.js';

queue.use(pgsql);

/**
 * 数据库配置选项，兼容 pg 模块
 */
interface Configs {
  [name: string]: {
    host?: string,
    database?: string,
    user?: string
    password?: string,
    port?: number | 5432,
    connectionString?: string,
  }
}

/** 客户端集合 */
export const clients = {};

/** 创建客户端集合 */
export class Clients {

  constructor(pool: (config: Configs['name']) => object, configs: Configs) {

    for (const name in configs) {
      clients[name] = pool(configs[name]);
    }

    return clients;

  }

}

/** 提交 SQL 查询 */
async function query(ctx: CTX) {

  const cname = ctx.options.client;
  const client = clients[cname];

  if (client) {
    await client.query(ctx.SQL).then(body => ctx.body = body);
  } else {
    throw new Error(`client ${cname} not found `);
  }

  return ctx;

}

export { Schema, Type, Struct, Model, VModel, models, queue, client, query, operator, stop };
