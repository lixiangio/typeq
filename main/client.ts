import { queryQueue } from './queue.js';

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
      const ctx = {
        options: { client },
        SQL
      }
      return queryQueue(ctx).then(ctx => ctx.body);
    },
    /**
     * 同步单个模型
     * @param path schema.table 路径
     * @param mode 同步模式
     */
    async sync(model, mode = 'default') {

      const { fields } = model.schema;

      const ctx = {
        options: { client },
        SQL: ''
      }
      
      return queryQueue(ctx).then(ctx => ctx.body);

    },
    /**
     * 批量同步所有模型
     * @param schema pg 中表分组（架构）
     * @param mode 同步模式
     */
    async syncs(schema = 'public', mode: string) {

      return

    },
    /**
   * 创建事务对象
   */
    async transaction() {

      return

    },
  }

}