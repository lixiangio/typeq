import type { CTX, Middleware } from './common.js';

/** 查询任务队列 */

export const before = []; // 前置队列
export const after = [];  // 后置队列

export const insert = [];
export const find = [];
export const update = [];
export const del = [];

export const query = []; // 原生 SQL 查询队列

/**注册队列 */
export default {
  /** 添加前置中间件 */
  before(func: Middleware) {
    before.push(func);
  },
  /** 添加 insert 中间件 */
  insert(func: Middleware) {
    insert.push(func);
  },
  /** 添加 select 中间件 */
  find(func: Middleware) {
    find.push(func);
  },
  /** 添加 update 中间件 */
  update(func: Middleware) {
    update.push(func);
  },
  /** 添加 delete 中间件 */
  delete(func: Middleware) {
    del.push(func);
  },
  /** 添加原生 SQL 中间件 */
  query(func: Middleware) {
    query.push(func);
  },
  /** 添加后置中间件 */
  after(func: Middleware) {
    after.push(func);
  },
  /** 添加插件 */
  use(func: Function) {
    func(this);
  }
}

/**
 * 执行 insert 任务队列
 * @param ctx 
 */
export async function queryQueue(ctx: CTX) {
  for (const item of query) {
    await item(ctx);
  }
  return ctx;
}

/**
 * 执行 insert 任务队列
 * @param ctx 
 */
export async function insertQueue(ctx: CTX) {
  for (const item of insert) {
    await item(ctx);
  }
  return ctx;
}

/**
 * 执行 find 任务队列
 * @param ctx 
 */
export async function findQueue(ctx: CTX) {
  for (const item of find) {
    await item(ctx);
  }
  return ctx;
}

export async function updateQueue(ctx: CTX) {
  for (const item of update) {
    await item(ctx);
  }
  return ctx;
}

export async function deleteQueue(ctx: CTX) {
  for (const item of del) {
    await item(ctx);
  }
  return ctx;
}

/** 前置、后置队列预处理，合并操作 */
Promise.resolve().then(() => {

  for (const queue of [insert, find, update, del]) {
    queue.unshift(...before);
    queue.push(...after);
  }

});