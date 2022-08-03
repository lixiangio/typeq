import { Schema } from './schema.js';

export const methodKey = Symbol("methodKey");

export interface Data { [name: string]: any };

/** 表返回数据主体 */
export interface Body {
  command?: string
  rows?: { [name: string]: any }[]
  rowCount?: number
  // [name: string]: any
}

export interface Middleware { (ctx: CTX): void }

/** 多态客户端实例 */
export interface $Client {
  insertQueue: Middleware[]
  findQueue: Middleware[] 
  updateQueue: Middleware[] 
  deleteQueue: Middleware[]
  query(sql: string): Promise<Body>
  connect?(): Promise<$Client>
}

/**
 * 实体表路径选项
 */
export interface Options {
  /** 客户端名称 */
  client?: string
  /** PG Schema 名称 */
  schema?: string
  /** 实体表名称 */
  table?: string
  /** 客户端实例 */
  instance?: $Client
  [name: string]: any
}

/** 查询上下文 */
export interface CTX {
  options?: Options
  schema?: Schema
  client?: $Client
  /** where 逻辑条件集合 */
  WHERE?: string[]
  /** 返回字段集合 */
  RETURNING?: string[]
  /** 合成 SQL 字符串 */
  SQL?: string
  /** 表返回数据主体 */
  body?: Body
  [name: string]: any
}

/** 逻辑筛选条件 */
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
