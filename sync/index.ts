import { query } from '../main/index.js';
import type { ModelFn } from '../main/model.js';

export default {
  /**
 * 同步单个模型
 * @param model 数据模型
 * @param mode 同步模式
 */
  async sync(model: ModelFn, { schema = 'public', mode = 'default' }) {

    const { fields } = model.schema;

    return query({ options: { client }, SQL: '' }).then(ctx => ctx.body);

  },
  /**
   * 批量同步所有模型
   * @param schema pg 中表分组（架构）
   * @param mode 同步模式
   */
  async syncAll({ schema = 'public', mode: string }) {

    return

  },
}