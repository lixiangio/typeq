import Schema from './schema.js';

export const methodKey = Symbol("methodKey");

export interface Data { [index: string]: any }

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
