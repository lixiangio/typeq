import { type Return, type CTX } from '../common.js';

/** 类型验证方法 */
export interface Method {
  /** 
   * @param entity 实体数据
   * @param option 选项值
   * @param ctx 查询上下文
   * @param path 字段路径
   */
  (entity: any, option: any, ctx: CTX, path: string): Return
}

/** 类型选项 */
export interface TypeOptions {
  /** 默认值 */
  default?: unknown
  /** 可选属性 */
  optional?: boolean
  /** set 赋值函数 */
  set?(data: unknown): unknown
  /** 其它扩展选项 */
  [index: string]: unknown
}

/** 类型选项映射方法的有序集合 */
export interface QueryMethods {
  /** 
   * 默认值
   * @param entity 数据实体
   * @param defaultValue 默认值
  */
  default(entity: unknown, defaultValue: string): Return
  /** 
   * 可选值
   * @param type 类型函数、类型对象或结构体
   * @param isOptional 是否可选
   */
  optional(type: unknown, isOptional: boolean): Return
  /**
   * 类型验证
   * @param entity 数据实体
   */
  type(entity: unknown): Return
  [index: string]: (entity: unknown, option: unknown, paths: string[]) => Return
}