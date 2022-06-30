import Schema from './schema.js';

export const methodKey = Symbol("methodKey");

// interface Fn {
//   (data: any, instance?: object): { error?: string, value?: any }
// }

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
  error?: string,
  value?: any
  next?: boolean
}

// interface Result {
//   value?: unknown,
//   error?: string
// }

// interface Types {
//   [name: string]: {
//     (options: object): {
//       type: () => Result
//     }
//   }
// }

export interface BaseChain<T> extends Promise<T> {
  where?: (...fields: Condition[]) => this
  and?: (...fields: Condition[]) => this
  or?: (...fields: Condition[]) => this
  /**
   * 返回字段
   */
  return?: (...select: string[] | Function[]) => this
  /**
   * 排除字段
   */
  _return?: (...select: string[]) => this
}
