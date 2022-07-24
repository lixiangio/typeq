import Schema from './schema.js';

export const methodKey = Symbol("methodKey");

export interface Data { [index: string]: any }

/**
 * 实体表路径选项
 */
export interface Paths {
  /** 客户端名称 */
  client?: string | 'default'
  /** PG Schema 名称 */
  schema?: string | 'public'
  /** 实体表名称 */
  table?: string
}

/** 查询上下文 */
export interface CTX {
  paths: Paths
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
