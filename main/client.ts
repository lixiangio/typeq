import { query } from './index.js';
import type { ModelFn } from './model.js';

/**
 * 获取指定客户端
 * @param client 客户端名称
 */
export default function (client: string = 'default') {

  return {
    /**
     * SQL 查询方法
     */
    query(SQL: string) {

      return query({ options: { client }, SQL }).then(ctx => ctx.body);

    },
    /**
   * 创建事务对象
   */
    async transaction() {

      return

    },
  }

}