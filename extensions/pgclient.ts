import pg from 'pg';
import Queue from '../main/queue.js';

const { Pool, types } = pg;

// oid扩展
// 参考链接https://github.com/brianc/node-pg-types
const expand = { numrange: 3906 };

types.setTypeParser(expand.numrange, (data: string) => JSON.parse(data));

/** 客户端集合 */
export const clients = {};

/** SQL 查询中间件 */
async function context(ctx) {

  const cname = ctx.options.client;
  const client = clients[cname];

  if (client) {
    await client.query(ctx.SQL).then(body => ctx.body = body);
  } else {
    throw new Error(`client ${cname} not found `);
  }

}

/**
 * 数据库配置选项
 */
interface Config {
  [name: string]: {
    host?: string,
    database?: string,
    user?: string
    password?: string,
    port?: number | 5432,
  }
}

/**
 * postgresql client 配置函数
 * @param config 数据库连接配置选项
 */
export default function (config: Config) {

  for (const name in config) {
    clients[name] = new Pool(config[name]);
  }

  /**
   * postgresql client 中间件
   * @param queue 
   */
  return function (queue: typeof Queue) {

    queue.insert(context);

    queue.find(context);

    queue.update(context);

    queue.delete(context);

    queue.query(context);
    
  }

}
