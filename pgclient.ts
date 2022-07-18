import pg from 'pg';

const { Pool, types } = pg;

// oid扩展
// 参考链接https://github.com/brianc/node-pg-types
const expand = { numrange: 3906 };

types.setTypeParser(expand.numrange, (data: string) => JSON.parse(data));


  /** SQL 查询中间件 */
export default function  (config) {

  return new Pool(config);

};