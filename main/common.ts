import Schema from './schema.js';

export const methodKey = Symbol("methodKey");

/**
 * 模型实例选项
 */
export interface Options {
  table?: string
  client?: string | 'default'
  schema?: string | 'public'
}

/** 查询上下文 */
export interface CTX {
  options: Options
  schema?: Schema
  WHERE?: string[]
  RETURNING?: string[]
  SQL?: string
  [name: string]: any
}

/** 函数链 Promise 返回值处理函数 */
export interface Result {
  (ctx: CTX): unknown
}

export interface Middleware {
  (ctx: CTX): void
}

/** 逻辑赛选条件 */
export interface Condition {
  [name: string]: any
}

interface Item {
  type: string,
  default?: boolean,
  primaryKey?: boolean,
}

export interface Fields {
  [name: string]: Item | string
}

export interface Return {
  value?: any
  error?: string,
  next?: boolean
}

export interface BaseChain {
  ctx: CTX
  /**
   * where 逻辑过滤条件，等同于 and
   */
  where: (...fields: Condition[]) => this
  /**
   * and 逻辑过滤条件
   */
  and: (...fields: Condition[]) => this
  /**
   * or 逻辑过滤条件
   */
  or: (...fields: Condition[]) => this
  /**
   * 返回指定字段，未指定字段时，返回全部字段
   */
  return: (...fields: (string | (() => string))[]) => this
  /**
   * 不返回指定字段
   */
  _return: (...fields: string[]) => this
}
