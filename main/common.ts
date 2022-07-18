import Schema from './schema.js';

export const methodKey = Symbol("methodKey");

export interface Data { [index: string]: any }

/**
 * 模型实例选项
 */
export interface Options {
  /** 实体表名称 */
  table?: string
  /** 客户端名称 */
  client?: string | 'default'
  /** PG Schema 名称 */
  schema?: string | 'public'
}

/** 查询上下文 */
export interface CTX {
  options: Options
  schema?: Schema
  /** where 逻辑条件集合 */
  WHERE?: string[]
  /** 返回字段集合 */
  RETURNING?: string[]
  /** 合成 SQL 字符串 */
  SQL?: string
  [index: string]: any
}

export interface Middleware {
  (ctx: CTX): void
}

/** 逻辑赛选条件 */
export interface Condition {
  [index: string]: any
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
