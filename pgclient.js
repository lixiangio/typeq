import pg from 'pg';
const { Pool, types } = pg;
// oid扩展
// 参考链接https://github.com/brianc/node-pg-types
const expand = { numrange: 3906 };
types.setTypeParser(expand.numrange, (data) => JSON.parse(data));
/** 客户端集合 */
export const clients = {};
/** SQL 查询中间件 */
async function context(ctx) {
    const cname = ctx.options.client;
    const client = clients[cname];
    if (client) {
        await client.query(ctx.SQL).then(body => ctx.body = body);
    }
    else {
        throw new Error(`client ${cname} not found `);
    }
}
/**
 * postgresql client 配置函数
 * @param config 数据库连接配置选项
 */
export default function (config) {
    for (const name in config) {
        clients[name] = new Pool(config[name]);
    }
    /**
     * postgresql client 中间件
     * @param queue
     */
    return function (queue) {
        queue.insert(context);
        queue.find(context);
        queue.update(context);
        queue.delete(context);
        queue.query(context);
    };
}
