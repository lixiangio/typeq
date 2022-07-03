import { type Return, type CTX } from '../common.js';

/** 类型验证方法 */
export interface Method {
  /** 
   * @param entity 实体数据
   * @param ctx 查询上下文
   * @param path 字段路径
   */
  (entity: any, option, ctx: CTX, path: string): Return
}

/** 字段选项 */
export interface TypeOptions {
  /** 默认值 */
  default?: any
  /** 可选属性 */
  optional?: boolean
  /** set 赋值函数 */
  set?(data: unknown): unknown
  /** 其它扩展选项 */
  [index: string]: unknown
}

/** 类型选项方法集合 */
export interface OptionMethods {
  // /**
  //  * 类型验证
  //  * @param entity 数据实体
  //  */
  // type(entity: any): Return
  [index: string]: (entity: any, option: any, ctx: CTX, path: string) => Return
}